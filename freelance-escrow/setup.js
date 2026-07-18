const fs = require('fs');
const path = require('path');

const structure = {
  '.vscode': {
    'settings.json': `{
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "eslint.validate": ["javascript"]
    }`
  },
  'models': {
    'User.js': `// Paste full User model code here`,
    'Project.js': `// Paste full Project model code here`,
    'Ledger.js': `// Paste full Ledger model code here`,
    'Dispute.js': `// Paste full Dispute model code here`
  },
  'middleware': {
    'auth.js': `// Paste full auth middleware code here`,
    'error.js': `module.exports = (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ msg: 'Something went wrong!' });
    };`
  },
  'routes': {
    'auth.js': `// Paste full auth routes code here`,
    'projects.js': `// Paste full projects routes code here`,
    'milestones.js': `// Paste full milestones routes code here`,
    'chat.js': `// Paste full chat routes code here`,
    'ledger.js': `// Paste full ledger routes code here`,
    'admin.js': `// Paste full admin routes code here`
  },
  'public': {
    'index.html': `<!-- Paste full enhanced HTML here -->`,
    'css': {
      'styles.css': `/* Paste full enhanced CSS here */`
    },
    'js': {
      'app.js': `// Paste full app.js code here`,
      'auth.js': `// Paste full auth.js code here`,
      'dashboard.js': `// Paste full dashboard.js code here`,
      'chat.js': `// Paste full chat.js code here`,
      'utils.js': `// Paste full utils.js code here`
    },
    'assets': {}  // Empty folder for images
  }
};

function createStructure(basePath, obj) {
  Object.entries(obj).forEach(([name, content]) => {
    const fullPath = path.join(basePath, name);
    if (typeof content === 'object' && content !== null) {
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      createStructure(fullPath, content);
    } else {
      fs.writeFileSync(fullPath, content || '// Model placeholder');
    }
  });
}

createStructure('.', structure);
console.log('✅ File structure created! Now paste the full code into each file.');