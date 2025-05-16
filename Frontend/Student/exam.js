// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const startExamButtons = document.querySelectorAll('.start-exam-btn');
const examListView = document.getElementById('examListView');
const examInterface = document.getElementById('examInterface');
const timerDisplay = document.getElementById('timerDisplay');
const questionContainer = document.getElementById('questionContainer');
const optionsContainer = document.getElementById('optionsContainer');
const prevButton = document.getElementById('prevQuestion');
const nextButton = document.getElementById('nextQuestion');
const submitButton = document.getElementById('submitExam');
const confirmationModal = document.getElementById('confirmationModal');
const confirmSubmit = document.getElementById('confirmSubmit');
const cancelSubmit = document.getElementById('cancelSubmit');
const toolButtons = document.querySelectorAll('.tool-btn');

// Sample exam data
const examData = {
    math: {
        title: 'Mathematics Exam',
        duration: 7200, // 2 hours in seconds
        questions: [
            {
                id: 1,
                text: 'Solve the quadratic equation: x² + 5x + 6 = 0',
                type: 'long_answer'
            },
            {
                id: 2,
                text: 'Find the derivative of f(x) = 3x² + 2x - 1',
                type: 'long_answer'
            },
            {
                id: 3,
                text: 'Calculate the area of a circle with radius 7 units',
                type: 'calculation'
            }
        ]
    }
};

let currentExam = null;
let currentQuestionIndex = 0;
let timeRemaining = 0;
let timerInterval = null;
let answers = {};
let isFullscreen = false;
let warningCount = 0;
const MAX_WARNINGS = 2;

// Fullscreen handling
function enterFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    isFullscreen = true;
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    isFullscreen = false;
}

// Navigation warning
function handleVisibilityChange() {
    if (document.hidden && currentExam) {
        warningCount++;
        if (warningCount >= MAX_WARNINGS) {
            submitExam('Navigation limit exceeded');
        } else {
            alert(`Warning: Leaving the exam window! ${MAX_WARNINGS - warningCount} warnings remaining before automatic submission.`);
        }
    }
}

// Fullscreen change handler
function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && currentExam) {
        warningCount++;
        if (warningCount >= MAX_WARNINGS) {
            submitExam('Fullscreen mode exited');
        } else {
            alert(`Warning: Fullscreen mode required! ${MAX_WARNINGS - warningCount} warnings remaining before automatic submission.`);
            enterFullscreen();
        }
    }
}

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
                window.location.href = 'test.html';
                break;
            case 'profile':
                window.location.href = 'profile.html';
                break;
            case 'results':
                window.location.href = 'results.html';
                break;
        }
    });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Filter exam cards based on search term
    const examCards = document.querySelectorAll('.exam-card');
    examCards.forEach(card => {
        const examTitle = card.querySelector('h3').textContent.toLowerCase();
        if (examTitle.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Start exam
startExamButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.disabled) return;
        
        const examType = button.dataset.exam;
        enterFullscreen();
        startExam(examType);
    });
});

function startExam(examType) {
    currentExam = examData[examType];
    currentQuestionIndex = 0;
    timeRemaining = currentExam.duration;
    answers = {};
    warningCount = 0;

    // Hide exam list and show exam interface
    examListView.classList.add('hidden');
    examInterface.classList.remove('hidden');

    // Set exam title
    document.getElementById('examTitle').textContent = currentExam.title;

    // Start timer
    startTimer();

    // Show first question
    showQuestion(0);

    // Initialize question indicators
    initializeQuestionIndicators();

    // Add visibility and fullscreen event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showQuestion(index) {
    const question = currentExam.questions[index];
    questionContainer.innerHTML = `
        <h3>Question ${index + 1}</h3>
        <p>${question.text}</p>
    `;

    // Load previous answer if it exists
    answerInput.value = answers[index] || '';

    // Update navigation buttons
    prevButton.disabled = index === 0;
    nextButton.disabled = index === currentExam.questions.length - 1;

    // Update question indicators
    updateQuestionIndicators();
}

function initializeQuestionIndicators() {
    const indicatorsContainer = document.querySelector('.question-indicators');
    indicatorsContainer.innerHTML = currentExam.questions.map((_, index) => `
        <div class="question-indicator${index === 0 ? ' active' : ''}" data-index="${index}">
            ${index + 1}
        </div>
    `).join('');

    // Add click handlers to indicators
    document.querySelectorAll('.question-indicator').forEach(indicator => {
        indicator.addEventListener('click', () => {
            saveCurrentAnswer();
            currentQuestionIndex = parseInt(indicator.dataset.index);
            showQuestion(currentQuestionIndex);
        });
    });
}

function updateQuestionIndicators() {
    document.querySelectorAll('.question-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentQuestionIndex);
        indicator.classList.toggle('answered', answers[index] !== undefined);
    });
}

function saveCurrentAnswer() {
    answers[currentQuestionIndex] = answerInput.value;
}

// Navigation buttons
prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        saveCurrentAnswer();
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < currentExam.questions.length - 1) {
        saveCurrentAnswer();
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
});

// Submit exam
submitButton.addEventListener('click', () => {
    confirmationModal.classList.add('active');
});

confirmSubmit.addEventListener('click', () => {
    submitExam();
});

cancelSubmit.addEventListener('click', () => {
    confirmationModal.classList.remove('active');
});

function submitExam(reason = 'Manual submission') {
    clearInterval(timerInterval);
    
    // Remove event listeners
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    
    // Exit fullscreen
    exitFullscreen();
    
    // Calculate score
    let score = 0;
    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
        if (currentExam.questions[questionIndex].correctAnswer === answerIndex) {
            score++;
        }
    });

    const percentage = Math.round((score / currentExam.questions.length) * 100);

    // Store submission in localStorage
    const submissions = JSON.parse(localStorage.getItem('examSubmissions') || '[]');
    const submission = {
        examTitle: currentExam.title,
        score: percentage,
        date: new Date().toISOString(),
        status: 'pending',
        submissionReason: reason
    };
    submissions.push(submission);
    localStorage.setItem('examSubmissions', JSON.stringify(submissions));
    
    // Return to exam list
    confirmationModal.classList.remove('active');
    examInterface.classList.add('hidden');
    examListView.classList.remove('hidden');

    // Show submission message
    alert(`Exam submitted! Your answers have been recorded and are pending review.`);
}

// Tool buttons
toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tool = button.id;
        switch(tool) {
            case 'calculator':
                // Implement calculator functionality
                console.log('Opening calculator...');
                break;
            case 'notepad':
                // Implement notepad functionality
                console.log('Opening notepad...');
                break;
            case 'formula':
                // Implement formula sheet functionality
                console.log('Opening formula sheet...');
                break;
        }
    });
});

// Initialize exam interface
document.addEventListener('DOMContentLoaded', () => {
    // Load user data
    const userData = JSON.parse(sessionStorage.getItem('currentStudent'));
    if (userData) {
        document.querySelector('.user-name').textContent = userData.name;
    } else {
        window.location.href = '../index.html';
    }
});