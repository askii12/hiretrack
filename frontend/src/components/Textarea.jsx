export default function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 ${props.className || ""}`}
    />
  );
}
