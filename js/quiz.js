/**
 * Quiz Application
 * Handles lesson selection, quiz sessions, scoring, and retry functionality
 */

class QuizApp {
    constructor() {
        this.questions = {};
        this.currentLesson = null;
        this.currentQuestions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.answered = false;
        this.isRetryMode = false;

        // Capybara sticker configuration
        this.capybaraStickers = [
            'assets/stickers/capybara1.gif',
            'assets/stickers/capybara2.gif',
            'assets/stickers/capybara3.gif',
            'assets/stickers/capybara4.gif',
            'assets/stickers/capybara5.gif'
        ];
        this.stickerElement = null;

        this.lessonNames = {
            'L00': 'שיעור 0 - מבוא לקורס',
            'L01': 'שיעור 1 - מהי פסיכולוגיה?',
            'L02': 'שיעור 2 - ביהביוריזם',
            'L03': 'שיעור 3 - המהפכה הקוגניטיבית',
            'L04': 'שיעור 4 - המוח',
            'L05': 'שיעור 5 - התפתחות',
            'L06': 'שיעור 6 - פסיכולוגיה חברתית',
            'L07': 'שיעור 7 - אינטליגנציה ואישיות',
            'L08': 'שיעור 8 - פסיכופתולוגיה'
        };

        // Pastel colors for lesson cards (background and stroke pairs)
        this.pastelColors = [
            { bg: '#f0fdf4', stroke: '#22c55e' },   // green
            { bg: '#fce7f3', stroke: '#ec4899' },   // pink
            { bg: '#fef9c3', stroke: '#eab308' },   // yellow
            { bg: '#dbeafe', stroke: '#3b82f6' },   // blue
            { bg: '#f3e8ff', stroke: '#a855f7' },   // purple
            { bg: '#ffedd5', stroke: '#f97316' },   // orange
            { bg: '#cffafe', stroke: '#06b6d4' },   // cyan
            { bg: '#e0e7ff', stroke: '#6366f1' },   // indigo
            { bg: '#d1fae5', stroke: '#10b981' }    // emerald
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
        // Create the sticker container element
        this.stickerElement = document.createElement('div');
        this.stickerElement.className = 'capybara-sticker';
        this.stickerElement.innerHTML = '<img src="" alt="Dancing Capybara">';
        document.body.appendChild(this.stickerElement);
    }

    showCapybaraCelebration() {
        // Pick a random sticker
        const randomSticker = this.capybaraStickers[Math.floor(Math.random() * this.capybaraStickers.length)];
        const img = this.stickerElement.querySelector('img');
        img.src = randomSticker;

        // Reset classes
        this.stickerElement.classList.remove('animate-in', 'animate-out', 'dancing');

        // Trigger fly-in animation
        requestAnimationFrame(() => {
            this.stickerElement.classList.add('animate-in');
        });

        // After fly-in completes, add dancing animation
        setTimeout(() => {
            this.stickerElement.classList.remove('animate-in');
            this.stickerElement.classList.add('dancing');
            this.stickerElement.style.left = '20px';
            this.stickerElement.style.opacity = '1';
        }, 500);

        // After 3 seconds, fly out
        setTimeout(() => {
            this.stickerElement.classList.remove('dancing');
            this.stickerElement.classList.add('animate-out');
        }, 3000);

        // Reset after fly-out
        setTimeout(() => {
            this.stickerElement.classList.remove('animate-out');
            this.stickerElement.style.left = '-200px';
            this.stickerElement.style.opacity = '0';
        }, 3500);
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            this.questions = await response.json();
        } catch (e) {
            console.error('Failed to load questions:', e);
            this.questions = {};
        }
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem('quiz-session-stats') || '{}');
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

        const stats = JSON.parse(localStorage.getItem('quiz-session-stats') || '{}');
        const completedLessons = stats.completedLessons || {};

        // Get available lessons from questions
        const availableLessons = Object.keys(this.questions).sort();

        // If no questions loaded yet, show placeholder lessons
        const lessonsToShow = availableLessons.length > 0 ? availableLessons : Object.keys(this.lessonNames);

        lessonsToShow.forEach((lessonKey, index) => {
            const questionCount = this.questions[lessonKey]?.length || 0;
            const bestScore = completedLessons[lessonKey];
            const isCompleted = bestScore !== undefined && bestScore >= 60;

            // Get a pastel color for this lesson (cycle through colors)
            const colorPair = this.pastelColors[index % this.pastelColors.length];

            const card = document.createElement('div');
            card.className = `lesson-card ${isCompleted ? 'completed' : ''} ${questionCount === 0 ? 'disabled' : ''}`;
            card.style.setProperty('--card-bg-color', colorPair.bg);
            card.style.setProperty('--card-stroke-color', colorPair.stroke);

            // Completion badge positioned at top-right
            card.innerHTML = `
                ${isCompleted ? '<span class="completion-badge">✓</span>' : ''}
                <div class="lesson-card-header">
                    <span class="lesson-number" style="background: ${colorPair.bg}; color: ${colorPair.stroke}; ${isCompleted ? `box-shadow: 0 0 0 3px ${colorPair.stroke};` : ''}">${lessonKey.replace('L', '')}</span>
                </div>
                <h3 class="lesson-card-title">${this.lessonNames[lessonKey] || lessonKey}</h3>
                <div class="lesson-card-meta">
                    <span class="question-count">${questionCount} שאלות</span>
                    ${bestScore !== undefined ? `<span class="best-score">שיא: ${Math.round(bestScore)}%</span>` : ''}
                </div>
            `;

            if (questionCount > 0) {
                card.addEventListener('click', () => this.startQuiz(lessonKey));
            }

            grid.appendChild(card);
        });
    }

    startQuiz(lessonKey) {
        this.currentLesson = lessonKey;
        this.currentQuestions = this.shuffleArray([...this.questions[lessonKey]]);
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.isRetryMode = false;

        this.showView('quiz-view');
        document.getElementById('lesson-title').textContent = this.lessonNames[lessonKey] || lessonKey;
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
            // Show dancing capybara celebration!
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
        const explanation = document.getElementById('explanation');

        feedbackSection.classList.remove('hidden');
        feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'wrong'}`;
        feedbackMessage.textContent = isCorrect ? 'תשובה נכונה! 🎉' : 'תשובה שגויה';

        // Show explanation with video link if available
        if (question.explanation || question.videoId) {
            let explanationHTML = '';
            if (question.explanation) {
                explanationHTML += `<p>${question.explanation}</p>`;
            }
            if (question.videoId && question.timestamp) {
                const seconds = this.parseTimestamp(question.timestamp);
                explanationHTML += `
                    <a href="https://www.youtube.com/watch?v=${question.videoId}&t=${seconds}s"
                       target="_blank" class="video-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        צפה בהסבר בסרטון (${question.timestamp})
                    </a>
                `;
            }
            explanation.innerHTML = explanationHTML;
            explanation.classList.remove('hidden');
        } else {
            explanation.classList.add('hidden');
        }

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
        const stats = JSON.parse(localStorage.getItem('quiz-session-stats') || '{}');

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

        localStorage.setItem('quiz-session-stats', JSON.stringify(stats));

        // Track in Supabase analytics
        if (typeof Analytics !== 'undefined') {
            Analytics.trackQuizComplete('online', this.currentLesson, this.score, total);
        }
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    }

    parseTimestamp(timestamp) {
        const parts = timestamp.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return 0;
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
    new QuizApp();
});
