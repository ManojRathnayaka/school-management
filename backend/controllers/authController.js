import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail,
  createUser,
  updatePassword,
} from "../models/userModel.js";
import { createTeacher } from "../models/teacherModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

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
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function login(req, res) {
  const { email, password } = req.body;
  
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    
    if (user.must_reset_password) {
      return res.status(200).json({
        mustResetPassword: true,
        message: "Password reset required. Please set a new password",
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
    console.error('Login error:', err);
    res.status(500).json({ message: "Login failed. Please try again" });
  }
}

export function logout(req, res) {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
}

export function getCurrentUser(req, res) {
  res.json({ user: req.user });
}

export async function createAdminUser(req, res) {
  const { first_name, last_name, email, role, contact_number, grade } = req.body;
  
  try {
    if (!["admin", "principal", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for admin creation" });
    }
    
    if (role === "teacher" && !contact_number) {
      return res.status(400).json({ message: "Contact number is required for teachers" });
    }
    
    const user = await findUserByEmail(email);
    if (user) {
      return res.status(409).json({ message: "Email already registered" });
    }
    
    const tempPassword = crypto.randomBytes(5).toString("base64").replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    const password_hash = await bcrypt.hash(tempPassword, 10);
    
    const userResult = await createUser({
      first_name,
      last_name,
      email,
      password_hash,
      role,
      must_reset_password: true,
    });
    
    const user_id = userResult.insertId;
    
    if (role === "teacher") {
      await createTeacher({ user_id, contact_number, grade });
    }
    
    res.status(201).json({ message: "User created successfully", tempPassword });
  } catch (err) {
    console.error('Create admin user error:', err);
    res.status(500).json({ message: "User creation failed. Please try again" });
  }
}

export async function resetPasswordFirstLogin(req, res) {
  const { email, tempPassword, newPassword, confirmPassword } = req.body;
  
  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    if (!user.must_reset_password) {
      return res.status(400).json({ message: "Password reset not required" });
    }
    
    const match = await bcrypt.compare(tempPassword, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid temporary password" });
    
    const password_hash = await bcrypt.hash(newPassword, 10);
    await updatePassword(user.user_id, password_hash);
    
    const updatedUser = await findUserByEmail(email);
    const token = generateToken(updatedUser);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({
      message: "Password updated successfully",
      user: {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: "Password update failed. Please try again" });
  }
}