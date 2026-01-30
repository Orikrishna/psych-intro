/**
 * Sample Test Application
 * Handles sample test mode selection, quiz sessions, scoring, and wrong answer tracking
 */

class SampleTestApp {
    constructor() {
        this.allQuestions = [];
        this.currentQuestions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.sessionWrongAnswers = []; // Wrong answers in current session
        this.answered = false;
        this.currentMode = null;

        this.modeConfig = {
            'short': { name: 'קצר', count: 10 },
            'medium': { name: 'בינוני', count: 30 },
            'long': { name: 'ארוך', count: 50 },
            'all': { name: 'כל השאלות', count: null },
            'wrong': { name: 'שאלות שטעיתי', count: null }
        };

        // Hebrew letters for answer options
        this.hebrewLetters = ['א', 'ב', 'ג', 'ד'];

        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.loadStats();
        this.updateWrongCount();
        this.initEventListeners();
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/sample-tests.json');
            const data = await response.json();

            // Combine questions from both tests
            this.allQuestions = [
                ...data.test1.questions,
                ...data.test2.questions
            ];

            // Update the "all questions" count display
            document.getElementById('all-questions-count').textContent = `${this.allQuestions.length} שאלות`;
        } catch (e) {
            console.error('Failed to load sample tests:', e);
            this.allQuestions = [];
        }
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem('sample-test-stats') || '{}');
        const sessions = stats.sessions || [];

        document.getElementById('total-tests').textContent = sessions.length;
        document.getElementById('total-answered').textContent = stats.totalAnswered || 0;

        if (sessions.length > 0) {
            const avgScore = sessions.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / sessions.length;
            document.getElementById('avg-score').textContent = Math.round(avgScore) + '%';
        } else {
            document.getElementById('avg-score').textContent = '0%';
        }
    }

    // Get wrong questions from localStorage
    getWrongQuestions() {
        const wrongIds = JSON.parse(localStorage.getItem('sample-test-wrong-questions') || '[]');
        return this.allQuestions.filter(q => wrongIds.includes(q.id));
    }

    // Add question to wrong list
    addToWrongQuestions(questionId) {
        const wrongIds = JSON.parse(localStorage.getItem('sample-test-wrong-questions') || '[]');
        if (!wrongIds.includes(questionId)) {
            wrongIds.push(questionId);
            localStorage.setItem('sample-test-wrong-questions', JSON.stringify(wrongIds));
        }
        this.updateWrongCount();
    }

    // Remove question from wrong list (when answered correctly)
    removeFromWrongQuestions(questionId) {
        let wrongIds = JSON.parse(localStorage.getItem('sample-test-wrong-questions') || '[]');
        wrongIds = wrongIds.filter(id => id !== questionId);
        localStorage.setItem('sample-test-wrong-questions', JSON.stringify(wrongIds));
        this.updateWrongCount();
    }

    updateWrongCount() {
        const wrongIds = JSON.parse(localStorage.getItem('sample-test-wrong-questions') || '[]');
        const count = wrongIds.length;
        document.getElementById('wrong-count-display').textContent = count;

        // Disable/enable wrong mode card based on count
        const wrongCard = document.getElementById('wrong-mode-card');
        if (count === 0) {
            wrongCard.classList.add('disabled');
        } else {
            wrongCard.classList.remove('disabled');
        }
    }

    startTest(mode) {
        this.currentMode = mode;
        let questionsToUse = [];

        if (mode === 'wrong') {
            questionsToUse = this.getWrongQuestions();
            if (questionsToUse.length === 0) return;
        } else if (mode === 'all') {
            questionsToUse = [...this.allQuestions];
        } else {
            const count = this.modeConfig[mode].count;
            questionsToUse = this.shuffleArray([...this.allQuestions]).slice(0, count);
        }

        this.currentQuestions = this.shuffleArray(questionsToUse);
        this.currentIndex = 0;
        this.score = 0;
        this.sessionWrongAnswers = [];

        this.showView('quiz-view');
        document.getElementById('test-mode-badge').textContent = `מבחן ${this.modeConfig[mode].name}`;
        this.showQuestion();
    }

    startRetryQuiz() {
        if (this.sessionWrongAnswers.length === 0) return;

        this.currentQuestions = this.shuffleArray([...this.sessionWrongAnswers]);
        this.currentIndex = 0;
        this.score = 0;
        this.sessionWrongAnswers = [];

        this.showView('quiz-view');
        document.getElementById('test-mode-badge').textContent = 'תרגול שאלות שגויות';
        this.showQuestion();
    }

    showQuestion() {
        const question = this.currentQuestions[this.currentIndex];
        this.answered = false;

        // Update progress
        const progress = ((this.currentIndex) / this.currentQuestions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('question-counter').textContent =
            `שאלה ${this.currentIndex + 1} מתוך ${this.currentQuestions.length}`;

        // Show question
        document.getElementById('question-text').textContent = question.question;

        // Show answers - keep original order with Hebrew letters
        const container = document.getElementById('answers-container');
        container.innerHTML = '';

        // Display answers in original order (not shuffled) with Hebrew letters
        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.innerHTML = `<span class="answer-letter">${this.hebrewLetters[index]}.</span> ${answer}`;
            btn.dataset.index = index;
            btn.addEventListener('click', () => this.selectAnswer(index));
            container.appendChild(btn);
        });

        // Hide feedback
        document.getElementById('feedback-section').classList.add('hidden');
    }

    selectAnswer(selectedIndex) {
        if (this.answered) return;
        this.answered = true;

        const question = this.currentQuestions[this.currentIndex];
        const isCorrect = selectedIndex === question.correct;

        // Update score and track wrong answers
        if (isCorrect) {
            this.score++;
            // Remove from persistent wrong list if it was there
            this.removeFromWrongQuestions(question.id);
        } else {
            this.sessionWrongAnswers.push(question);
            // Add to persistent wrong list
            this.addToWrongQuestions(question.id);
        }

        // Highlight answers
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            const btnIndex = parseInt(btn.dataset.index);
            if (btnIndex === question.correct) {
                btn.classList.add('correct');
            } else if (btnIndex === selectedIndex) {
                btn.classList.add('wrong');
            }
            btn.disabled = true;
        });

        // Show feedback
        const feedbackSection = document.getElementById('feedback-section');
        const feedbackMessage = document.getElementById('feedback-message');

        feedbackSection.classList.remove('hidden');
        feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'wrong'}`;
        feedbackMessage.textContent = isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה';

        // Update next button text
        const nextBtn = document.getElementById('next-btn');
        if (this.currentIndex === this.currentQuestions.length - 1) {
            nextBtn.textContent = 'סיום';
        } else {
            nextBtn.innerHTML = `
                שאלה הבאה
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l-7 7 7 7"/>
                </svg>
            `;
        }
    }

    nextQuestion() {
        this.currentIndex++;

        if (this.currentIndex >= this.currentQuestions.length) {
            this.showResults();
        } else {
            this.showQuestion();
        }
    }

    showResults() {
        const total = this.currentQuestions.length;
        const percentage = Math.round((this.score / total) * 100);

        // Save stats
        this.saveStats(percentage, total);

        // Show results view
        this.showView('results-view');

        // Animate score circle
        const scoreRing = document.getElementById('score-ring');
        const circumference = 2 * Math.PI * 45;
        scoreRing.style.strokeDasharray = circumference;
        scoreRing.style.strokeDashoffset = circumference;

        setTimeout(() => {
            const offset = circumference - (percentage / 100) * circumference;
            scoreRing.style.strokeDashoffset = offset;
        }, 100);

        document.getElementById('final-score').textContent = `${percentage}%`;
        document.getElementById('correct-count').textContent = this.score;
        document.getElementById('wrong-count').textContent = total - this.score;

        // Show/hide retry wrong button
        const retryWrongBtn = document.getElementById('retry-wrong-btn');
        if (this.sessionWrongAnswers.length > 0) {
            retryWrongBtn.classList.remove('hidden');
            retryWrongBtn.textContent = `תרגל ${this.sessionWrongAnswers.length} שאלות שגויות`;
        } else {
            retryWrongBtn.classList.add('hidden');
        }
    }

    saveStats(percentage, total) {
        const stats = JSON.parse(localStorage.getItem('sample-test-stats') || '{}');

        if (!stats.sessions) stats.sessions = [];
        if (!stats.totalAnswered) stats.totalAnswered = 0;

        // Add session
        stats.sessions.push({
            mode: this.currentMode,
            score: this.score,
            total: total,
            date: new Date().toISOString()
        });

        // Update totals
        stats.totalAnswered += total;

        localStorage.setItem('sample-test-stats', JSON.stringify(stats));
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    initEventListeners() {
        // Mode selection cards
        document.querySelectorAll('.test-mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                if (card.classList.contains('disabled')) return;
                this.startTest(mode);
            });
        });

        // Quiz controls
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('retry-wrong-btn').addEventListener('click', () => this.startRetryQuiz());
        document.getElementById('retry-all-btn').addEventListener('click', () => this.startTest(this.currentMode));
        document.getElementById('back-to-modes-btn').addEventListener('click', () => {
            this.loadStats();
            this.updateWrongCount();
            this.showView('mode-select-view');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SampleTestApp();
});
