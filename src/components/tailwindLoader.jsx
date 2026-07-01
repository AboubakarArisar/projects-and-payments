// Loader — brand-colored spinner on the dark surface.
const Loader = () => (
  <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full border-4 border-line" />
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-500 border-r-brand-400" />
    </div>
    <p className="text-sm text-muted">Loading…</p>
  </div>
);

export default Loader;
