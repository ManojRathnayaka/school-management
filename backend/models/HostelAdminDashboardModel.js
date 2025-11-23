const mongoose = require('mongoose');

// Application Schema
const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  program: { type: String, required: true },
  year: { type: String, required: true },
  preferredHostel: { type: String, required: true },
  roomType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  reviewedBy: { type: String, default: null }
});

// Hostel Schema
const hostelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, required: true },
  available: { type: Number, required: true },
  type: { type: String, enum: ['male', 'female'], required: true },
  warden: { type: String, required: true }
});

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'warden'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  joinDate: { type: Date, default: Date.now }
});

// System Settings Schema
const systemSettingsSchema = new mongoose.Schema({
  applicationDeadline: { type: String, required: true },
  maxApplicationsPerStudent: { type: Number, required: true },
  enableOnlinePayment: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  autoApproval: { type: Boolean, default: false },
  allowRoomChangeRequests: { type: Boolean, default: true }
});

// Create models
const Application = mongoose.model('Application', applicationSchema);
const Hostel = mongoose.model('Hostel', hostelSchema);
const User = mongoose.model('User', userSchema);
const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

// Export models
module.exports = {
  Application,
  Hostel,
  User,
  SystemSettings
};