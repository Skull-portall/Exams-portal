// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const notificationBadge = document.querySelector('.notification-badge');
const gradeButtons = document.querySelectorAll('.grade-btn');
const viewAllButtons = document.querySelectorAll('.view-all-btn');
const actionButtons = document.querySelectorAll('.action-btn');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('logout')) {
            // Handle logout
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

// Grade buttons
gradeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const submissionItem = e.target.closest('.submission-item');
        const testName = submissionItem.querySelector('h3').textContent;
        const studentInfo = submissionItem.querySelector('p').textContent;
        
        // Navigate to grading page with parameters
        window.location.href = `grade.html?test=${encodeURIComponent(testName)}&student=${encodeURIComponent(studentInfo)}`;
    });
});

// View all buttons
viewAllButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.closest('section');
        if (section.classList.contains('recent-submissions')) {
            window.location.href = 'submissions.html';
        } else if (section.classList.contains('class-schedule')) {
            window.location.href = 'schedule.html';
        }
    });
});

// Quick action buttons
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent.trim();
        switch(action) {
            case 'Create New Test':
                window.location.href = 'create-test.html';
                break;
            case 'Generate Reports':
                window.location.href = 'reports.html';
                break;
            case 'Send Announcements':
                window.location.href = 'announcements.html';
                break;
            case 'Manage Students':
                window.location.href = 'students.html';
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
    // Load teacher data
    loadTeacherData();
    
    // Update schedule status
    updateScheduleStatus();
});

// Load teacher data
function loadTeacherData() {
    // In a real app, this would fetch data from a backend
    const teacherData = {
        name: 'Ms. Sarah Johnson',
        avatar: '/Frontend/img/school .png',
        activeClasses: 5,
        pendingTests: 3,
        upcomingExams: 2,
        classAverage: '85%'
    };

    // Update UI with teacher data
    document.querySelector('.user-name').textContent = teacherData.name;
    document.querySelector('.user-avatar').src = teacherData.avatar;
}

// Update schedule status
function updateScheduleStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    document.querySelectorAll('.schedule-item').forEach(item => {
        const timeText = item.querySelector('.schedule-time').textContent;
        const [hours, minutes] = timeText.match(/(\d+):(\d+)/).slice(1);
        const period = timeText.includes('PM') ? 'PM' : 'AM';
        
        let scheduleHour = parseInt(hours);
        if (period === 'PM' && scheduleHour !== 12) {
            scheduleHour += 12;
        }

        const scheduleMinutes = parseInt(minutes);
        const status = item.querySelector('.schedule-status');

        if (currentHour === scheduleHour) {
            status.textContent = 'Ongoing';
            status.className = 'schedule-status ongoing';
        } else if (currentHour < scheduleHour || (currentHour === scheduleHour && currentMinutes < scheduleMinutes)) {
            status.textContent = 'Upcoming';
            status.className = 'schedule-status upcoming';
        } else {
            status.textContent = 'Completed';
            status.className = 'schedule-status completed';
        }
    });
}