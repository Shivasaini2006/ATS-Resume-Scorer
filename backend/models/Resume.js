const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  extractedText: {
    type: String,
    default: ''
  },
  keywords: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster searches
ResumeSchema.index({ user: 1, uploadedAt: -1 });
ResumeSchema.index({ keywords: 1 });

module.exports = mongoose.model('Resume', ResumeSchema);
