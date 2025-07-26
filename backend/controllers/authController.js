import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "../models/userModel.js";
import crypto from "crypto";
import { createTeacher } from "../models/teacherModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
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
    { expiresIn: "1h" }
  );
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
    if (user.must_reset_password) {
      return res.status(200).json({
        mustResetPassword: true,
        message: "Password reset required. Please set a new password.",
        user: {
          email: user.email,
          role: user.role,
        },
      });
    }
      
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
  const { first_name, last_name, email, role, contact_number, grade } = req.body;
  if (!["admin", "principal", "teacher"].includes(role)) {
    return res.status(400).json({ message: "Invalid role for admin creation" });
  }
  if (role === "teacher" && !contact_number) {
    return res.status(400).json({ message: "Contact number is required for teachers" });
  }
  try {
    const user = await findUserByEmail(email);
    if (user)
      return res.status(409).json({ message: "Email already registered" });
    // Generate random temp password
    const tempPassword = crypto.randomBytes(5).toString("base64").replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    const password_hash = await bcrypt.hash(tempPassword, 10);
    // Create user
    const userResult = await createUser({
      first_name,
      last_name,
      email,
      password_hash,
      role,
      must_reset_password: true,
      returnInsertedId: true,
    });
    const user_id = userResult.insertId || userResult[0]?.insertId;
    if (role === "teacher") {
      await createTeacher({ user_id, contact_number, grade });
    }
    res.status(201).json({ message: "User created", tempPassword });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// New: Reset password on first login
export async function resetPasswordFirstLogin(req, res) {
  const { email, tempPassword, newPassword, confirmPassword } = req.body;
  if (!email || !tempPassword || !newPassword || !confirmPassword)
    return res.status(400).json({ message: "All fields are required." });
  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match." });
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.must_reset_password)
      return res.status(400).json({ message: "Password reset not required." });
    const match = await bcrypt.compare(tempPassword, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid temporary password." });
    const password_hash = await bcrypt.hash(newPassword, 10);
    // Update user password and clear must_reset_password
    await import('../models/userModel.js').then(m => m.updateUserPasswordAndClearReset(user.user_id, password_hash));
    // Fetch updated user
    const updatedUser = await findUserByEmail(email);
    const token = generateToken(updatedUser);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({
      message: "Password reset successful",
      user: {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
