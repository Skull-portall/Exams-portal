// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const personalInfoForm = document.getElementById('personalInfoForm');
const passwordForm = document.getElementById('passwordForm');
const adminSettingsForm = document.getElementById('adminSettingsForm');
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
            case 'teachers':
                window.location.href = 'teachers.html';
                break;
            case 'students':
                window.location.href = 'students.html';
                break;
        }
    });
});

// Initialize profile
document.addEventListener('DOMContentLoaded', () => {
    // Load admin data
    const adminData = JSON.parse(sessionStorage.getItem('currentAdmin'));
    if (adminData) {
        document.querySelector('.user-name').textContent = adminData.name || 'Admin';
        document.getElementById('fullName').value = adminData.name || 'Admin';
        document.getElementById('email').value = adminData.email || 'admin@school.edu';
    } else {
        window.location.href = '../index.html';
    }
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

    // Here you would typically send this data to a server
    console.log('Updating personal information:', formData);

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

// Admin Settings Form
adminSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        autoApprove: document.getElementById('autoApprove').checked,
        maintenanceMode: document.getElementById('maintenanceMode').checked
    };

    // Here you would typically send this data to a server
    console.log('Updating admin settings:', settings);

    // Show success message
    showSuccessModal('Admin settings updated successfully!');
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