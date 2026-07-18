require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const milestoneRoutes = require('./routes/milestones');
const chatRoutes = require('./routes/chat');
const ledgerRoutes = require('./routes/ledger');
const adminRoutes = require('./routes/admin');
const { authMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve frontend

// Multer for file uploads (e.g., Gov ID)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// MongoDB Connection (auto-creates DB)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/milestones', authMiddleware, milestoneRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/ledger', authMiddleware, ledgerRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// File upload route example (integrate in projects for Gov ID)
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  res.json({ filePath: req.file.path });
});

// Serve SPA
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));