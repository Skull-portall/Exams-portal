// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const notificationBadge = document.querySelector('.notification-badge');
const reviewButtons = document.querySelectorAll('.review-btn');
const viewAllButtons = document.querySelectorAll('.view-all-btn');
const actionButtons = document.querySelectorAll('.action-btn');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('logout')) {
            // Clear any stored credentials/session
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = '/Frontend/index.html';
            return;
        }
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Handle navigation
        const page = item.dataset.page;
        switch(page) {
            case 'teachers':
                window.location.href = 'teachers.html';
                break;
            case 'students':
                window.location.href = 'students.html';
                break;
            case 'profile':
                window.location.href = 'profile.html';
                break;
        }
    });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search logic here
    console.log(`Searching for: ${searchTerm}`);
});

// Review buttons
reviewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const activityItem = e.target.closest('.activity-item');
        const activityType = activityItem.querySelector('h3').textContent;
        const activityInfo = activityItem.querySelector('p').textContent;
        
        // Store activity info in session storage
        sessionStorage.setItem('reviewingActivity', JSON.stringify({
            type: activityType,
            info: activityInfo,
            timestamp: new Date().toISOString()
        }));
        
        // Navigate to appropriate review page
        if (activityType.includes('Teacher')) {
            window.location.href = 'teachers.html';
        } else if (activityType.includes('Student')) {
            window.location.href = 'students.html';
        }
    });
});

// View all buttons
viewAllButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.closest('section');
        if (section.classList.contains('recent-activities')) {
            window.location.href = 'activities.html';
        }
    });
});

// Quick action buttons
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent.trim();
        switch(action) {
            case 'Register Teacher':
                window.location.href = 'register.html';
                break;
            case 'Register Student':
                window.location.href = 'register-student.html';
                break;
            case 'Generate Reports':
                window.location.href = 'reports.html';
                break;
            case 'System Settings':
                window.location.href = 'settings.html';
                break;
        }
    });
});

// Notification badge
notificationBadge.addEventListener('click', () => {
    // Implement notification panel logic here
    console.log('Opening notifications...');
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Load admin data
    loadAdminData();
    
    // Load recent activities
    loadRecentActivities();
    
    // Update stats
    updateDashboardStats();
});

// Load admin data
function loadAdminData() {
    const adminData = JSON.parse(sessionStorage.getItem('currentAdmin'));
    if (adminData) {
        document.querySelector('.user-name').textContent = adminData.name;
    } else {
        window.location.href = '/Frontend/index.html';
    }
}

// Load recent activities
function loadRecentActivities() {
    // In a real app, this would fetch data from a backend
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    // Update activity list if needed
    if (activities.length > 0) {
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-info">
                    <h3>${activity.type}</h3>
                    <p>${activity.description}</p>
                    <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
                </div>
                <button class="review-btn">Review</button>
            </div>
        `).join('');
    }
}

// Update dashboard stats
function updateDashboardStats() {
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    // Update stats in UI
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = teachers.length;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = students.length;
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = classes.length;
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = 
        registrations.filter(r => isThisWeek(new Date(r.timestamp))).length;
}

// Helper functions
function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function isThisWeek(date) {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() + 6));
    return date >= weekStart && date <= weekEnd;
}