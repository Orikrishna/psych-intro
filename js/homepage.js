/**
 * Homepage Controller
 * Loads and displays progress statistics from localStorage
 */

class Homepage {
    constructor() {
        this.loadStats();
        this.initEventListeners();
        this.loadCounts();
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
