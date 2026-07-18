// Paste full auth.js code here
// Signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  try {
    const { token, user } = await apiCall('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    showToast('Account created! Redirecting...');
    window.location.hash = `${user.role}Dash`;
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Similar for login...

// Terms Signing (PATCH /auth/terms)
async function signTerms() {
  // Call API to update user.signedTac = true
}