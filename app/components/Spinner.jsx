// A tiny presentational component: no state, just props -> markup.
export default function Spinner({ fullScreen = false }) {
  return (
    // role="status" tells screen readers this is a live loading indicator
    <div role="status" className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "h-64"}`}>
      {/* a bordered circle with one coloured edge, spun by Tailwind's animate-spin */}
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
      <span className="sr-only">Loading…</span> {/* visible only to screen readers */}
    </div>
  );
}
