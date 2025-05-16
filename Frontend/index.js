// // DOM Elements
// const loginForm = document.getElementById('loginForm');
// const userTypeButtons = document.querySelectorAll('.toggle-btn');
// const studentFields = document.querySelectorAll('.student-field');
// const staffFields = document.querySelectorAll('.staff-field');
// const registerBtn = document.querySelector('.register-btn');

// // Sample valid credentials (in a real app, this would come from a backend)
// const validCredentials = {
//     students: [
//         { id: "STU001", name: "John Doe" },
//         { id: "STU002", name: "Jane Smith" }
//     ],
//     teachers: [
//         { email: "teacher@example.com", password: "teacher123", name: "Sarah Johnson" },
//         { email: "prof@example.com", password: "prof123", name: "Michael Brown" }
//     ],
//     admins: [
//         { email: "admin@example.com", password: "admin123", name: "Admin User" }
//     ]
// };

// // Toggle user type
// userTypeButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         // Update active state
//         userTypeButtons.forEach(btn => btn.classList.remove('active'));
//         button.classList.add('active');

//         const userType = button.dataset.type;

//         if (userType === 'student') {
//             // Show student fields
//             studentFields.forEach(f => {
//                 f.classList.remove('hidden');
//                 const inp = f.querySelector('input');
//                 if (inp) {
//                     inp.disabled = false;
//                     inp.required = true;
//                 }
//             });
//             // Hide staff fields
//             staffFields.forEach(f => {
//                 f.classList.add('hidden');
//                 const inp = f.querySelector('input');
//                 if (inp) {
//                     inp.disabled = true;
//                     inp.required = false;
//                 }
//             });
//             registerBtn.classList.add('hidden');

//         } else {
//             // Hide student fields
//             studentFields.forEach(f => {
//                 f.classList.add('hidden');
//                 const inp = f.querySelector('input');
//                 if (inp) {
//                     inp.disabled = true;
//                     inp.required = false;
//                 }
//             });
//             // Show staff fields
//             staffFields.forEach(f => {
//                 f.classList.remove('hidden');
//                 const inp = f.querySelector('input');
//                 if (inp) {
//                     inp.disabled = false;
//                     inp.required = true;
//                 }
//             });
//             // Show register only for admin
//             if (userType === 'admin') {
//                 registerBtn.classList.remove('hidden');
//             } else {
//                 registerBtn.classList.add('hidden');
//             }
//         }

//         // Reset form & clear messages
//         loginForm.reset();
//         clearMessages();
//     });
// });

// // Form submission
// loginForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     clearMessages();

//     const userType = document.querySelector('.toggle-btn.active').dataset.type;

//     if (userType === 'student') {
//         handleStudentLogin();
//     } else if (userType === 'teacher') {
//         handleTeacherLogin();
//     } else if (userType === 'admin') {
//         handleAdminLogin();
//     }
// });

// function handleStudentLogin() {
//     const name = document.getElementById('name').value.trim();
//     const studentId = document.getElementById('studentId').value.trim();

//     if (!name || !studentId) {
//         showError('Please fill in all fields');
//         return;
//     }

//     const validStudent = validCredentials.students.find(student =>
//         student.id === studentId &&
//         student.name.toLowerCase() === name.toLowerCase()
//     );

//     if (validStudent) {
//         showSuccess('Login successful! Redirecting to student dashboard...');
//         sessionStorage.setItem('currentStudent', JSON.stringify(validStudent));
//         setTimeout(() => {
//             window.location.href = 'Student/dash.html';
//         }, 1500);
//     } else {
//         showError('Invalid student credentials');
//     }
// }

// function handleTeacherLogin() {
//     const name = document.getElementById('fullName').value.trim();
//     const email = document.getElementById('email').value.trim();
//     const password = document.getElementById('password').value;

//     if (!name || !email || !password) {
//         showError('Please fill in all fields');
//         return;
//     }

//     const validTeacher = validCredentials.teachers.find(teacher =>
//         teacher.email === email &&
//         teacher.password === password &&
//         teacher.name.toLowerCase() === name.toLowerCase()
//     );

