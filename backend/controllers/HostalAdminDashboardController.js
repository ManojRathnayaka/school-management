const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Application, Hostel, User, SystemSettings } = require('../models'); // Import from the single models file

// Authentication Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard Controllers
const getDashboardStats = async (req, res) => {
  try {
    const applications = await Application.find();
    const hostels = await Hostel.find();
    
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      totalHostels: hostels.length,
      totalStudents: hostels.reduce((sum, hostel) => sum + hostel.occupied, 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ submittedAt: -1 }).limit(5);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHostelOccupancy = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Application Controllers
const getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await Application.find(filter);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findOneAndUpdate(
      { id: req.params.id },
      { status, reviewedBy: req.user.name },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hostel Controllers
const getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createHostel = async (req, res) => {
  try {
    const newHostel = new Hostel(req.body);
    await newHostel.save();
    res.status(201).json(newHostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Controllers
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      ...userData,
      password: hashedPassword
    });
    
    await newUser.save();
    res.status(201).json({ 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      role: newUser.role 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Settings Controllers
const getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings({
        applicationDeadline: '2025-12-31',
        maxApplicationsPerStudent: 1,
        enableOnlinePayment: true,
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: false,
        autoApproval: false,
        allowRoomChangeRequests: true
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reports Controllers
const getReportStats = async (req, res) => {
  try {
    const applications = await Application.find();
    const hostels = await Hostel.find();
    
    const approvedApplications = applications.filter(app => app.status === 'approved').length;
    const successRate = applications.length > 0 ? Math.round((approvedApplications / applications.length) * 100) : 0;
    
    const totalCapacity = hostels.reduce((sum, hostel) => sum + hostel.capacity, 0);
    const totalOccupied = hostels.reduce((sum, hostel) => sum + hostel.occupied, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
    
    const stats = {
      applicationSuccessRate: successRate,
      averageProcessingTime: '2.3 days',
      hostelOccupancyRate: occupancyRate
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgramStats = async (req, res) => {
  try {
    const applications = await Application.find();
    const programCounts = {};
    
    applications.forEach(app => {
      programCounts[app.program] = (programCounts[app.program] || 0) + 1;
    });
    
    const total = applications.length;
    const programStats = Object.entries(programCounts).map(([program, count]) => ({
      program,
      percentage: Math.round((count / total) * 100)
    }));
    
    res.json(programStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const applications = await Application.find();
    const monthlyCounts = {};
    
    applications.forEach(app => {
      const month = new Date(app.submittedAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    
    const monthlyTrends = Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      applications: count
    }));
    
    res.json(monthlyTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Auth
  login,
  
  // Dashboard
  getDashboardStats,
  getRecentApplications,
  getHostelOccupancy,
  
  // Applications
  getApplications,
  updateApplicationStatus,
  
  // Hostels
  getHostels,
  createHostel,
  updateHostel,
  
  // Users
  getUsers,
  createUser,
  updateUserStatus,
  
  // Settings
  getSettings,
  updateSettings,
  
  // Reports
  getReportStats,
  getProgramStats,
  getMonthlyTrends
};