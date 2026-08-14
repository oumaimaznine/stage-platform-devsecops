const COLORS = [
  "bg-primary-100 text-primary-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function hashColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

const SIZES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

export default function Avatar({ name = "", src = null, size = "md", square = false, className = "" }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const shape = square ? "rounded-xl" : "rounded-full";

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={`object-cover shrink-0 ${shape} ${SIZES[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center font-semibold shrink-0 ${shape} ${SIZES[size]} ${hashColor(name)} ${className}`}
    >
      {initials || "?"}
    </div>
  );
}