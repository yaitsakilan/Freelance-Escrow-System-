// Paste full Ledger model code here
const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  ts: { type: Date, default: Date.now },
  project: String,
  milestone: String,
  total: Number,
  clientFee: Number,
  freelancerFee: Number,
  net: Number
});

module.exports = mongoose.model('Ledger', ledgerSchema);