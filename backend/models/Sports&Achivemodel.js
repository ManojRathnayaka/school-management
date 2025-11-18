const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  student: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  grade: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: ['Science', 'Mathematics', 'Literature', 'Art', 'Music', 'Technology', 
               'Swimming', 'Netball', 'Athletics', 'Basketball', 'Volleyball', 'Tennis'],
      message: '{VALUE} is not a valid category'
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  level: {
    type: String,
    required: true,
    enum: {
      values: ['School', 'District', 'Provincial', 'National', 'International'],
      message: '{VALUE} is not a valid level'
    }
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['academic', 'sports'],
      message: 'Type must be either academic or sports'
    }
  },
  // Academic specific fields
  teacher: {
    type: String,
    trim: true,
    maxLength: 100,
    required: function() {
      return this.type === 'academic';
    }
  },
  points: {
    type: Number,
    min: 0,
    max: 100,
    validate: {
      validator: function(v) {
        return this.type !== 'academic' || v != null;
      },
      message: 'Points are required for academic achievements'
    }
  },
  // Sports specific fields
  coach: {
    type: String,
    trim: true,
    maxLength: 100,
    required: function() {
      return this.type === 'sports';
    }
  },
  records: {
    type: String,
    trim: true,
    maxLength: 200,
    validate: {
      validator: function(v) {
        return this.type !== 'sports' || (v != null && v.length > 0);
      },
      message: 'Records are required for sports achievements'
    }
  },
  // Optional fields
  image: {
    type: String,
    trim: true,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
achievementSchema.index({ type: 1, date: -1 });
achievementSchema.index({ student: 1 });
achievementSchema.index({ category: 1, level: 1 });
achievementSchema.index({ date: -1 });

// Virtual for formatted date
achievementSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for achievement year
achievementSchema.virtual('year').get(function() {
  return this.date.getFullYear();
});

// Static method to get achievements by type
achievementSchema.statics.getByType = function(type, filters = {}) {
  const query = { type, isActive: true, ...filters };
  return this.find(query).sort({ date: -1 });
};

// Static method to get recent achievements
achievementSchema.statics.getRecent = function(limit = 5, type = null) {
  const query = { isActive: true };
  if (type) query.type = type;
  return this.find(query).sort({ date: -1 }).limit(limit);
};

// Static method to get statistics
achievementSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalAchievements: { $sum: 1 },
        academicCount: {
          $sum: { $cond: [{ $eq: ['$type', 'academic'] }, 1, 0] }
        },
        sportsCount: {
          $sum: { $cond: [{ $eq: ['$type', 'sports'] }, 1, 0] }
        },
        nationalCount: {
          $sum: { $cond: [{ $eq: ['$level', 'National'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalAchievements: 0,
    academicCount: 0,
    sportsCount: 0,
    nationalCount: 0
  };
};

// Instance method to check if achievement is recent (within last 30 days)
achievementSchema.methods.isRecent = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.date >= thirtyDaysAgo;
};

// Pre-save middleware for validation
achievementSchema.pre('save', function(next) {
  // Ensure academic achievements have teacher and points
  if (this.type === 'academic') {
    if (!this.teacher) {
      return next(new Error('Teacher is required for academic achievements'));
    }
    if (this.points === undefined || this.points === null) {
      return next(new Error('Points are required for academic achievements'));
    }
    // Clear sports-specific fields
    this.coach = undefined;
    this.records = undefined;
  }
  
  // Ensure sports achievements have coach and records
  if (this.type === 'sports') {
    if (!this.coach) {
      return next(new Error('Coach is required for sports achievements'));
    }
    if (!this.records) {
      return next(new Error('Records are required for sports achievements'));
    }
    // Clear academic-specific fields
    this.teacher = undefined;
    this.points = undefined;
  }
  
  next();
});

// Error handling for unique constraints and validation
achievementSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    next(new Error(messages.join('. ')));
  } else {
    next(error);
  }
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;