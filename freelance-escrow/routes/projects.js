// Paste full projects routes code here
const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Create Project (Client only)
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ msg: 'Client only' });
    if (!req.user.signedTac) return res.status(403).json({ msg: 'Accept T&C first' });

    const { title, type, desc, deadline, amount } = req.body;
    const id = Date.now();
    const perMilestone = amount / 3;
    const milestones = [
      { id: id + 1, name: 'Initial Draft', amount: perMilestone },
      { id: id + 2, name: 'Revision & Modifications', amount: perMilestone },
      { id: id + 3, name: 'Final Delivery', amount: perMilestone }
    ];
    const project = new Project({ id, title, type, desc, deadline, amount, clientEmail: req.user.email, milestones });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET Projects (filtered by role)
router.get('/', async (req, res) => {
  try {
    let projects = await Project.find();
    // Filter logic based on req.user.role (e.g., available for freelancers)
    if (req.user.role === 'freelancer') {
      projects = projects.filter(p => !p.selectedBy);
    } else if (req.user.role === 'client') {
      projects = projects.filter(p => p.clientEmail === req.user.email);
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Similar for PUT/DELETE, apply, approve...

module.exports = router;