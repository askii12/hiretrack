import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>HireTrack Home</h1>
      <p>Track your job applications in one place.</p>

      <Link to="/register">Register</Link>
      <br />
      <Link to="/login">Login</Link>
    </div>
  );
}
