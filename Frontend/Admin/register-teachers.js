// DOM Elements
const registerForm = document.getElementById('registerForm');

// Form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages();

    const formData = {
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Check if email already exists
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    if (teachers.some(teacher => teacher.email === formData.email)) {
        showError('This email is already registered');
        return;
    }

    // Add to registered teachers
    teachers.push({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        password: formData.password,
        status: 'active'
    });
    localStorage.setItem('teachers', JSON.stringify(teachers));

    // Show success message and redirect
    showSuccess('Teacher registered successfully!');
    setTimeout(() => {
        window.location.href = 'dash.html';
    }, 1500);
});

// Helper functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    registerForm.insertBefore(errorDiv, registerForm.firstChild);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    registerForm.insertBefore(successDiv, registerForm.firstChild);
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(message => message.remove());
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is logged in
    const adminData = JSON.parse(sessionStorage.getItem('currentAdmin'));
    if (!adminData) {
        window.location.href = '../index.html';
    }
});