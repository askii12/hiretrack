const variants = {
  primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
  secondary:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:ring-slate-400",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
