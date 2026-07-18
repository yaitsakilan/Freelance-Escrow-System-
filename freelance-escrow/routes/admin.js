// Paste full admin routes code here
// routes/admin.js

const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const Dispute = require('../models/Dispute');
const router = express.Router();

// Middleware to check admin role (add to each route or globally)
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access only' });
  }
  next();
};

// GET /api/admin/users - List all users with profiles
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/admin/projects - List all projects overview
router.get('/projects', isAdmin, async (req, res) => {
  try {
    const projects = await Project.find({}, {
      title: 1,
      clientEmail: 1,
      selectedBy: 1,
      amount: 1,
      milestones: { $slice: -1 } // Last milestone status only
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/admin/pending-milestones - List pending milestones for approval
router.get('/pending-milestones', isAdmin, async (req, res) => {
  try {
    const projects = await Project.find({
      'milestones': {
        $elemMatch: { approved: false, refunded: false }
      }
    }, {
      title: 1,
      clientEmail: 1,
      milestones: {
        $elemMatch: { approved: false, refunded: false }
      }
    });
    const pending = projects.flatMap(p => 
      p.milestones.filter(m => !m.approved && !m.refunded).map(m => ({ ...m.toObject(), projectTitle: p.title, clientEmail: p.clientEmail }))
    );
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/admin/approve-milestone/:projectId/:milestoneId - Approve a milestone
router.post('/approve-milestone/:projectId/:milestoneId', isAdmin, async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const project = await Project.findOne({ id: parseInt(projectId) });
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    const milestone = project.milestones.find(m => m.id === parseInt(milestoneId));
    if (!milestone) return res.status(404).json({ msg: 'Milestone not found' });

    milestone.approved = true;
    await project.save();

    res.json({ msg: 'Milestone approved', milestone });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/admin/disputes - List all disputes
router.get('/disputes', isAdmin, async (req, res) => {
  try {
    const disputes = await Dispute.find({}).populate('projectId', 'title'); // Assuming ref, adjust if needed
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/admin/resolve-dispute/:disputeId - Resolve a dispute (refund or release)
router.post('/resolve-dispute/:disputeId', isAdmin, async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { result } = req.body; // 'Refund to Client' or 'Release to Freelancer'
    if (!['Refund to Client', 'Release to Freelancer'].includes(result)) {
      return res.status(400).json({ msg: 'Invalid result' });
    }

    const dispute = await Dispute.findOne({ id: parseInt(disputeId) });
    if (!dispute) return res.status(404).json({ msg: 'Dispute not found' });

    dispute.status = 'resolved';
    dispute.result = result;
    await dispute.save();

    // Handle fund direction (update milestone in Project)
    const project = await Project.findOne({ id: dispute.projectId });
    const milestone = project.milestones.find(m => m.id === dispute.milestoneId);
    if (result === 'Refund to Client') {
      milestone.refunded = true;
      milestone.paid = false;
    } else {
      milestone.paid = true;
      milestone.refunded = false;
      // Add to ledger (import Ledger model if needed)
    }
    await project.save();

    res.json({ msg: `Dispute resolved: ${result}`, dispute });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;