//     if (validTeacher) {
//         showSuccess('Login successful! Redirecting to teacher dashboard...');
//         sessionStorage.setItem('currentTeacher', JSON.stringify(validTeacher));
//         setTimeout(() => {
//             window.location.href = 'Teachers/dash.html';
//         }, 1500);
//     } else {
//         showError('Invalid teacher credentials');
//     }
// }

// function handleAdminLogin() {
//     const name = document.getElementById('fullName').value.trim();
//     const email = document.getElementById('email').value.trim();
//     const password = document.getElementById('password').value;

//     if (!name || !email || !password) {
//         showError('Please fill in all fields');
//         return;
//     }

//     const validAdmin = validCredentials.admins.find(admin =>
//         admin.email === email &&
//         admin.password === password &&
//         admin.name.toLowerCase() === name.toLowerCase()
//     );

//     if (validAdmin) {
//         showSuccess('Login successful! Redirecting to admin dashboard...');
//         sessionStorage.setItem('currentAdmin', JSON.stringify(validAdmin));
//         setTimeout(() => {
//             window.location.href = 'Admin/dash.html';
//         }, 1500);
//     } else {
//         showError('Invalid admin credentials');
//     }
// }

// // Register button click
// registerBtn.addEventListener('click', () => {
//     window.location.href = 'Admin/admin-register.html';
// });

// // Helper functions
// function showError(message) {
//     clearMessages();
//     const errorDiv = document.createElement('div');
//     errorDiv.className = 'error-message';
//     errorDiv.textContent = message;
//     loginForm.insertBefore(errorDiv, loginForm.firstChild);
// }

// function showSuccess(message) {
//     clearMessages();
//     const successDiv = document.createElement('div');
//     successDiv.className = 'success-message';
//     successDiv.textContent = message;
//     loginForm.insertBefore(successDiv, loginForm.firstChild);
// }

// function clearMessages() {
//     document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
// }

// // Initialize on load
// document.addEventListener('DOMContentLoaded', () => {
//     sessionStorage.clear();
//     document.querySelector('[data-type="student"]').click();
// });


// DOM Elements
const loginForm = document.getElementById('loginForm');
const userTypeButtons = document.querySelectorAll('.toggle-btn');
const studentFields = document.querySelectorAll('.student-field');
const staffFields = document.querySelectorAll('.staff-field');
const registerBtn = document.querySelector('.register-btn');
const roleInput = document.createElement('input');

// Add hidden input for role
roleInput.type = 'hidden';
roleInput.name = 'role';
roleInput.id = 'userRole';
roleInput.value = 'student';
loginForm.appendChild(roleInput);

// Toggle user type
userTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        userTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const userType = button.dataset.type;
        roleInput.value = userType;

        if (userType === 'student') {
            studentFields.forEach(f => {
                f.classList.remove('hidden');
                const inp = f.querySelector('input');
                if (inp) {
                    inp.disabled = false;
                    inp.required = true;
                }
            });
            staffFields.forEach(f => {
                f.classList.add('hidden');
                const inp = f.querySelector('input');
                if (inp) {
                    inp.disabled = true;
                    inp.required = false;
                }
            });
            registerBtn.classList.add('hidden');

        } else {
            studentFields.forEach(f => {
                f.classList.add('hidden');
                const inp = f.querySelector('input');
                if (inp) {
                    inp.disabled = true;
                    inp.required = false;
                }
            });
            staffFields.forEach(f => {
                f.classList.remove('hidden');
                const inp = f.querySelector('input');
                if (inp) {
                    inp.disabled = false;
                    inp.required = true;
                }
            });

            registerBtn.classList.toggle('hidden', userType !== 'admin');
        }

        loginForm.reset();
        clearMessages();
    });
});

// Submit to backend via POST
loginForm.addEventListener('submit', (e) => {
    clearMessages();
    // allow form to POST normally to loginRoute.php
});

// Register button (admin only)
registerBtn.addEventListener('click', () => {
    window.location.href = 'Admin/admin-register.html';
});

// Helper UI functions
function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
}

// Initialize default view
document.addEventListener('DOMContentLoaded', () => {
    sessionStorage.clear(); // Optional
    document.querySelector('[data-type="student"]').click(); // Default to student
});
