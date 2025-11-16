import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import fs from "fs";
import csvParser from "csv-parser";
import {
  findUserByEmail,
  createUser,
  updatePassword,
  resetUserPasswordByAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../models/userModel.js";
import { createTeacher, deleteTeacher } from "../models/teacherModel.js";

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
        token: token,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
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
  const { first_name, last_name, email, role, contact_number, grade } =
    req.body;

  try {
    if (!["admin", "principal", "teacher"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role for admin creation" });
    }

    if (role === "teacher" && !contact_number) {
      return res
        .status(400)
        .json({ message: "Contact number is required for teachers" });
    }

    const user = await findUserByEmail(email);
    if (user) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const tempPassword = crypto
      .randomBytes(5)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 10);
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

    res
      .status(201)
      .json({ message: "User created successfully", tempPassword });
  } catch (err) {
    console.error("Create admin user error:", err);
    res.status(500).json({ message: "User creation failed. Please try again" });
  }
}

export async function bulkCreateAdminUsers(req, res) {
  const { role } = req.body;
  const filePath = req.file?.path;

  try {
    if (!role || !["admin", "principal", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Valid role is required" });
    }

    if (!filePath) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const results = { successes: [], failures: [] };

    // Parse CSV with BOM handling
    const stream = fs.createReadStream(filePath).pipe(
      csvParser({
        skipEmptyLines: true,
        trim: true,
        mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim().replace(/^"|"$/g, ''),
      })
    );

    for await (const row of stream) {
      try {
        // Normalize headers - handle various formats
        const getField = (field) => {
          const variations = {
            first_name: ['first_name', 'First Name', 'firstName', 'firstname'],
            last_name: ['last_name', 'Last Name', 'lastName', 'lastname'],
            email: ['email', 'Email'],
            contact_number: ['contact_number', 'Contact Number', 'contactNumber', 'contact'],
            grade: ['grade', 'Grade'],
          };
          
          for (const variant of variations[field] || []) {
            if (row[variant]) return row[variant].trim();
          }
          return null;
        };

        const first_name = getField('first_name');
        const last_name = getField('last_name');
        const email = getField('email');
        const contact_number = getField('contact_number');
        const grade = getField('grade');

        // Validate required fields
        if (!first_name || !last_name || !email) {
          results.failures.push({
            email: email || "N/A",
            reason: "Missing required fields",
          });
          continue;
        }

        // Validate teacher requirements
        if (role === "teacher" && !contact_number) {
          results.failures.push({
            email,
            reason: "Contact number required for teachers",
          });
          continue;
        }

        // Check existing user
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          results.failures.push({ email, reason: "Email already exists" });
          continue;
        }

        // Generate temp password
        const tempPassword = crypto
          .randomBytes(5)
          .toString("base64")
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, 10);

        const password_hash = await bcrypt.hash(tempPassword, 10);

        // Create user
        const userResult = await createUser({
          first_name,
          last_name,
          email,
          password_hash,
          role,
          must_reset_password: true,
        });

        // Create teacher record if needed
        if (role === "teacher") {
          await createTeacher({ 
            user_id: userResult.insertId, 
            contact_number, 
            grade: grade || null 
          });
        }

        results.successes.push({ email, first_name, last_name, tempPassword });

      } catch (rowError) {
        results.failures.push({
          email: row.email || "N/A",
          reason: rowError.message || "Processing failed",
        });
      }
    }

    res.status(200).json(results);

  } catch (err) {
    console.error("Bulk create error:", err);
    res.status(500).json({ message: "Bulk creation failed" });
  } finally {
    if (filePath) {
      fs.promises.unlink(filePath).catch(console.error);
    }
  }
}

function isStrongPassword(password) {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // at least 6 characters, one letter and one number
  return pattern.test(password);
}

export async function resetPasswordFirstLogin(req, res) {
  const { email, tempPassword, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:"Password needs at least 6 characters including letters and numbers"
      });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.must_reset_password) {
      return res.status(400).json({ message: "Password reset not required" });
    }

    const match = await bcrypt.compare(tempPassword, user.password_hash);
    if (!match)
      return res.status(401).json({ message: "Invalid temporary password" });

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
    console.error("Password reset error:", err);
    res
      .status(500)
      .json({ message: "Password update failed. Please try again" });
  }
}

// User management functions
export async function getAllUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const roles = req.query.roles ? req.query.roles.split(',') : null;
    const search = req.query.search || null;
    
    const result = await getUsers({ 
      page, 
      limit, 
      roles, 
      search,
      excludeRoles: ['parent', 'student'] // Exclude parents and students from user management
    });
    
    res.json(result);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser.user_id != id) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    await updateUser(id, { first_name, last_name, email });
    const updatedUser = await getUserById(id);
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
}

export async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    
    // Generate new temp password
    const tempPassword = crypto
      .randomBytes(5)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 10);
    
    const password_hash = await bcrypt.hash(tempPassword, 10);
    await resetUserPasswordByAdmin(id, password_hash);
    
    res.json({ message: "Password reset successfully", tempPassword });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
}

export async function deleteUserAccount(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = req.user.user_id;

    // Prevent self-deletion
    if (parseInt(id) === currentUserId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    // Get user details to check role
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle cascade deletion based on role
    if (user.role === 'teacher') {
      await deleteTeacher(id);
    }

    // Finally delete from users table
    await deleteUser(id);
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
}