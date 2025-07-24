import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  getPendingUsers,
  approveUser,
} from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function signup(req, res) {
  const { first_name, last_name, email, password, role } = req.body;
  if (!["student", "parent"].includes(role)) {
    return res
      .status(400)
      .json({ message: "Only students and parents can self-register" });
  }
  try {
    const user = await findUserByEmail(email);
    if (user)
      return res.status(409).json({ message: "Email already registered" });
    const password_hash = await bcrypt.hash(password, 10);
    await createUser({ first_name, last_name, email, password_hash, role });
    res
      .status(201)
      .json({ message: "Signup successful, pending admin approval" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    // Check password FIRST
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    
    // THEN check if approved (only after password is verified)
    if (!user.is_approved)
      return res.status(403).json({ message: "Account pending approval" });
      
    const token = generateToken(user);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({
      message: "Login successful",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
}

export function getCurrentUser(req, res) {
  res.json({ user: req.user });
}

export async function listPendingUsers(req, res) {
  try {
    const users = await getPendingUsers();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function approvePendingUser(req, res) {
  const { user_id } = req.body;
  try {
    await approveUser(user_id);
    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function createAdminUser(req, res) {
  const { first_name, last_name, email, password, role } = req.body;
  if (!["admin", "principal", "teacher"].includes(role)) {
    return res.status(400).json({ message: "Invalid role for admin creation" });
  }
  try {
    const user = await findUserByEmail(email);
    if (user)
      return res.status(409).json({ message: "Email already registered" });
    const password_hash = await bcrypt.hash(password, 10);
    await createUser({
      first_name,
      last_name,
      email,
      password_hash,
      role,
      is_approved: 1,
    });
    res.status(201).json({ message: "User created and approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
