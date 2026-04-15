/**
 * FastAPI thường trả detail là string hoặc mảng { type, loc, msg, input }.
 * Dùng hàm này trước khi setState / hiển thị lỗi để tránh lỗi React "Objects are not valid as a React child".
 */
export function getApiErrorMessage(err: unknown): string {
  const e = err as {
    response?: { data?: { detail?: unknown } };
    message?: string;
  };
  const d = e?.response?.data?.detail;
  if (typeof d === 'string') return d;
  const msg = (err as any)?.response?.data?.message;
  if (typeof msg === 'string') return msg;
  if (Array.isArray(d)) {
    return d
      .map((x: { msg?: string }) => (typeof x?.msg === 'string' ? x.msg : JSON.stringify(x)))
      .join(' ');
  }
  if (d && typeof d === 'object' && 'msg' in (d as object)) {
    return String((d as { msg?: string }).msg);
  }
  return e?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
}
