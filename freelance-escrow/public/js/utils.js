// Paste full utils.js code here
// public/js/utils.js

// API Fetch Wrapper (handles auth token and errors)
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  try {
    const response = await fetch(`${window.location.origin}/api${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    showToast(error.message, 'error');
    throw error; // Re-throw for caller handling
  }
}

// Toast Notification System
export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type} show`; // Add 'show' for animation

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Number Formatting (Indian Rupees style)
export function formatRupees(number) {
  return Number.isNaN(+number) 
    ? '—' 
    : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(+number);
}

// Basic Form Validation Helper
export function validateForm(formData, rules) {
  const errors = {};
  Object.keys(rules).forEach(key => {
    const value = formData[key];
    const { required, minLength, pattern } = rules[key];

    if (required && !value?.trim()) {
      errors[key] = `${key} is required`;
    } else if (minLength && value?.length < minLength) {
      errors[key] = `${key} must be at least ${minLength} characters`;
    } else if (pattern && !pattern.test(value)) {
      errors[key] = `${key} format is invalid`;
    }
  });
  return errors;
}

// Debounce Function (for search inputs)
export function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Export for use in other JS files
console.log('Utils loaded'); // Debug log