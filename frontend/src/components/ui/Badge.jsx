const TONES = {
  violet: "bg-primary-600 text-white",
  amber: "bg-amber-600 text-white",
  sky: "bg-sky-600 text-white",
  emerald: "bg-emerald-600 text-white",
  red: "bg-red-600 text-white",
  neutral: "bg-ink-700 text-ink-100",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-full ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}