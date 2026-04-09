import Navbar from "./Navbar";

export default function PageShell({ title, subtitle, children, actions }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            ) : null}
          </div>

          {actions ? <div>{actions}</div> : null}
        </div>

        {children}
      </div>
    </div>
  );
}
