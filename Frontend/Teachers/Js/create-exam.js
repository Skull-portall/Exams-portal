// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const createExamForm = document.getElementById('createExamForm');
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
            case 'tests':
                window.location.href = 'create-test.html';
                 break;
                  case 'submissions':
                window.location.href = 'submissions.html';
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

    let questionContent = `
        <div class="question-header">
            <span class="question-number">Question ${questionCounter}</span>
            <span class="question-type">${getQuestionTypeLabel(type)}</span>
        </div>
        <div class="form-group">
            <label for="question${questionCounter}">Question Text</label>
            <textarea id="question${questionCounter}" required class="question-text"></textarea>
        </div>`;

    if (type === 'multiple') {
        questionContent += createMultipleChoiceOptions(questionCounter);
    } else if (type === 'calculation') {
        questionContent += createCalculationFields(questionCounter);
    }

    questionContent += `
        <div class="form-group">
            <label for="points${questionCounter}">Points</label>
            <input type="number" id="points${questionCounter}" min="1" value="10" required>
        </div>
        <div class="question-actions">
            <button type="button" class="delete-question" onclick="deleteQuestion(${questionCounter})">
                <span class="icon">🗑️</span> Delete Question
            </button>
        </div>`;

    questionDiv.innerHTML = questionContent;
    questionsList.appendChild(questionDiv);

    questions.push({
        id: questionCounter,
        type: type,
        text: '',
        points: 10,
        options: type === 'multiple' ? ['', '', '', ''] : null,
        correctAnswer: type === 'multiple' ? 0 : null
    });
}

function getQuestionTypeLabel(type) {
    switch(type) {
        case 'multiple':
            return 'Multiple Choice';
        case 'essay':
            return 'Essay';
        case 'calculation':
            return 'Calculation';
        default:
            return 'Question';
    }
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

function createCalculationFields(questionId) {
    return `
        <div class="calculation-fields">
            <div class="form-group">
                <label for="formula${questionId}">Formula</label>
                <input type="text" id="formula${questionId}" placeholder="e.g., a + b = c" required>
            </div>
            <div class="form-group">
                <label for="variables${questionId}">Variables Range</label>
                <input type="text" id="variables${questionId}" placeholder="a: 1-10, b: 5-15" required>
            </div>
        </div>
    `;
}

function deleteQuestion(questionId) {
    const questionDiv = document.querySelector(`[data-question-id="${questionId}"]`);
    questionDiv.remove();
    questions = questions.filter(q => q.id !== questionId);
}

// Preview Exam
previewBtn.addEventListener('click', () => {
    updateQuestionsData();
    const modalBody = previewModal.querySelector('.modal-body');
    modalBody.innerHTML = generatePreview();
    previewModal.classList.add('active');
});

function generatePreview() {
    const examTitle = document.getElementById('examTitle').value;
    const subject = document.getElementById('subject').value;
    const duration = document.getElementById('duration').value;
    const examDate = document.getElementById('examDate').value;
    const examTime = document.getElementById('examTime').value;
    const instructions = document.getElementById('instructions').value;

    return `
        <div class="exam-preview">
            <h3>${examTitle}</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Duration:</strong> ${duration} minutes</p>
            <p><strong>Date:</strong> ${examDate} at ${examTime}</p>
            ${instructions ? `<div class="instructions"><strong>Instructions:</strong><br>${instructions}</div>` : ''}
            <hr>
            ${questions.map((q, index) => `
                <div class="preview-question">
                    <p><strong>Question ${index + 1} (${q.points} points):</strong> ${q.text}</p>
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
                    ${q.type === 'calculation' ? `
                        <div class="preview-calculation">
                            <p><em>Formula:</em> ${q.formula}</p>
                            <p><em>Variables:</em> ${q.variables}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Form Submission
createExamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    updateQuestionsData();

    const examData = {
        title: document.getElementById('examTitle').value,
        subject: document.getElementById('subject').value,
        class: document.getElementById('class').value,
        duration: parseInt(document.getElementById('duration').value),
        date: document.getElementById('examDate').value,
        time: document.getElementById('examTime').value,
        instructions: document.getElementById('instructions').value,
        settings: {
            randomizeQuestions: document.getElementById('randomizeQuestions').checked,
            allowCalculator: document.getElementById('allowCalculator').checked,
            showResults: document.getElementById('showResults').checked
        },
        questions: questions
    };

    // Store in localStorage for demo purposes
    const exams = JSON.parse(localStorage.getItem('exams') || '[]');
    exams.push({
        ...examData,
        id: Date.now(),
        status: 'upcoming',
        submissions: []
    });
    localStorage.setItem('exams', JSON.stringify(exams));

    // Show success modal
    successModal.classList.add('active');
});

function updateQuestionsData() {
    document.querySelectorAll('.question-item').forEach(questionDiv => {
        const questionId = parseInt(questionDiv.dataset.questionId);
        const question = questions.find(q => q.id === questionId);
        if (question) {
            question.text = questionDiv.querySelector('.question-text').value;
            question.points = parseInt(questionDiv.querySelector(`#points${questionId}`).value);

            if (question.type === 'multiple') {
                question.options = Array.from(questionDiv.querySelectorAll('.option-text'))
                    .map(input => input.value);
                question.correctAnswer = parseInt(questionDiv.querySelector('input[type="radio"]:checked').value);
            } else if (question.type === 'calculation') {
                question.formula = questionDiv.querySelector(`#formula${questionId}`).value;
                question.variables = questionDiv.querySelector(`#variables${questionId}`).value;
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
    document.getElementById('examDate').min = today;
});