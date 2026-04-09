import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to continue managing your applications.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {error ? (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          ) : null}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-sky-600 hover:text-sky-700"
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
