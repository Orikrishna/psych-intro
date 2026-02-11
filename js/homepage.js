/**
 * Homepage Controller
 * Loads and displays progress statistics from localStorage
 */

class Homepage {
    constructor() {
        this.loadStats();
        this.initEventListeners();
        this.loadCounts();
        this.initCountdown();
        this.checkFirstVisit();
    }

    checkFirstVisit() {
        const userName = localStorage.getItem('user-name');
        if (!userName) {
            this.showWelcomeModal();
        }
    }

    showWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        const input = document.getElementById('user-name-input');
        const submitBtn = document.getElementById('welcome-modal-submit');

        if (!modal) return;

        modal.style.display = 'flex';
        setTimeout(() => input.focus(), 100);

        const submitName = () => {
            const name = input.value.trim();
            if (name) {
                localStorage.setItem('user-name', name);
                modal.style.display = 'none';
                // Update analytics with the name if available
                if (window.Analytics && window.Analytics.updateUserName) {
                    window.Analytics.updateUserName(name);
                }
            }
        };

        submitBtn.addEventListener('click', submitName);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitName();
        });
    }

    initCountdown() {
        // Target date: Feb 16, 2026 at 9:00 AM Israel time (UTC+2)
        const targetDate = new Date('2026-02-16T09:00:00+02:00');

        const updateCountdown = () => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                document.getElementById('countdown-days').textContent = '0';
                document.getElementById('countdown-hours').textContent = '0';
                document.getElementById('countdown-minutes').textContent = '0';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            document.getElementById('countdown-days').textContent = days;
            document.getElementById('countdown-hours').textContent = hours;
            document.getElementById('countdown-minutes').textContent = minutes;
        };

        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }

    async loadCounts() {
        try {
            // Load flashcard count
            const flashcardsResponse = await fetch('data/flashcards.json');
            const flashcards = await flashcardsResponse.json();
            document.getElementById('flashcard-count').textContent = flashcards.length;

            // Load question count
            const questionsResponse = await fetch('data/questions.json');
            const questions = await questionsResponse.json();
            let totalQuestions = 0;
            for (const lesson in questions) {
                totalQuestions += questions[lesson].length;
            }
            document.getElementById('quiz-count').textContent = totalQuestions > 0 ? totalQuestions + '+' : '20+';
        } catch (e) {
            // Keep default values if files don't exist yet
            console.log('Data files not loaded yet');
        }
    }

    loadStats() {
        // Load quiz stats
        const quizStats = JSON.parse(localStorage.getItem('quiz-session-stats') || '{}');
        const flashcardStats = JSON.parse(localStorage.getItem('flashcard-stats') || '{}');
        const knownCards = JSON.parse(localStorage.getItem('flashcard-known') || '[]');

        // Calculate lessons completed (lessons with >60% score)
        const completedLessons = quizStats.completedLessons || {};
        const lessonsCompleted = Object.values(completedLessons).filter(score => score >= 60).length;
        document.getElementById('lessons-completed').textContent = lessonsCompleted;

        // Calculate average score
        const sessions = quizStats.sessions || [];
        if (sessions.length > 0) {
            const avgScore = sessions.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / sessions.length;
            document.getElementById('total-score').textContent = Math.round(avgScore) + '%';
        } else {
            document.getElementById('total-score').textContent = '0%';
        }

        // Calculate cards learned (cards with interval > 1 day OR known cards)
        const learnedFromStats = Object.values(flashcardStats).filter(stat => stat.interval > 1).length;
        const totalLearned = learnedFromStats + knownCards.length;
        document.getElementById('cards-learned').textContent = totalLearned;
    }

    initEventListeners() {
        document.getElementById('reset-progress').addEventListener('click', () => {
            if (confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות?')) {
                localStorage.removeItem('quiz-session-stats');
                localStorage.removeItem('flashcard-stats');
                localStorage.removeItem('flashcard-known');
                this.loadStats();
                alert('ההתקדמות אופסה בהצלחה');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Homepage();
});
