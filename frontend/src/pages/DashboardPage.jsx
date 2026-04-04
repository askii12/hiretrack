import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe } from "../services/authService";
import { getApplicationStats } from "../services/applicationService";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userData = await getMe(token);
        setUser(userData.user);

        const statsData = await getApplicationStats();
        setStats(statsData);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {user && <p>Welcome, {user.name}</p>}

      {stats && (
        <div>
          <h2>Overview</h2>
          <p>Total applications: {stats.totalApplications}</p>
          <p>Applied: {stats.statusCounts.Applied}</p>
          <p>HR Interview: {stats.statusCounts["HR Interview"]}</p>
          <p>
            Technical Interview: {stats.statusCounts["Technical Interview"]}
          </p>
          <p>Offers: {stats.statusCounts.Offer}</p>

          <h3>Upcoming next steps</h3>
          <ul>
            {stats.upcomingNextSteps.map((app) => (
              <li key={app.id}>
                {app.companyName} — {app.positionTitle}
              </li>
            ))}
          </ul>

          <h3>Recent applications</h3>
          <ul>
            {stats.recentApplications.map((app) => (
              <li key={app.id}>
                {app.companyName} — {app.positionTitle}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/applications">Go to applications</Link>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
