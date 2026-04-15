import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem } from '@mui/material';
import { COURSE_CATEGORY_OPTIONS, isPresetCategory } from '../../constants/courseCategories';
import { adminCourseApi, courseApi, CourseDetailDto, CourseDto, LessonDto } from '../../services/api';
import { getRole } from '../../utils/auth';

const CoursesAdmin = () => {
  const role = getRole();
  const isTeacher = role === 'teacher';
  const [rows, setRows] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CourseDto | null>(null);
  const thumbFileRef = useRef<HTMLInputElement>(null);
  const MAX_THUMB_BYTES = 400 * 1024;

  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    category: 'Backend Development',
    price: 0,
    thumbnailUrl: '',
  });

  /** Quản lý bài học trong khóa */
  const [lessonsFor, setLessonsFor] = useState<CourseDto | null>(null);
  const [courseDetail, setCourseDetail] = useState<CourseDetailDto | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lessonDraft, setLessonDraft] = useState({
    title: '',
    content: '',
    order: 1,
    contentUrl: '',
    contentType: 'Video',
  });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = isTeacher ? await courseApi.getMyCourses() : await courseApi.getCourses();
      setRows(res.data || []);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Không tải được danh sách khóa học.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isTeacher]);

  useEffect(() => {
    if (!lessonsFor) {
      setCourseDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      try {
        const res = await courseApi.getCourseDetail(lessonsFor.id);
        if (!cancelled) setCourseDetail(res.data);
      } catch (e: any) {
        if (!cancelled) {
          setCourseDetail(null);
          alert(e?.response?.data?.message || 'Không tải được chi tiết khóa học.');
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonsFor]);

  useEffect(() => {
    if (!courseDetail || editingLessonId) return;
    const n = (courseDetail.lessons?.length ?? 0) + 1;
    setLessonDraft((d) => ({ ...d, order: n }));
  }, [courseDetail, editingLessonId]);

  const reloadLessonsOnly = async () => {
    if (!lessonsFor) return;
    const res = await courseApi.getCourseDetail(lessonsFor.id);
    setCourseDetail(res.data);
  };

  const saveLesson = async () => {
    if (!lessonsFor || !lessonDraft.title.trim()) {
      alert('Nhập tiêu đề bài học.');
      return;
    }
    try {
      if (editingLessonId) {
        await adminCourseApi.updateLesson(lessonsFor.id, editingLessonId, lessonDraft);
      } else {
        await adminCourseApi.addLesson(lessonsFor.id, lessonDraft);
      }
      await reloadLessonsOnly();
      setEditingLessonId(null);
      setLessonDraft({
        title: '',
        content: '',
        order: 1,
        contentUrl: '',
        contentType: 'Video',
      });
    } catch (e: any) {
      alert(
        typeof e?.response?.data === 'string'
          ? e.response.data
          : e?.response?.data?.message || 'Không lưu được bài học.'
      );
    }
  };

  const startEditLesson = (l: LessonDto) => {
    setEditingLessonId(l.id);
    setLessonDraft({
      title: l.title,
      content: l.content,
      order: l.order,
      contentUrl: l.contentUrl || '',
      contentType: l.contentType || 'Video',
    });
  };

  const cancelLessonEdit = () => {
    setEditingLessonId(null);
    const n = (courseDetail?.lessons?.length ?? 0) + 1;
    setLessonDraft({
      title: '',
      content: '',
      order: n,
      contentUrl: '',
      contentType: 'Video',
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => (r.title || '').toLowerCase().includes(q) || (r.category || '').toLowerCase().includes(q));
  }, [rows, search]);

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Tên khóa học', flex: 1, minWidth: 220 },
    { field: 'level', headerName: 'Level', width: 130 },
    { field: 'category', headerName: 'Danh mục', width: 200 },
    {
      field: 'price',
      headerName: 'Giá',
      width: 150,
      valueFormatter: (v: number) => (v > 0 ? `${v.toLocaleString('vi-VN')} đ` : 'Miễn phí'),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const r = params.row as CourseDto;
        return (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                setEditingLessonId(null);
                setLessonDraft({
                  title: '',
                  content: '',
                  order: 1,
                  contentUrl: '',
                  contentType: 'Video',
                });
                setLessonsFor(r);
              }}
            >
              Bài học
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEditing(r);
                setForm({
                  title: r.title,
                  description: r.description,
                  level: r.level,
                  category: r.category,
                  price: r.price ?? 0,
                  thumbnailUrl: r.thumbnailUrl ?? '',
                });
                setOpen(true);
              }}
            >
              Sửa
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={async () => {
                if (!confirm(`Xóa khóa học "${r.title}"?`)) return;
                try {
                  await adminCourseApi.deleteCourse(r.id);
                  setRows((prev) => prev.filter((x) => x.id !== r.id));
                } catch (e: any) {
                  alert(e?.response?.data?.message || 'Không thể xóa khóa học.');
                }
              }}
            >
              Xóa
            </Button>
          </div>
        );
      },
    },
  ];

  const onSave = async () => {
    try {
      if (editing) {
        const res = await adminCourseApi.updateCourse(editing.id, form);
        setRows((prev) => prev.map((x) => (x.id === editing.id ? res.data : x)));
      } else {
        const res = await adminCourseApi.createCourse(form);
        setRows((prev) => [res.data, ...prev]);
      }
      setOpen(false);
      setEditing(null);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Không thể lưu khóa học.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Quản lý khóa học</h2>
          <p className="text-sm text-gray-500">
            {isTeacher
              ? 'Bạn chỉ thấy và quản lý khóa học do chính bạn tạo'
              : 'CRUD dữ liệu thật từ Course service'}
            . Sau khi tạo khóa, bấm <strong>Bài học</strong> để thêm nội dung — học viên mới xem được bài trong khóa.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outlined" onClick={load}>Tải lại</Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditing(null);
              setForm({
                title: '',
                description: '',
                level: 'Beginner',
                category: 'Backend Development',
                price: 0,
                thumbnailUrl: '',
              });
              setOpen(true);
            }}
          >
            Thêm khóa học
          </Button>
        </div>
      </div>

      <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên hoặc category" size="small" fullWidth />

      <div style={{ height: 580, width: '100%' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          loading={loading}
          getRowId={(r) => (r as CourseDto).id}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Sửa khóa học' : 'Thêm khóa học'}</DialogTitle>
        <DialogContent style={{ paddingTop: 12 }}>
          <div className="flex flex-col gap-4">
            <TextField label="Tiêu đề" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} fullWidth />
            <TextField label="Mô tả" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} multiline rows={4} fullWidth />
            <TextField label="Level" value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} select fullWidth>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </TextField>
            <TextField
              label="Danh mục"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              select
              fullWidth
            >
              {COURSE_CATEGORY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
              {form.category.trim() && !isPresetCategory(form.category) ? (
                <MenuItem value={form.category}>{form.category} (đang dùng)</MenuItem>
              ) : null}
            </TextField>
            <TextField
              label="Giá (VND)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value || 0) }))}
              fullWidth
            />

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Ảnh bìa khóa học</p>
              <input
                ref={thumbFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (!f || !f.type.startsWith('image/')) return;
                  if (f.size > MAX_THUMB_BYTES) {
                    alert('Ảnh tối đa 400KB hoặc dán URL bên dưới.');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () =>
                    setForm((p) => ({
                      ...p,
                      thumbnailUrl: typeof reader.result === 'string' ? reader.result : '',
                    }));
                  reader.readAsDataURL(f);
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Button size="small" variant="outlined" onClick={() => thumbFileRef.current?.click()}>
                  Chọn ảnh từ máy
                </Button>
                {form.thumbnailUrl ? (
                  <Button size="small" color="error" variant="text" onClick={() => setForm((p) => ({ ...p, thumbnailUrl: '' }))}>
                    Xóa ảnh
                  </Button>
                ) : null}
              </div>
              <TextField
                label="Hoặc URL ảnh (https://…)"
                value={form.thumbnailUrl.startsWith('data:') ? '' : form.thumbnailUrl}
                onChange={(e) => setForm((p) => ({ ...p, thumbnailUrl: e.target.value.trim() }))}
                fullWidth
                size="small"
                placeholder="https://images.unsplash.com/..."
              />
              {form.thumbnailUrl ? (
                <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', maxWidth: 280, border: '1px solid #e5e7eb' }}>
                  <img src={form.thumbnailUrl} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={onSave}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!lessonsFor}
        onClose={() => {
          setLessonsFor(null);
          setCourseDetail(null);
          setEditingLessonId(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Bài học trong khóa: {lessonsFor?.title ?? ''}
        </DialogTitle>
        <DialogContent style={{ paddingTop: 12 }}>
          {detailLoading ? (
            <p className="text-sm text-gray-500">Đang tải…</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Danh sách bài ({courseDetail?.lessons?.length ?? 0})</p>
                <div className="space-y-2 max-h-56 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {(courseDetail?.lessons || [])
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span>
                          <span className="font-semibold text-gray-700">{l.order}.</span> {l.title}
                        </span>
                        <Button size="small" variant="text" onClick={() => startEditLesson(l)}>
                          Sửa
                        </Button>
                      </div>
                    ))}
                  {!(courseDetail?.lessons?.length) ? (
                    <p className="text-sm text-gray-500 px-2 py-3">Chưa có bài nào — thêm ở form bên dưới.</p>
                  ) : null}
                </div>
              </div>

              <p className="text-xs font-bold uppercase text-gray-400">
                {editingLessonId ? 'Sửa bài học' : 'Thêm bài học mới'}
              </p>
              <TextField
                label="Tiêu đề bài"
                value={lessonDraft.title}
                onChange={(e) => setLessonDraft((p) => ({ ...p, title: e.target.value }))}
                fullWidth
                size="small"
              />
              <TextField
                label="Nội dung (text / mô tả)"
                value={lessonDraft.content}
                onChange={(e) => setLessonDraft((p) => ({ ...p, content: e.target.value }))}
                multiline
                rows={3}
                fullWidth
                size="small"
              />
              <TextField
                label="Thứ tự (order)"
                type="number"
                value={lessonDraft.order}
                onChange={(e) => setLessonDraft((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                fullWidth
                size="small"
              />
              <TextField
                label="Link video / tài liệu (URL)"
                value={lessonDraft.contentUrl}
                onChange={(e) => setLessonDraft((p) => ({ ...p, contentUrl: e.target.value }))}
                fullWidth
                size="small"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <TextField
                label="Loại nội dung"
                value={lessonDraft.contentType}
                onChange={(e) => setLessonDraft((p) => ({ ...p, contentType: e.target.value }))}
                select
                fullWidth
                size="small"
              >
                <MenuItem value="Video">Video</MenuItem>
                <MenuItem value="Document">Document</MenuItem>
                <MenuItem value="Text">Text</MenuItem>
              </TextField>

              <div className="flex flex-wrap gap-2">
                <Button variant="contained" onClick={() => void saveLesson()}>
                  {editingLessonId ? 'Cập nhật bài' : 'Thêm bài'}
                </Button>
                {editingLessonId ? (
                  <Button variant="outlined" onClick={cancelLessonEdit}>
                    Hủy sửa
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLessonsFor(null);
              setCourseDetail(null);
              setEditingLessonId(null);
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoursesAdmin;
