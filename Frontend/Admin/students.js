// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const classFilter = document.getElementById('classFilter');
const statusFilter = document.getElementById('statusFilter');
const studentsTableBody = document.getElementById('studentsTableBody');
const studentDetailsModal = document.getElementById('studentDetailsModal');
const confirmationModal = document.getElementById('confirmationModal');
const closeModalBtns = document.querySelectorAll('.close-modal');

let currentAction = null;
let selectedStudentId = null;

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
            case 'profile':
                window.location.href = 'profile.html';
                break;
        }
    });
});

// Search and Filter functionality
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedClass = classFilter.value;
    const selectedStatus = statusFilter.value;
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.fullName.toLowerCase().includes(searchTerm) ||
                            student.studentId.toLowerCase().includes(searchTerm);
        const matchesClass = !selectedClass || student.class === selectedClass;
        const matchesStatus = !selectedStatus || student.status === selectedStatus;
        
        return matchesSearch && matchesClass && matchesStatus;
    });
    
    displayStudents(filteredStudents);
}

searchInput.addEventListener('input', applyFilters);
classFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);

// Display students
function displayStudents(students) {
    studentsTableBody.innerHTML = students.map(student => `
        <tr>
            <td>${student.studentId}</td>
            <td>${student.fullName}</td>
            <td>${student.class}</td>
            <td>${student.parentName}</td>
            <td>${student.parentContact}</td>
            <td>
                <span class="student-status ${student.status || 'active'}">
                    ${student.status || 'Active'}
                </span>
            </td>
            <td class="student-actions">
                <button class="view-btn" onclick="viewStudent('${student.studentId}')">View</button>
                <button class="edit-btn" onclick="editStudent('${student.studentId}')">Edit</button>
                <button class="delete-btn" onclick="deleteStudent('${student.studentId}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// View student details
function viewStudent(studentId) {
    const student = getStudentById(studentId);
    if (!student) return;

    const modalBody = studentDetailsModal.querySelector('.student-details');
    modalBody.innerHTML = `
        <div class="detail-group">
            <span class="detail-label">Student ID:</span>
            <span class="detail-value">${student.studentId}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Full Name:</span>
            <span class="detail-value">${student.fullName}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Class:</span>
            <span class="detail-value">${student.class}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Parent Name:</span>
            <span class="detail-value">${student.parentName}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Contact:</span>
            <span class="detail-value">${student.parentContact}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${student.status || 'Active'}</span>
        </div>
    `;

    studentDetailsModal.classList.add('active');
}

// Edit student
function editStudent(studentId) {
    // Store the student ID in session storage
    sessionStorage.setItem('editingStudent', studentId);
    window.location.href = 'edit-student.html';
}

// Delete student
function deleteStudent(studentId) {
    selectedStudentId = studentId;
    currentAction = 'delete';
    const student = getStudentById(studentId);
    
    document.getElementById('confirmationMessage').textContent = 
        `Are you sure you want to delete ${student.fullName}? This action cannot be undone.`;
    confirmationModal.classList.add('active');
}

// Confirmation modal actions
document.getElementById('confirmAction').addEventListener('click', () => {
    if (currentAction === 'delete') {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const updatedStudents = students.filter(s => s.studentId !== selectedStudentId);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
    }
    
    confirmationModal.classList.remove('active');
    applyFilters();
});

document.getElementById('cancelAction').addEventListener('click', () => {
    confirmationModal.classList.remove('active');
});

// Close modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        studentDetailsModal.classList.remove('active');
        confirmationModal.classList.remove('active');
    });
});

// Helper functions
function getStudentById(studentId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    return students.find(s => s.studentId === studentId);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load admin data
    const adminData = JSON.parse(sessionStorage.getItem('currentAdmin'));
    if (adminData) {
        document.querySelector('.user-name').textContent = adminData.name;
    } else {
        window.location.href = '../index.html';
    }
    
    // Load initial students list
    applyFilters();
});