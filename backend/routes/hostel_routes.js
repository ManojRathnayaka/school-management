import express from "express";
import { getHostels } from "../controllers/hostel_controllar.js";

const router = express.Router();

router.get("/", getHostels);

export default router;
