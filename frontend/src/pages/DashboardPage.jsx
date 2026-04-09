import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe } from "../services/authService";
import { getApplicationStats } from "../services/applicationService";
import { getActivityLogs } from "../services/activityService";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      try {
        const statsData = await getApplicationStats();
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load stats", err);
      }

      try {
        const logsData = await getActivityLogs();
        setActivityLogs(logsData);
      } catch (err) {
        console.error("Failed to load activity logs", err);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <PageShell title="Dashboard" subtitle="Loading your workspace...">
        <Card>
          <p className="text-sm text-slate-600">Loading dashboard...</p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Dashboard"
      subtitle={
        user
          ? `Welcome back, ${user.name}. Here is a quick overview of your job search.`
          : "Your job search overview."
      }
    >
      {stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Total applications"
              value={stats.totalApplications}
            />
            <StatCard label="Applied" value={stats.statusCounts.Applied} />
            <StatCard
              label="HR interviews"
              value={stats.statusCounts["HR Interview"]}
            />
            <StatCard
              label="Technical interviews"
              value={stats.statusCounts["Technical Interview"]}
            />
            <StatCard label="Offers" value={stats.statusCounts.Offer} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card title="Upcoming next steps" className="xl:col-span-1">
              {stats.upcomingNextSteps.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No upcoming next steps.
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.upcomingNextSteps.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {app.companyName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {app.positionTitle}
                      </p>
                      <div className="mt-2">
                        <Badge label={app.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Recent applications" className="xl:col-span-1">
              {stats.recentApplications.length === 0 ? (
                <p className="text-sm text-slate-500">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {app.companyName}
                          </p>
                          <p className="text-sm text-slate-600">
                            {app.positionTitle}
                          </p>
                        </div>
                        <Badge label={app.priority} />
                      </div>

                      <div className="mt-3">
                        <Badge label={app.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Recent activity" className="xl:col-span-1">
              {activityLogs.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No recent activity yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {log.action}
                      </p>
                      {log.details ? (
                        <p className="mt-1 text-sm text-slate-600">
                          {log.details}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <p className="text-sm text-slate-600">
            Could not load dashboard statistics.
          </p>
        </Card>
      )}
    </PageShell>
  );
}
