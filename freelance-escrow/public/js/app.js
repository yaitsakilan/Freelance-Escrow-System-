// Paste full app.js code here
// API Base
const API_BASE = '/api';

// Fetch Wrapper (with auth)
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };
  const res = await fetch(`${API_BASE}${endpoint}`, config);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Routing (Simple Hash-based)
function router() {
  const hash = window.location.hash.slice(1) || 'home';
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`${hash}Section`)?.classList.remove('hidden');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  router();
  window.addEventListener('hashchange', router);

  // Event listeners (e.g., sidebar toggle)
  document.getElementById('sidebarToggle').onclick = () => {
    document.getElementById('sidebar').classList.toggle('show');
  };

  // Theme toggle
  // Add light/dark switch logic here
});

// Utils: showToast(msg, type = 'success')
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}