import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import hostelApplicationRoutes from "./routes/hostelApplicationRoutes.js";
import auditoriumRoutes from "./routes/auditoriumRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import parentPortalRoutes from "./routes/parentPortalRoutes.js";

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files from backend/public/uploads
app.use('/uploads', express.static(join(__dirname, 'public/uploads')));

// Serve static files from the frontend public directory
app.use(express.static(join(__dirname, "../frontend/public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/auditorium", auditoriumRoutes);
app.use("/api/approved", auditoriumRoutes);
app.use("/api/pending", auditoriumRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use('/api/class-performance', performanceRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use("/api/parent-portal", parentPortalRoutes);
app.use("/api/hostel-applications", hostelApplicationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});