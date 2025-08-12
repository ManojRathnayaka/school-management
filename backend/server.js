import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";

dotenv.config({ quiet: true });
const app = express();
const PORT = process.env.PORT || 4000;


//app.use(cors());

app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:5174"  // Add your current frontend port
  ],
  credentials: true,
}));

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/scholarships", scholarshipRoutes);


// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok" });
// });


//
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Server is working!",
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.method} ${req.path} not found` 
  });
});

//



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

