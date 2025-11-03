const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  text: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', ResumeSchema);
