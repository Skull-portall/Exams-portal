// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const classFilter = document.getElementById('classFilter');
const subjectFilter = document.getElementById('subjectFilter');
const periodFilter = document.getElementById('periodFilter');
const gradesTableBody = document.getElementById('gradesTableBody');
const editGradeModal = document.getElementById('editGradeModal');
const editGradeForm = document.getElementById('editGradeForm');
const exportBtn = document.getElementById('exportGrades');
const printBtn = document.getElementById('printReport');

let currentGrades = [
    {
        id: '1',
        studentName: 'John Doe',
        class: '4a',
        subject: 'mathematics',
        testName: 'Mathematics Quiz 1',
        score: 85,
        date: '2024-02-15'
    },
    {
        id: '2',
        studentName: 'Jane Smith',
        class: '4b',
        subject: 'physics',
        testName: 'Physics Test',
        score: 72,
        date: '2024-02-10'
    },
    {
        id: '3',
        studentName: 'Mark Johnson',
        class: '4c',
        subject: 'chemistry',
        testName: 'Chemistry Midterm',
        score: 58,
        date: '2024-01-25'
    }
];

let selectedGradeId = null;

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('logout')) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '../index.html';
            return;
        }

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const page = item.dataset.page;
        switch (page) {
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
            case 'profile':
                window.location.href = 'profile.html';
                break;
        }
    });
});

// Apply filters and search
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedClass = classFilter.value;
    const selectedSubject = subjectFilter.value;
    const selectedPeriod = periodFilter.value;

    const filteredGrades = currentGrades.filter(grade => {
        const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm) ||
            grade.testName.toLowerCase().includes(searchTerm);
        const matchesClass = !selectedClass || grade.class === selectedClass;
        const matchesSubject = !selectedSubject || grade.subject === selectedSubject;
        const matchesPeriod = !selectedPeriod || isWithinPeriod(grade.date, selectedPeriod);
        return matchesSearch && matchesClass && matchesSubject && matchesPeriod;
    });

    displayGrades(filteredGrades);
}

searchInput.addEventListener('input', applyFilters);
classFilter.addEventListener('change', applyFilters);
subjectFilter.addEventListener('change', applyFilters);
periodFilter.addEventListener('change', applyFilters);

// Display grades in table
function displayGrades(grades) {
    gradesTableBody.innerHTML = grades.map(grade => `
        <tr>
            <td>${grade.studentName}</td>
            <td>${grade.class.toUpperCase()}</td>
            <td>${grade.testName}</td>
            <td>${grade.score}%</td>
            <td>${calculateGrade(grade.score)}</td>
            <td>${formatDate(grade.date)}</td>
            <td>
                <button class="edit-grade-btn" onclick="editGrade('${grade.id}')">Edit</button>
                <button class="view-details-btn" onclick="viewGradeDetails('${grade.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function calculateGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
}

function isWithinPeriod(dateStr, period) {
    const now = new Date();
    const date = new Date(dateStr);
    switch (period) {
        case 'this-week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo && date <= now;
        case 'this-month':
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        case 'this-term':
            const termStart = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            return date >= termStart && date <= now;
        default:
            return true;
    }
}

// Edit Grade
window.editGrade = function (gradeId) {
    selectedGradeId = gradeId;
    const grade = currentGrades.find(g => g.id === gradeId);
    if (!grade) return;

    document.getElementById('editScore').value = grade.score;
    document.getElementById('editComments').value = grade.comments || '';
    editGradeModal.classList.add('active');
};

window.viewGradeDetails = function (gradeId) {
    alert(`Viewing details for grade ID: ${gradeId}`);
};

// Close modal
document.querySelector('.close-modal').addEventListener('click', () => {
    editGradeModal.classList.remove('active');
});
document.querySelector('.cancel-btn').addEventListener('click', () => {
    editGradeModal.classList.remove('active');
});

// Save edited grade
editGradeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newScore = parseInt(document.getElementById('editScore').value);
    const newComments = document.getElementById('editComments').value;

    const index = currentGrades.findIndex(g => g.id === selectedGradeId);
    if (index !== -1) {
        currentGrades[index].score = newScore;
        currentGrades[index].comments = newComments;
        displayGrades(currentGrades);
        editGradeModal.classList.remove('active');
    }
});

// Export grades as CSV
exportBtn.addEventListener('click', () => {
    let csv = 'Student Name,Class,Test/Exam,Score,Grade,Date\n';
    currentGrades.forEach(grade => {
        csv += `${grade.studentName},${grade.class},${grade.testName},${grade.score}%,${calculateGrade(grade.score)},${formatDate(grade.date)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'grade-reports.csv';
    link.click();
});

// Print report
printBtn.addEventListener('click', () => {
    window.print();
});

// Initial load
displayGrades(currentGrades);
