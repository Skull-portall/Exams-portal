// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const startTestButtons = document.querySelectorAll('.start-test-btn');
const logoutButton = document.querySelector('.nav-item.logout');

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
            case 'tests':
                window.location.href = 'test.html';
                break;
            case 'exams':
                window.location.href = 'exam.html';
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

// Start test buttons
startTestButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const testItem = e.target.closest('.test-item');
        const testName = testItem.querySelector('h3').textContent;
        const testType = testItem.querySelector('p').textContent;
        
        // Navigate to test page with parameters
        window.location.href = `test.html?name=${encodeURIComponent(testName)}&type=${encodeURIComponent(testType)}`;
    });
});

// Add hover animations for cards
document.querySelectorAll('.stat-card, .test-item, .result-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    });
});

// Initialize notification badge
const notificationBadge = document.querySelector('.notification-badge');
notificationBadge.addEventListener('click', () => {
    // Implement notification panel logic here
    console.log('Opening notifications...');
});

// Load user data
function loadUserData() {
    const userData = JSON.parse(sessionStorage.getItem('currentStudent'));
    if (userData) {
        document.querySelector('.user-name').textContent = userData.name;
        // Update other UI elements with user data
    } else {
        // Redirect to login if no user data found
        window.location.href = '../index.html';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});