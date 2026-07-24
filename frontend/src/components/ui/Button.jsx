import { forwardRef } from "react";

const VARIANTS = {
  primary:
    "bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white shadow-sm shadow-black/10",
  secondary:
    "bg-ink-800 hover:bg-ink-700 active:bg-ink-700 text-ink-100 border border-ink-700",
  accent: "bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white shadow-sm shadow-black/10",
  ghost: "bg-transparent hover:bg-ink-800 text-ink-300",
  danger: "bg-red-600/90 hover:bg-red-600 text-white",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-lg gap-2",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", loading = false, disabled, className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;