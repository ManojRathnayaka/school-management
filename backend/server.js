import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import hostelApplicationRoutes from "./routes/hostelApplicationRoutes.js"
import auditoriumRoutes from "./routes/auditoriumRoutes.js"
import notificationsRoutes from "./routes/notificationsRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
dotenv.config({ quiet: true });
const app = express();
const PORT = process.env.PORT || 4000;


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.use("/api/auditorium",auditoriumRoutes)
app.use("/api/approved", auditoriumRoutes);
app.use("/api/pending", auditoriumRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use('/api/class-performance', performanceRoutes);
app.use('/api/classes', classRoutes);


app.use('/api/scholarships', scholarshipRoutes);

app.use("/api/hostel-applications", hostelApplicationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

