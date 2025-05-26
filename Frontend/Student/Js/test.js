// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');
const startTestButtons = document.querySelectorAll('.start-test-btn');
const testListView = document.getElementById('testListView');
const testInterface = document.getElementById('testInterface');
const timerDisplay = document.getElementById('timerDisplay');
const questionContainer = document.getElementById('questionContainer');
const optionsContainer = document.getElementById('optionsContainer');
const prevButton = document.getElementById('prevQuestion');
const nextButton = document.getElementById('nextQuestion');
const submitButton = document.getElementById('submitTest');
const confirmationModal = document.getElementById('confirmationModal');
const confirmSubmit = document.getElementById('confirmSubmit');
const cancelSubmit = document.getElementById('cancelSubmit');
const toolButtons = document.querySelectorAll('.tool-btn');

// Sample test data
const testData = {
    'math-quiz': {
        title: 'Mathematics Quiz',
        duration: 1800, // 30 minutes in seconds
        questions: [
            {
                id: 1,
                text: 'What is the value of x in the equation 2x + 5 = 13?',
                options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
                correctAnswer: 1
            },
            {
                id: 2,
                text: 'What is the area of a circle with radius 5 units?',
                options: ['25π', '10π', '15π', '20π'],
                correctAnswer: 0
            },
            {
                id: 3,
                text: 'Simplify: (3x + 2)(x - 4)',
                options: ['3x² - 10x - 8', '3x² - 12x + 8', '3x² - 10x + 8', '3x² - 12x - 8'],
                correctAnswer: 2
            }
        ]
    }
};

let currentTest = null;
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
    if (document.hidden && currentTest) {
        warningCount++;
        if (warningCount >= MAX_WARNINGS) {
            submitTest('Navigation limit exceeded');
        } else {
            alert(`Warning: Leaving the test window! ${MAX_WARNINGS - warningCount} warnings remaining before automatic submission.`);
        }
    }
}

// Fullscreen change handler
function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && currentTest) {
        warningCount++;
        if (warningCount >= MAX_WARNINGS) {
            submitTest('Fullscreen mode exited');
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
            // Handle logout
            window.location.href = '../index.html';
            return;
        }
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Handle navigation
        const page = item.dataset.page;
        if (page === 'dashboard') {
            window.location.href = 'dash.html';
        }
    });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Filter test cards based on search term
    const testCards = document.querySelectorAll('.test-card');
    testCards.forEach(card => {
        const testTitle = card.querySelector('h3').textContent.toLowerCase();
        if (testTitle.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Start test
startTestButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.disabled) return;
        
        const testType = button.dataset.test;
        enterFullscreen();
        startTest(testType);
    });
});

function startTest(testType) {
    currentTest = testData[testType];
    currentQuestionIndex = 0;
    timeRemaining = currentTest.duration;
    answers = {};
    warningCount = 0;

    // Hide test list and show test interface
    testListView.classList.add('hidden');
    testInterface.classList.remove('hidden');

    // Set test title
    document.getElementById('testTitle').textContent = currentTest.title;

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
            submitTest();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showQuestion(index) {
    const question = currentTest.questions[index];
    questionContainer.innerHTML = `
        <h3>Question ${index + 1}</h3>
        <p class="mt-4 text-lg">${question.text}</p>
    `;

    // Create options
    optionsContainer.innerHTML = question.options.map((option, i) => `
        <div class="option-item ${answers[index] === i ? 'selected' : ''}" data-index="${i}">
            ${option}
        </div>
    `).join('');

    // Add click handlers to options
    document.querySelectorAll('.option-item').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            answers[index] = parseInt(option.dataset.index);
            updateQuestionIndicators();
        });
    });

    // Update navigation buttons
    prevButton.disabled = index === 0;
    nextButton.disabled = index === currentTest.questions.length - 1;

    // Update question indicators
    updateQuestionIndicators();
}

function initializeQuestionIndicators() {
    const indicatorsContainer = document.querySelector('.question-indicators');
    indicatorsContainer.innerHTML = currentTest.questions.map((_, index) => `
        <div class="question-indicator${index === 0 ? ' active' : ''}" data-index="${index}">
            ${index + 1}
        </div>
    `).join('');

    // Add click handlers to indicators
    document.querySelectorAll('.question-indicator').forEach(indicator => {
        indicator.addEventListener('click', () => {
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

// Navigation buttons
prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
});

// Submit test
submitButton.addEventListener('click', () => {
    confirmationModal.classList.add('active');
});

confirmSubmit.addEventListener('click', () => {
    submitTest();
});

cancelSubmit.addEventListener('click', () => {
    confirmationModal.classList.remove('active');
});

function submitTest(reason = 'Manual submission') {
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
        if (currentTest.questions[questionIndex].correctAnswer === answerIndex) {
            score++;
        }
    });

    const percentage = Math.round((score / currentTest.questions.length) * 100);

    // Store submission in localStorage
    const submissions = JSON.parse(localStorage.getItem('testSubmissions') || '[]');
    const submission = {
        testTitle: currentTest.title,
        score: percentage,
        date: new Date().toISOString(),
        status: 'pending',
        submissionReason: reason
    };
    submissions.push(submission);
    localStorage.setItem('testSubmissions', JSON.stringify(submissions));
    
    // Return to test list
    confirmationModal.classList.remove('active');
    testInterface.classList.add('hidden');
    testListView.classList.remove('hidden');

    // Show submission message
    alert(`Test submitted! Your answers have been recorded and are pending review.`);
}

// Tool buttons
toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tool = button.id;
        switch(tool) {
            case 'calculator':
                window.open('calculator.html', 'Calculator', 'width=300,height=400');
                break;
            case 'notepad':
                window.open('notepad.html', 'Notepad', 'width=400,height=500');
                break;
        }
    });
});

// Initialize test interface
document.addEventListener('DOMContentLoaded', () => {
    // Load user data
    const userData = JSON.parse(sessionStorage.getItem('currentStudent'));
    if (userData) {
        document.querySelector('.user-name').textContent = userData.name;
    } else {
        window.location.href = '../index.html';
    }
});