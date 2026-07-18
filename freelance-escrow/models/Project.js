// Paste full Project model code here
const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  deliverable: String,
  submitted: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  refunded: { type: Boolean, default: false },
  chat: [{
    by: String,  // Email
    text: String,
    ts: { type: Date, default: Date.now }
  }]
});

const projectSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  type: String,
  desc: String,
  deadline: Date,
  amount: { type: Number, required: true },
  clientEmail: { type: String, required: true },
  selectedBy: String,  // Freelancer email
  applicants: [{
    email: String,
    approved: { type: Boolean, default: false }
  }],
  milestones: [milestoneSchema]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);