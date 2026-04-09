export default function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 ${props.className || ""}`}
    >
      {props.children}
    </select>
  );
}
