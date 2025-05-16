// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const createTestForm = document.getElementById('createTestForm');
const questionsList = document.getElementById('questionsList');
const addQuestionBtns = document.querySelectorAll('.add-question-btn');
const previewBtn = document.querySelector('.preview-btn');
const previewModal = document.getElementById('previewModal');
const successModal = document.getElementById('successModal');
const closeModalBtns = document.querySelectorAll('.close-modal');

let questions = [];
let questionCounter = 0;

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
            case 'exams':
                window.location.href = 'create-exam.html';
                break;
            case 'submissions':
                    window.location.href = 'submissions.html';
                break;
            case 'profile':
                window.location.href = 'profile.html';
                break;
            case 'students':
                window.location.href = 'students.html';
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

// Add Question
addQuestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        addQuestion(type);
    });
});

function addQuestion(type) {
    questionCounter++;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.dataset.questionId = questionCounter;

    const questionContent = `
        <div class="question-header">
            <span class="question-number">Question ${questionCounter}</span>
            <span class="question-type">${type === 'multiple' ? 'Multiple Choice' : 'Essay'}</span>
        </div>
        <div class="form-group">
            <label for="question${questionCounter}">Question Text</label>
            <textarea id="question${questionCounter}" required class="question-text"></textarea>
        </div>
        ${type === 'multiple' ? createMultipleChoiceOptions(questionCounter) : ''}
        <div class="question-actions">
            <button type="button" class="delete-question" onclick="deleteQuestion(${questionCounter})">
                <span class="icon">🗑️</span> Delete Question
            </button>
        </div>
    `;

    questionDiv.innerHTML = questionContent;
    questionsList.appendChild(questionDiv);

    questions.push({
        id: questionCounter,
        type: type,
        text: '',
        options: type === 'multiple' ? ['', '', '', ''] : null,
        correctAnswer: type === 'multiple' ? 0 : null
    });
}

function createMultipleChoiceOptions(questionId) {
    return `
        <div class="options-list">
            ${Array.from({length: 4}, (_, i) => `
                <div class="option-item">
                    <input type="radio" name="correct${questionId}" value="${i}" ${i === 0 ? 'checked' : ''}>
                    <input type="text" placeholder="Option ${i + 1}" required class="option-text">
                </div>
            `).join('')}
        </div>
    `;
}

function deleteQuestion(questionId) {
    const questionDiv = document.querySelector(`[data-question-id="${questionId}"]`);
    questionDiv.remove();
    questions = questions.filter(q => q.id !== questionId);
}

// Preview Test
previewBtn.addEventListener('click', () => {
    updateQuestionsData();
    const modalBody = previewModal.querySelector('.modal-body');
    modalBody.innerHTML = generatePreview();
    previewModal.classList.add('active');
});

function generatePreview() {
    const testTitle = document.getElementById('testTitle').value;
    const subject = document.getElementById('subject').value;
    const duration = document.getElementById('duration').value;
    const testDate = document.getElementById('testDate').value;
    const testTime = document.getElementById('testTime').value;

    return `
        <div class="test-preview">
            <h3>${testTitle}</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Duration:</strong> ${duration} minutes</p>
            <p><strong>Date:</strong> ${testDate} at ${testTime}</p>
            <hr>
            ${questions.map((q, index) => `
                <div class="preview-question">
                    <p><strong>Question ${index + 1}:</strong> ${q.text}</p>
                    ${q.type === 'multiple' ? `
                        <div class="preview-options">
                            ${q.options.map((opt, i) => `
                                <div class="preview-option">
                                    <input type="radio" disabled ${i === q.correctAnswer ? 'checked' : ''}>
                                    <span>${opt}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Form Submission
createTestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    updateQuestionsData();

    const testData = {
        title: document.getElementById('testTitle').value,
        subject: document.getElementById('subject').value,
        class: document.getElementById('class').value,
        duration: parseInt(document.getElementById('duration').value),
        date: document.getElementById('testDate').value,
        time: document.getElementById('testTime').value,
        questions: questions
    };

    // Store in localStorage for demo purposes
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    tests.push({
        ...testData,
        id: Date.now(),
        status: 'upcoming',
        submissions: []
    });
    localStorage.setItem('tests', JSON.stringify(tests));

    // Show success modal
    successModal.classList.add('active');
});

function updateQuestionsData() {
    document.querySelectorAll('.question-item').forEach(questionDiv => {
        const questionId = parseInt(questionDiv.dataset.questionId);
        const question = questions.find(q => q.id === questionId);
        if (question) {
            question.text = questionDiv.querySelector('.question-text').value;
            if (question.type === 'multiple') {
                question.options = Array.from(questionDiv.querySelectorAll('.option-text'))
                    .map(input => input.value);
                question.correctAnswer = parseInt(questionDiv.querySelector('input[type="radio"]:checked').value);
            }
        }
    });
}

// Close modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        previewModal.classList.remove('active');
        successModal.classList.remove('active');
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

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('testDate').min = today;
});