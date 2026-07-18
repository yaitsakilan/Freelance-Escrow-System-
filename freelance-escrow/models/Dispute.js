// Paste full Dispute model code here
const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  projectId: { type: Number, required: true },
  milestoneId: { type: Number, required: true },
  byEmail: String,
  reason: String,
  status: { type: String, default: 'open' },
  result: String
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);