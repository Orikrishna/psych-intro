/**
 * Full Course Quiz Application
 * Handles lesson selection, quiz sessions, scoring, and retry functionality
 * for the 24 frontal lessons (שיעורים פרונטליים)
 */

class FullQuizApp {
    constructor() {
        this.questions = {};
        this.currentLesson = null;
        this.currentQuestions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.answered = false;
        this.isRetryMode = false;

        // Storage key (separate from online lessons quiz)
        this.storageKey = 'full-quiz-stats';

        // Capybara sticker configuration
        this.capybaraStickers = [
            'assets/stickers/capybara1.gif',
            'assets/stickers/capybara2.gif',
            'assets/stickers/capybara3.gif',
            'assets/stickers/capybara4.gif',
            'assets/stickers/capybara5.gif'
        ];
        this.stickerElement = null;

        // Full course lesson metadata (matching full-lessons.js)
        this.lessons = [
            { id: 'FC01', name: 'מבוא לפסיכולוגיה', emoji: '🎓', color: '#2d7d46' },
            { id: 'FC02', name: 'גישות בפסיכולוגיה והמוח', emoji: '🧠', color: '#1ba8a6' },
            { id: 'FC03', name: 'המוח, הגישות וקשב', emoji: '⚡', color: '#8b5cf6' },
            { id: 'FC04', name: 'קשב – מגבלות ועוררות', emoji: '🎯', color: '#f6d045' },
            { id: 'FC05', name: 'קשב ותפיסה', emoji: '👁️', color: '#ff8a7a' },
            { id: 'FC06', name: 'תפיסת עומק וקביעות', emoji: '🔭', color: '#47c163' },
            { id: 'FC07', name: 'תפיסה – זיהוי והקשר', emoji: '🧩', color: '#60a5fa' },
            { id: 'FC08', name: 'זיכרון – מודל שלושת המאגרים', emoji: '🗃️', color: '#b8a9e8' },
            { id: 'FC09', name: 'Chunking וזיכרון עבודה', emoji: '📦', color: '#f472b6' },
            { id: 'FC10', name: 'זיכרון עבודה וזיכרון לטווח ארוך', emoji: '💾', color: '#2d7d46' },
            { id: 'FC11', name: 'סכמות, רשת סמנטית והיזכרות', emoji: '🕸️', color: '#1ba8a6' },
            { id: 'FC12', name: 'זיכרון מדומה ושבעת החטאים', emoji: '🎭', color: '#8b5cf6' },
            { id: 'FC13', name: 'למידה – מבוא והתניה קלאסית', emoji: '🐕', color: '#f6d045' },
            { id: 'FC14', name: 'התניה קלאסית ואופרנטית', emoji: '🎰', color: '#ff8a7a' },
            { id: 'FC15', name: 'למידה קוגניטיבית וחברתית', emoji: '🪞', color: '#47c163' },
            { id: 'FC16', name: 'תיאוריות אישיות – פרויד א׳', emoji: '🛋️', color: '#60a5fa' },
            { id: 'FC17', name: 'פרויד – מודל סטרוקטוראלי', emoji: '🎭', color: '#b8a9e8' },
            { id: 'FC18', name: 'מנגנוני הגנה וגישות נוספות', emoji: '🛡️', color: '#f472b6' },
            { id: 'FC19', name: 'פסיכופתולוגיה – מבוא', emoji: '📋', color: '#2d7d46' },
            { id: 'FC20', name: 'OCD וחרדות', emoji: '🔄', color: '#1ba8a6' },
            { id: 'FC21', name: 'דיכאון והפרעה דו-קוטבית', emoji: '🌧️', color: '#8b5cf6' },
            { id: 'FC22', name: 'הסברים לדיכאון וסכיזופרניה', emoji: '🔬', color: '#f6d045' },
            { id: 'FC23', name: 'שיטות טיפול – פסיכודינמי', emoji: '💬', color: '#ff8a7a' },
            { id: 'FC24', name: 'טיפול קוגניטיבי-התנהגותי', emoji: '💡', color: '#47c163' }
        ];

        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.loadStats();
        this.renderLessonGrid();
        this.initEventListeners();
        this.createStickerElement();
    }

    createStickerElement() {
        this.stickerElement = document.createElement('div');
        this.stickerElement.className = 'capybara-sticker';
        this.stickerElement.innerHTML = '<img src="" alt="Dancing Capybara">';
        document.body.appendChild(this.stickerElement);
    }

    showCapybaraCelebration() {
        const randomSticker = this.capybaraStickers[Math.floor(Math.random() * this.capybaraStickers.length)];
        const img = this.stickerElement.querySelector('img');
        img.src = randomSticker;

        this.stickerElement.classList.remove('animate-in', 'animate-out', 'dancing');

        requestAnimationFrame(() => {
            this.stickerElement.classList.add('animate-in');
        });

        setTimeout(() => {
            this.stickerElement.classList.remove('animate-in');
            this.stickerElement.classList.add('dancing');
            this.stickerElement.style.left = '20px';
            this.stickerElement.style.opacity = '1';
        }, 500);

        setTimeout(() => {
            this.stickerElement.classList.remove('dancing');
            this.stickerElement.classList.add('animate-out');
        }, 3000);

        setTimeout(() => {
            this.stickerElement.classList.remove('animate-out');
            this.stickerElement.style.left = '-200px';
            this.stickerElement.style.opacity = '0';
        }, 3500);
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/full-course-questions.json');
            this.questions = await response.json();
        } catch (e) {
            console.error('Failed to load questions:', e);
            this.questions = {};
        }
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        const sessions = stats.sessions || [];

