import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-sky-100 text-sky-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-lg font-bold text-slate-900">
          HireTrack
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${isActive("/dashboard")}`}
          >
            Dashboard
          </Link>
          <Link
            to="/applications"
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${isActive("/applications")}`}
          >
            Applications
          </Link>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
