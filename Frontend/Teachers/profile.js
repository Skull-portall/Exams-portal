// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const personalInfoForm = document.getElementById('personalInfoForm');
const passwordForm = document.getElementById('passwordForm');
const preferencesForm = document.getElementById('preferencesForm');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const successMessage = document.getElementById('successMessage');
const changeAvatarBtn = document.querySelector('.change-avatar-btn');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('logout')) {
            // Clear any stored credentials/session
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = '../index.html';
            return;
        }
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Handle navigation
        const page = item.dataset.page;
        switch(page) {
            case 'dashboard':
                window.location.href = 'dash.html';
                break;
            case 'tests':
                window.location.href = 'create-test.html';
                break;
            case 'exams':
                window.location.href = 'create-exam.html';
                break;
            case 'submissions':
                window.location.href = 'submissions.html';
                break;
            case 'grades':
                window.location.href = 'grades.html';
                break;
        }
    });
});

// Initialize profile
document.addEventListener('DOMContentLoaded', () => {
    // Load teacher data
    const teacherData = JSON.parse(sessionStorage.getItem('currentTeacher'));
    if (teacherData) {
        document.querySelector('.user-name').textContent = teacherData.name;
        document.querySelector('.profile-info h2').textContent = teacherData.name;
        document.getElementById('fullName').value = teacherData.name;
        document.getElementById('email').value = teacherData.email;
        document.getElementById('subject').value = teacherData.subject || 'Mathematics';
        document.querySelector('.profile-info p:first-of-type').textContent = 
            `${teacherData.subject || 'Mathematics'} Teacher`;
        document.querySelector('.profile-info p:last-of-type').textContent = 
            teacherData.schoolName || 'Sky Secondary School';
    } else {
        window.location.href = '../index.html';
    }

    // Load preferences from localStorage
    const preferences = JSON.parse(localStorage.getItem('teacherPreferences') || '{}');
    document.getElementById('emailNotifications').checked = preferences.emailNotifications ?? true;
    document.getElementById('autoGrade').checked = preferences.autoGrade ?? false;
    document.getElementById('reminderEmails').checked = preferences.reminderEmails ?? true;
});

// Personal Information Form
personalInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    // Update session storage
    const teacherData = JSON.parse(sessionStorage.getItem('currentTeacher') || '{}');
    sessionStorage.setItem('currentTeacher', JSON.stringify({
        ...teacherData,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone
    }));

    // Show success message
    showSuccessModal('Personal information updated successfully!');
});

// Password Form
passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate passwords
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    // Here you would typically verify the current password and update to the new one
    console.log('Updating password...');

    // Clear form
    passwordForm.reset();

    // Show success message
    showSuccessModal('Password updated successfully!');
});

// Preferences Form
preferencesForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const preferences = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        autoGrade: document.getElementById('autoGrade').checked,
        reminderEmails: document.getElementById('reminderEmails').checked
    };

    // Save preferences to localStorage
    localStorage.setItem('teacherPreferences', JSON.stringify(preferences));

    // Show success message
    showSuccessModal('Preferences updated successfully!');
});

// Change Avatar
changeAvatarBtn.addEventListener('click', () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here you would typically upload the file to a server
            // For now, we'll just create a preview
            const reader = new FileReader();
            reader.onload = (event) => {
                document.querySelector('.profile-avatar').src = event.target.result;
                document.querySelector('.user-avatar').src = event.target.result;
            };
            reader.readAsDataURL(file);

            // Show success message
            showSuccessModal('Profile picture updated successfully!');
        }
    });

    fileInput.click();
});

// Modal functions
function showSuccessModal(message) {
    successMessage.textContent = message;
    successModal.classList.add('active');
}

closeModal.addEventListener('click', () => {
    successModal.classList.remove('active');
});