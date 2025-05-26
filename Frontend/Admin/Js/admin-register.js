// // DOM Elements
// const registerForm = document.getElementById('registerForm');

// // Form submission
// registerForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     clearMessages();

//     const fullName = document.getElementById('fullName').value.trim();
//     const email = document.getElementById('email').value.trim();
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;

//     // Validate passwords match
//     if (password !== confirmPassword) {
//         showError('Passwords do not match');
//         return;
//     }

//     // Validate email format
//     if (!isValidEmail(email)) {
//         showError('Please enter a valid email address');
//         return;
//     }

//     // Check if email already exists
//     const admins = JSON.parse(localStorage.getItem('admins') || '[]');
//     if (admins.some(admin => admin.email === email)) {
//         showError('This email is already registered');
//         return;
//     }

//     // Create new admin object
//     const newAdmin = {
//         name: fullName,
//         email: email,
//         password: password
//     };

//     // Add to registered admins
//     admins.push(newAdmin);
//     localStorage.setItem('admins', JSON.stringify(admins));

//     // Show success message and redirect
//     showSuccess('Registration successful! Redirecting to login...');
//     setTimeout(() => {
//         window.location.href = '../../index.html';
//     }, 1500);
// });

// // Helper functions
// function showError(message) {
//     const errorDiv = document.createElement('div');
//     errorDiv.className = 'error-message';
//     errorDiv.textContent = message;
//     registerForm.insertBefore(errorDiv, registerForm.firstChild);
// }

// function showSuccess(message) {
//     const successDiv = document.createElement('div');
//     successDiv.className = 'success-message';
//     successDiv.textContent = message;
//     registerForm.insertBefore(successDiv, registerForm.firstChild);
// }

// function clearMessages() {
//     const messages = document.querySelectorAll('.error-message, .success-message');
//     messages.forEach(message => message.remove());
// }

// function isValidEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }