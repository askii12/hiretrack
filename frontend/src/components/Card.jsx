export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm border ${className}`}
    >
      {title ? (
        <h2 className=" mb-4 text-lg font-semibold text-slate-900 ">{title}</h2>
      ) : null}
      {children}
    </div>
  );
}
