// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const classFilter = document.getElementById('classFilter');
const typeFilter = document.getElementById('typeFilter');
const statusFilter = document.getElementById('statusFilter');
const gradeButtons = document.querySelectorAll('.grade-btn');
const viewButtons = document.querySelectorAll('.view-btn');

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
            case 'grades':
                window.location.href = 'grades.html';
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
    const submissionCards = document.querySelectorAll('.submission-card');
    
    submissionCards.forEach(card => {
        const studentName = card.querySelector('.submission-details p:first-child').textContent.toLowerCase();
        const testName = card.querySelector('h3').textContent.toLowerCase();
        
        if (studentName.includes(searchTerm) || testName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Filter functionality
function applyFilters() {
    const selectedClass = classFilter.value;
    const selectedType = typeFilter.value;
    const selectedStatus = statusFilter.value;
    
    const submissionCards = document.querySelectorAll('.submission-card');
    
    submissionCards.forEach(card => {
        const cardClass = card.querySelector('.submission-details p:nth-child(2)').textContent.toLowerCase();
        const cardType = card.querySelector('h3').textContent.toLowerCase();
        const cardStatus = card.classList.contains('pending') ? 'pending' : 'graded';
        
        const classMatch = !selectedClass || cardClass.includes(selectedClass.toLowerCase());
        const typeMatch = !selectedType || cardType.includes(selectedType.toLowerCase());
        const statusMatch = !selectedStatus || cardStatus === selectedStatus;
        
        if (classMatch && typeMatch && statusMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

[classFilter, typeFilter, statusFilter].forEach(filter => {
    filter.addEventListener('change', applyFilters);
});

// Grade buttons
gradeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.submission-card');
        const testName = card.querySelector('h3').textContent;
        const studentName = card.querySelector('.submission-details p:first-child').textContent;
        
        // Store submission info in session storage
        sessionStorage.setItem('gradingSubmission', JSON.stringify({
            test: testName,
            student: studentName,
            timestamp: new Date().toISOString()
        }));
        
        // Navigate to grading page
        window.location.href = 'grades.html';
    });
});

// View buttons
viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.submission-card');
        const testName = card.querySelector('h3').textContent;
        const studentName = card.querySelector('.submission-details p:first-child').textContent;
        
        // Store submission info in session storage
        sessionStorage.setItem('viewingSubmission', JSON.stringify({
            test: testName,
            student: studentName,
            grade: card.querySelector('.submission-details p:last-child').textContent
        }));
        
        // Navigate to submission details page
        window.location.href = 'submission-details.html';
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load teacher data
    const teacherData = JSON.parse(sessionStorage.getItem('currentTeacher'));
    if (teacherData) {
        document.querySelector('.user-name').textContent = teacherData.name;
    } else {
        window.location.href = '../index.html';
    }
    
    // Load submissions from localStorage
    loadSubmissions();
});

function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    
    // Update submission counts
    const pendingCount = submissions.filter(s => !s.graded).length;
    const gradedCount = submissions.filter(s => s.graded).length;
    
    // Update UI with counts
    document.querySelector('.welcome-section p').textContent = 
        `${pendingCount} pending submissions, ${gradedCount} recently graded`;
}