// Paste full chat.js code here
// Post Message
async function postChat(projectId, milestoneId, text) {
  await apiCall(`/chat/${projectId}/${milestoneId}`, {
    method: 'POST',
    body: JSON.stringify({ text })
  });
  renderChat(projectId, milestoneId);  // Re-render
}

// Render Chat (fetch from API)
async function renderChat(projectId, milestoneId) {
  const chat = await apiCall(`/chat/${projectId}/${milestoneId}`);
  // Build HTML bubbles...
}