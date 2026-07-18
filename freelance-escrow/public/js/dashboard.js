
// Paste full dashboard.js code here
// Render Client Projects
async function renderClientProjects() {
  try {
    const projects = await apiCall('/projects');
    const tbody = document.getElementById('clientProjectsBody');
    tbody.innerHTML = projects.map(p => `
      <tr>
        <td>${p.title} <small>${p.type} | ₹${p.amount}</small></td>
        <td>${p.applicants.length} applicants</td>
        <td><button class="btn small" onclick="viewMilestones(${p.id})">View</button></td>
      </tr>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Call on dashboard load: renderClientProjects();