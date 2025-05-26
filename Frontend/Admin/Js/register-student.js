// DOM Elements
const registerForm = document.getElementById('registerForm');

// Form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages();

    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        studentId: document.getElementById('studentId').value.trim(),
        class: document.getElementById('class').value,
        parentName: document.getElementById('parentName').value.trim(),
        parentContact: document.getElementById('parentContact').value.trim()
    };

    // Check if student ID already exists
    const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
    if (existingStudents.some(student => student.studentId === formData.studentId)) {
        showError('This Student ID is already registered');
        return;
    }

    // Add to registered students
    existingStudents.push(formData);
    localStorage.setItem('students', JSON.stringify(existingStudents));

    // Show success message and redirect
    showSuccess('Student registered successfully!');
    setTimeout(() => {
        window.location.href = '/Frontend/Admin/Html/dash.html';
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

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is logged in
    const adminData = JSON.parse(sessionStorage.getItem('currentAdmin'));
    if (!adminData) {
        window.location.href = '/Frontend/index.html';
    }
});