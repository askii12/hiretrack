import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
            HireTrack
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
            Track your job search like a modern CRM.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Organize applications, monitor progress, manage interview stages,
            and keep your job hunt in one clean dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button>Create account</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
