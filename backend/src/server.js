import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "HireTrack API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

export default app;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
