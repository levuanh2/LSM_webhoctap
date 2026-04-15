/** Fallback gọn cho React.lazy / Suspense */
export default function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center p-8">
      <div
        className="size-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
        aria-label="Đang tải"
      />
    </div>
  );
}
