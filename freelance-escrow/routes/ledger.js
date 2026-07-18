// Paste full ledger routes code here
// routes/ledger.js

const express = require('express');
const Ledger = require('../models/Ledger');
const router = express.Router();

// GET /api/ledger - Fetch all ledger entries (paginated, public but auth required)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Ledger.countDocuments();
    const entries = await Ledger.find()
      .sort({ ts: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    res.json({
      entries,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEntries: total
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/ledger - Add a new entry (called from payMilestone)
router.post('/', async (req, res) => {
  try {
    const { project, milestone, total, clientFee, freelancerFee, net } = req.body;
    if (!project || !milestone || !total) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const entry = new Ledger({
      project,
      milestone,
      total,
      clientFee: clientFee || +(total * 0.10).toFixed(2),
      freelancerFee: freelancerFee || +(total * 0.05).toFixed(2),
      net: net || +(total - (total * 0.05)).toFixed(2)
    });

    await entry.save();
    res.status(201).json({ msg: 'Ledger entry added', entry });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/ledger/clear - Clear all entries (admin only)
router.post('/clear', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access only' });
    }

    const result = await Ledger.deleteMany({});
    res.json({ msg: 'Ledger cleared', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/ledger/export - Export as CSV (simple response for frontend download)
router.get('/export', async (req, res) => {
  try {
    const entries = await Ledger.find().sort({ ts: -1 });
    let csv = 'ID,Date,Project,Milestone,Total,Client 10%,Freelancer 5%,Net\n';
    entries.forEach(entry => {
      csv += `${entry._id},${entry.ts},${entry.project},${entry.milestone},${entry.total},${entry.clientFee},${entry.freelancerFee},${entry.net}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('ledger.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;