// Paste full chat routes code here
const express = require('express');
const Project = require('../models/Project');
const router = express.Router({ mergeParams: true });

router.post('/:projectId/:milestoneId', async (req, res) => {
  const { text } = req.body;
  const project = await Project.findOne({ id: req.params.projectId });
  const milestone = project.milestones.id(req.params.milestoneId);
  milestone.chat.push({ by: req.user.email, text, ts: new Date() });
  await project.save();
  res.json(milestone.chat);
});

router.get('/:projectId/:milestoneId', async (req, res) => {
  // Fetch chat...
});

module.exports = router;