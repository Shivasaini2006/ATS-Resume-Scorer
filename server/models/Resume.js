const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    default: 0
  },
  keywords: {
    matched: [String],
    missing: [String]
  },
  analysis: {
    totalWords: Number,
    sections: [String],
    skills: [String],
    experience: [String],
    education: [String]
  },
  improvements: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
