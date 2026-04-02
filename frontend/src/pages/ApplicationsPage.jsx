import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/applicationService";

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

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadApplications();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = (application) => {
    setEditingId(application.id);
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
  };

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      if (editingId === id) {
        setEditingId(null);
        setFormData(initialForm);
      }
      loadApplications();
    } catch (err) {
      setError("Failed to delete application");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateApplication(editingId, formData);
      } else {
        await createApplication(formData);
      }

      setFormData(initialForm);
      setEditingId(null);
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save application");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  return (
    <div>
      <h1>Applications</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company name"
          value={formData.companyName}
          onChange={handleChange}
        />
        <br />

        <input
          type="text"
          name="positionTitle"
          placeholder="Position title"
          value={formData.positionTitle}
          onChange={handleChange}
        />
        <br />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Wishlist</option>
          <option>Applied</option>
          <option>HR Interview</option>
          <option>Technical Interview</option>
          <option>Test Task</option>
          <option>Final Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <br />

        <input
          type="number"
          name="salaryMin"
          placeholder="Salary min"
          value={formData.salaryMin}
          onChange={handleChange}
        />
        <br />

        <input
          type="number"
          name="salaryMax"
          placeholder="Salary max"
          value={formData.salaryMax}
          onChange={handleChange}
        />
        <br />

        <input
          type="text"
          name="jobLink"
          placeholder="Job link"
          value={formData.jobLink}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />
        <br />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <br />

        <input
          type="date"
          name="appliedDate"
          value={formData.appliedDate}
          onChange={handleChange}
        />
        <br />

        <input
          type="date"
          name="nextStepDate"
          value={formData.nextStepDate}
          onChange={handleChange}
        />
        <br />

        <button type="submit">
          {editingId ? "Update application" : "Add application"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel edit
          </button>
        )}
      </form>

      {error && <p>{error}</p>}

      <hr />

      <ul>
        {applications.map((application) => (
          <li key={application.id}>
            <strong>{application.companyName}</strong> —{" "}
            {application.positionTitle}
            <br />
            Status: {application.status}
            <br />
            Priority: {application.priority}
            <br />
            <button onClick={() => handleEdit(application)}>Edit</button>
            <button onClick={() => handleDelete(application.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
