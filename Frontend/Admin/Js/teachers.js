// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const subjectFilter = document.getElementById('subjectFilter');
const statusFilter = document.getElementById('statusFilter');
const teachersGrid = document.querySelector('.teachers-grid');
const confirmationModal = document.getElementById('confirmationModal');
const confirmAction = document.getElementById('confirmAction');
const cancelAction = document.getElementById('cancelAction');

let currentAction = null;
let selectedTeacherId = null;

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
            case 'dashboard':
                window.location.href = 'dash.html';
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

// Search and Filter functionality
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSubject = subjectFilter.value;
    const selectedStatus = statusFilter.value;
    
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm) ||
                            teacher.email.toLowerCase().includes(searchTerm);
        const matchesSubject = !selectedSubject || teacher.subject === selectedSubject;
        const matchesStatus = !selectedStatus || teacher.status === selectedStatus;
        
        return matchesSearch && matchesSubject && matchesStatus;
    });
    
    displayTeachers(filteredTeachers);
}

searchInput.addEventListener('input', applyFilters);
subjectFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);

// Display teachers
function displayTeachers(teachers) {
    teachersGrid.innerHTML = teachers.map(teacher => `
        <div class="teacher-card" data-id="${teacher.email}">
            <div class="teacher-header">
                <img src="/Frontend/img/school .png" alt="${teacher.name}" class="teacher-avatar">
                <div class="teacher-status ${teacher.status || 'active'}">${teacher.status || 'Active'}</div>
            </div>
            <div class="teacher-info">
                <h3>${teacher.name}</h3>
                <p>${teacher.subject}</p>
                <p>${teacher.email}</p>
            </div>
            <div class="teacher-actions">
                <button class="edit-btn" onclick="editTeacher('${teacher.email}')">
                    <span class="icon">✏️</span> Edit
                </button>
                <button class="deactivate-btn" onclick="toggleTeacherStatus('${teacher.email}')">
                    <span class="icon">🔄</span> ${teacher.status === 'inactive' ? 'Activate' : 'Deactivate'}
                </button>
                <button class="delete-btn" onclick="deleteTeacher('${teacher.email}')">
                    <span class="icon">🗑️</span> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Teacher actions
function editTeacher(email) {
    // Store the teacher email in session storage
    sessionStorage.setItem('editingTeacher', email);
    window.location.href = 'edit-teacher.html';
}

function toggleTeacherStatus(email) {
    selectedTeacherId = email;
    currentAction = 'toggle-status';
    const teacher = getTeacherByEmail(email);
    const newStatus = teacher.status === 'inactive' ? 'activate' : 'deactivate';
    
    document.getElementById('confirmationMessage').textContent = 
        `Are you sure you want to ${newStatus} ${teacher.name}?`;
    confirmationModal.classList.add('active');
}

function deleteTeacher(email) {
    selectedTeacherId = email;
    currentAction = 'delete';
    const teacher = getTeacherByEmail(email);
    
    document.getElementById('confirmationMessage').textContent = 
        `Are you sure you want to delete ${teacher.name}? This action cannot be undone.`;
    confirmationModal.classList.add('active');
}

// Confirmation modal actions
confirmAction.addEventListener('click', () => {
    if (currentAction === 'delete') {
        const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
        const updatedTeachers = teachers.filter(t => t.email !== selectedTeacherId);
        localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
    } else if (currentAction === 'toggle-status') {
        const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
        const updatedTeachers = teachers.map(t => {
            if (t.email === selectedTeacherId) {
                t.status = t.status === 'inactive' ? 'active' : 'inactive';
            }
            return t;
        });
        localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
    }
    
    confirmationModal.classList.remove('active');
    loadTeachers();
});

cancelAction.addEventListener('click', () => {
    confirmationModal.classList.remove('active');
});

// Helper functions
function getTeacherByEmail(email) {
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    return teachers.find(t => t.email === email) || {};
}

function loadTeachers() {
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    displayTeachers(teachers);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load admin data
    const adminData = JSON.parse(sessionStorage.getItem('currentAdmin'));
    if (adminData) {
        document.querySelector('.user-name').textContent = adminData.name;
    } else {
        window.location.href = '/Frontend/index.html';
    }
    
    // Load initial teachers list
    loadTeachers();
});