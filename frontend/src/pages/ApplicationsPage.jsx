import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/applicationService";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";

const statuses = [
  "Wishlist",
  "Applied",
  "HR Interview",
  "Technical Interview",
  "Test Task",
  "Final Interview",
  "Offer",
  "Rejected",
];

const initialForm = {
  companyName: "",
  positionTitle: "",
  status: "Wishlist",
  location: "",
  salaryMin: "",
  salaryMax: "",
  jobLink: "",
  notes: "",
  priority: "Medium",
  appliedDate: "",
  nextStepDate: "",
};

const initialFilters = {
  status: "",
  priority: "",
  search: "",
  sortBy: "createdAt",
  order: "desc",
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [filters, setFilters] = useState(initialFilters);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadApplications = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const data = await getApplications(activeFilters);
      setApplications(data);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadApplications(filters);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilterChange = (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };

    setFilters(updatedFilters);
    loadApplications(updatedFilters);
  };

  const handleEdit = (application) => {
    setEditingId(application.id);
    setError("");
    setFormData({
      companyName: application.companyName || "",
      positionTitle: application.positionTitle || "",
      status: application.status || "Wishlist",
      location: application.location || "",
      salaryMin: application.salaryMin || "",
      salaryMax: application.salaryMax || "",
      jobLink: application.jobLink || "",
      notes: application.notes || "",
      priority: application.priority || "Medium",
      appliedDate: application.appliedDate
        ? application.appliedDate.slice(0, 10)
        : "",
      nextStepDate: application.nextStepDate
        ? application.nextStepDate.slice(0, 10)
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) return;

    try {
      await deleteApplication(id);

      if (editingId === id) {
        setEditingId(null);
        setFormData(initialForm);
      }

      loadApplications(filters);
    } catch (err) {
      setError("Failed to delete application");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.companyName.trim() || !formData.positionTitle.trim()) {
      setError("Company name and position title are required");
      return;
    }

    try {
      if (editingId) {
        await updateApplication(editingId, formData);
      } else {
        await createApplication(formData);
      }

      setFormData(initialForm);
      setEditingId(null);
      loadApplications(filters);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save application");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
  };

  const groupedApplications = statuses.reduce((acc, status) => {
    acc[status] = applications.filter(
      (application) => application.status === status,
    );
    return acc;
  }, {});

  return (
    <PageShell
      title="Applications"
      subtitle="Manage your pipeline, update stages, and keep your job search organized."
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Filters" className="xl:col-span-1">
          <div className="space-y-4">
            <Input
              type="text"
              name="search"
              placeholder="Search company or role"
              value={filters.search}
              onChange={handleFilterChange}
            />

            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All statuses</option>
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Test Task">Test Task</option>
              <option value="Final Interview">Final Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </Select>

            <Select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">All priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>

            <Select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="createdAt">Created at</option>
              <option value="appliedDate">Applied date</option>
              <option value="nextStepDate">Next step date</option>
              <option value="companyName">Company name</option>
            </Select>

            <Select
              name="order"
              value={filters.order}
              onChange={handleFilterChange}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </Select>
          </div>
        </Card>

        <Card
          title={editingId ? "Edit Application" : "Add Application"}
          className="xl:col-span-2"
        >
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <Input
              type="text"
              name="companyName"
              placeholder="Company name"
              value={formData.companyName}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="positionTitle"
              placeholder="Position title"
              value={formData.positionTitle}
              onChange={handleChange}
            />

            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Wishlist</option>
              <option>Applied</option>
              <option>HR Interview</option>
              <option>Technical Interview</option>
              <option>Test Task</option>
              <option>Final Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </Select>

            <Input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <Input
              type="number"
              name="salaryMin"
              placeholder="Salary min"
              value={formData.salaryMin}
              onChange={handleChange}
            />

            <Input
              type="number"
              name="salaryMax"
              placeholder="Salary max"
              value={formData.salaryMax}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="jobLink"
              placeholder="Job link"
              value={formData.jobLink}
              onChange={handleChange}
              className="md:col-span-2"
            />

            <Textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="md:col-span-2"
            />

            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>

            <Input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
            />

            <Input
              type="date"
              name="nextStepDate"
              value={formData.nextStepDate}
              onChange={handleChange}
            />

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">
                {editingId ? "Update application" : "Add application"}
              </Button>

              {editingId ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel edit
                </Button>
              ) : null}
            </div>

            {error ? (
              <p className="md:col-span-2 text-sm font-medium text-rose-600">
                {error}
              </p>
            ) : null}
          </form>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Applications List">
          {loading ? (
            <p className="text-sm text-slate-500">Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No applications found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing filters or add your first application.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-2xl border border-slate-300 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {application.companyName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {application.positionTitle}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge label={application.status} />
                      <Badge label={application.priority} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(application)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(application.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Kanban Board">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {statuses.map((status) => (
              <div
                key={status}
                className="min-w-[280px] rounded-2xl border border-slate-200 bg-slate-100/80 p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{status}</h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
                    {groupedApplications[status].length}
                  </span>
                </div>

                <div className="space-y-3">
                  {groupedApplications[status].length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-4 text-center">
                      <p className="text-sm text-slate-400">No applications</p>
                    </div>
                  ) : (
                    groupedApplications[status].map((application) => (
                      <div
                        key={application.id}
                        className="rounded-2xl border border-slate-300 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)]"
                      >
                        <p className="font-semibold text-slate-900">
                          {application.companyName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {application.positionTitle}
                        </p>

                        <div className="mt-3">
                          <Badge label={application.priority} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
