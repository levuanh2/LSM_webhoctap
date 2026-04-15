import { useEffect, useState } from 'react';

/** Trì hoãn cập nhật giá trị — tránh gọi API mỗi ký tự (vd. mục tiêu gợi ý AI). */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
