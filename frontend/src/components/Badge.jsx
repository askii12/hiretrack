const styles = {
  Wishlist: "bg-slate-200 text-slate-800 ring-slate-300",
  Applied: "bg-sky-200 text-sky-800 ring-sky-300",
  "HR Interview": "bg-violet-200 text-violet-800 ring-violet-300",
  "Technical Interview": "bg-indigo-200 text-indigo-800 ring-indigo-300",
  "Test Task": "bg-amber-200 text-amber-800 ring-amber-300",
  "Final Interview": "bg-fuchsia-200 text-fuchsia-800 ring-fuchsia-300",
  Offer: "bg-emerald-200 text-emerald-800 ring-emerald-300",
  Rejected: "bg-rose-200 text-rose-800 ring-rose-300",
  Low: "bg-slate-200 text-slate-800 ring-slate-300",
  Medium: "bg-amber-200 text-amber-800 ring-amber-300",
  High: "bg-rose-200 text-rose-800 ring-rose-300",
};

export default function Badge({ label }) {
  const style = styles[label] || "bg-slate-200 text-slate-800 ring-slate-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset border border-white/100 ${style}`}
    >
      {label}
    </span>
  );
}
