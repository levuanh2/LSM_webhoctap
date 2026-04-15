import api from './axiosInstance';

export interface CourseRecommendationResponse {
  user_id: string;
  recommended_courses: string[];
}

export interface LearningPathResponse {
  path: string[];
  goal_course_id?: string;
  message?: string;
}

export interface DropoutRiskResponse {
  user_id: string;
  risk_level: string; // LOW | MEDIUM | HIGH
  probability: number; // 0..1 (fallback) or model confidence
  factors?: Record<string, unknown>;
  /** Gợi ý từ AI (tiếng Anh từ model) — hiển thị nhẹ nhàng ở UI */
  reasons?: string[];
}

export interface ReviewCheckRequest {
  lesson_title: string;
  lesson_content: string;
  q1_prompt: string;
  q2_prompt: string;
  q1_answer: string;
  q2_answer: string;
}

export interface ReviewCheckResponse {
  score: number; // 0..100
  verdict: string;
  strengths: string[];
  improvements: string[];
  keyword_coverage?: {
    top_keywords?: string[];
    hits?: string[];
    coverage_ratio?: number;
    steps_q2?: number;
  };
}

export interface ReviewStartRequest {
  lesson_id: string;
  course_id: string;
  lesson_title?: string;
  lesson_content?: string;
}

export interface ReviewStartResponse {
  session_id: string;
  question: string;
}

export interface ReviewSubmitRequest {
  session_id: string;
  answer: string;
}

export interface ReviewResponse {
  is_pass: boolean;
  feedback: string;
  score: number; // 0..100
}

export interface AdviseCoursesRequest {
  userId: string;
  goalText?: string;
  courses: Array<{
    id: string;
    title: string;
    category: string;
    level: string;
    description?: string;
  }>;
}

export interface AdviseCoursesResponse {
  message: string;
  recommended_ids: string[];
}

export const aiApi = {
  /**
   * Trợ lý Ollama: phân tích catalog do client gửi — lời khuyên tiếng Việt + gợi ý thứ tự khóa.
   */
  adviseCourses: async (payload: AdviseCoursesRequest): Promise<AdviseCoursesResponse> => {
    const res = await api.post<AdviseCoursesResponse>('/ai/advise/courses', {
      user_id: payload.userId,
      goal_text: payload.goalText?.trim() || null,
      courses: payload.courses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        level: c.level,
        description: c.description || '',
      })),
    });
    return res.data;
  },

  getRecommendations: async (
    userId: string,
    opts?: { goalText?: string; goalCourseId?: string }
  ): Promise<CourseRecommendationResponse> => {
    const params: Record<string, string> = {};
    const t = opts?.goalText?.trim();
    if (t) params.goal_text = t;
    const gid = opts?.goalCourseId?.trim();
    if (gid) params.goal_course_id = gid;
    const res = await api.get<CourseRecommendationResponse>(`/ai/recommend/${encodeURIComponent(userId)}`, {
      params,
    });
    return res.data;
  },

  /**
   * /ai/learning-path — ưu tiên goal_course_id (UUID khóa trong catalog) để đồ thị prerequisite khớp DB.
   * goal_text chỉ dùng khi không đoán được khóa (khớp mơ hồ trong CSV AI).
   */
  getLearningPath: async (
    userId: string,
    payload: { goalText: string; goalCourseId?: string }
  ): Promise<LearningPathResponse> => {
    const params: Record<string, string> = { user_id: userId };
    const gid = payload.goalCourseId?.trim();
    if (gid) {
      params.goal_course_id = gid;
    }
    const t = payload.goalText?.trim();
    if (t) {
      params.goal_text = t;
    }
    const res = await api.get<LearningPathResponse>(`/ai/learning-path`, { params });
    return res.data;
  },

  getDropoutRisk: async (userId: string): Promise<DropoutRiskResponse> => {
    const res = await api.get<DropoutRiskResponse>(`/ai/dropout/${encodeURIComponent(userId)}`);
    return res.data;
  },

  startReview: async (payload: ReviewStartRequest): Promise<ReviewStartResponse> => {
    const res = await api.post<ReviewStartResponse>(`/ai/review/start`, payload);
    return res.data;
  },

  submitReview: async (payload: ReviewSubmitRequest): Promise<ReviewResponse> => {
    const res = await api.post<ReviewResponse>(`/ai/review/submit`, payload);
    return res.data;
  },
  checkReview: async (payload: ReviewCheckRequest): Promise<ReviewCheckResponse> => {
    const res = await api.post<ReviewCheckResponse>(`/ai/review/check`, payload);
    return res.data;
  },
};