        document.getElementById('total-sessions').textContent = sessions.length;
        document.getElementById('total-correct').textContent = stats.totalCorrect || 0;

        if (sessions.length > 0) {
            const avgScore = sessions.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / sessions.length;
            document.getElementById('avg-score').textContent = Math.round(avgScore) + '%';
        } else {
            document.getElementById('avg-score').textContent = '0%';
        }
    }

    renderLessonGrid() {
        const grid = document.getElementById('lesson-grid');
        grid.innerHTML = '';

        const stats = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        const completedLessons = stats.completedLessons || {};

        this.lessons.forEach((lesson, index) => {
            const questionCount = this.questions[lesson.id]?.length || 0;
            const bestScore = completedLessons[lesson.id];
            const isCompleted = bestScore !== undefined && bestScore >= 60;
            const hasQuestions = questionCount > 0;

            const card = document.createElement('div');
            card.className = `lesson-card ${isCompleted ? 'completed' : ''} ${!hasQuestions ? 'disabled' : ''}`;
            card.style.setProperty('--card-accent', lesson.color);

            card.innerHTML = `
                <div class="lesson-card-header">
                    <span class="lesson-number">${lesson.emoji}</span>
                    ${isCompleted ? '<span class="completion-badge">✓</span>' : ''}
                </div>
                <h3 class="lesson-card-title">שיעור ${index + 1}: ${lesson.name}</h3>
                <div class="lesson-card-meta">
                    <span class="question-count">${hasQuestions ? `${questionCount} שאלות` : 'בקרוב'}</span>
                    ${bestScore !== undefined ? `<span class="best-score">שיא: ${Math.round(bestScore)}%</span>` : ''}
                </div>
            `;

            if (hasQuestions) {
                card.addEventListener('click', () => this.startQuiz(lesson.id));
            }

            grid.appendChild(card);
        });
    }

    startQuiz(lessonId) {
        this.currentLesson = lessonId;
        this.currentQuestions = this.shuffleArray([...this.questions[lessonId]]);
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.isRetryMode = false;

        const lesson = this.lessons.find(l => l.id === lessonId);
        const lessonIndex = this.lessons.findIndex(l => l.id === lessonId);

        this.showView('quiz-view');
        document.getElementById('lesson-title').textContent = `שיעור ${lessonIndex + 1}: ${lesson.name}`;
        this.showQuestion();
    }

    startRetryQuiz() {
        if (this.wrongAnswers.length === 0) return;

        this.currentQuestions = this.shuffleArray([...this.wrongAnswers]);
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.isRetryMode = true;

        this.showView('quiz-view');
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

        // Show answers
        const container = document.getElementById('answers-container');
        container.innerHTML = '';

        // Shuffle answer indices for display
        const answerIndices = question.answers.map((_, i) => i);
        const shuffledIndices = this.shuffleArray([...answerIndices]);

        shuffledIndices.forEach(originalIndex => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = question.answers[originalIndex];
            btn.dataset.index = originalIndex;
            btn.addEventListener('click', () => this.selectAnswer(originalIndex));
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
            this.showCapybaraCelebration();
        } else {
            this.wrongAnswers.push(question);
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
        feedbackMessage.textContent = isCorrect ? 'תשובה נכונה! 🎉' : 'תשובה שגויה';

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
        if (this.wrongAnswers.length > 0 && !this.isRetryMode) {
            retryWrongBtn.classList.remove('hidden');
            retryWrongBtn.textContent = `תרגל ${this.wrongAnswers.length} שאלות שגויות`;
        } else {
            retryWrongBtn.classList.add('hidden');
        }
    }

    saveStats(percentage, total) {
        const stats = JSON.parse(localStorage.getItem(this.storageKey) || '{}');

        if (!stats.sessions) stats.sessions = [];
        if (!stats.completedLessons) stats.completedLessons = {};
        if (!stats.totalCorrect) stats.totalCorrect = 0;
        if (!stats.totalAttempted) stats.totalAttempted = 0;

        // Add session
        stats.sessions.push({
            lesson: this.currentLesson,
            score: this.score,
            total: total,
            date: new Date().toISOString(),
            isRetry: this.isRetryMode
        });

        // Update completed lessons (best score)
        if (!this.isRetryMode) {
            const currentBest = stats.completedLessons[this.currentLesson] || 0;
            stats.completedLessons[this.currentLesson] = Math.max(currentBest, percentage);
        }

        // Update totals
        stats.totalCorrect += this.score;
        stats.totalAttempted += total;

        localStorage.setItem(this.storageKey, JSON.stringify(stats));
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
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('retry-wrong-btn').addEventListener('click', () => this.startRetryQuiz());
        document.getElementById('retry-all-btn').addEventListener('click', () => this.startQuiz(this.currentLesson));
        document.getElementById('back-to-lessons-btn').addEventListener('click', () => {
            this.loadStats();
            this.renderLessonGrid();
            this.showView('lesson-select-view');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FullQuizApp();
});
