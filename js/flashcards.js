/**
 * Flashcard Application
 * Features: mode toggle (term↔definition), "I know this" button, SM-2 spaced repetition
 */

class FlashcardApp {
    constructor() {
        this.allCards = [];
        this.studyCards = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.mode = 'term-first'; // 'term-first' or 'def-first'
        this.selectedLesson = 'all';
        this.sessionReviewed = 0;
        this.sessionKnown = 0;

        this.lessonNames = {
            0: 'שיעור 0',
            1: 'שיעור 1',
            2: 'שיעור 2',
            3: 'שיעור 3',
            4: 'שיעור 4',
            5: 'שיעור 5',
            6: 'שיעור 6',
            7: 'שיעור 7',
            8: 'שיעור 8'
        };

        this.init();
    }

    async init() {
        await this.loadCards();
        this.renderLessonFilters();
        this.updateStats();
        this.initEventListeners();
    }

    async loadCards() {
        try {
            const response = await fetch('data/flashcards.json');
            this.allCards = await response.json();
            // Add unique IDs to cards if not present
            this.allCards = this.allCards.map((card, index) => ({
                ...card,
                id: card.id || `card-${index}`
            }));
        } catch (e) {
            console.error('Failed to load flashcards:', e);
            this.allCards = [];
        }
    }

    getKnownCards() {
        return JSON.parse(localStorage.getItem('flashcard-known') || '[]');
    }

    setKnownCards(cards) {
        localStorage.setItem('flashcard-known', JSON.stringify(cards));
    }

    getCardStats() {
        return JSON.parse(localStorage.getItem('flashcard-stats') || '{}');
    }

    setCardStats(stats) {
        localStorage.setItem('flashcard-stats', JSON.stringify(stats));
    }

    renderLessonFilters() {
        const container = document.getElementById('lesson-filter');
        const lessons = [...new Set(this.allCards.map(c => c.lesson))].sort((a, b) => a - b);

        lessons.forEach(lesson => {
            const count = this.allCards.filter(c => c.lesson === lesson).length;
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.lesson = lesson;
            btn.textContent = `${this.lessonNames[lesson] || `שיעור ${lesson}`} (${count})`;
            btn.addEventListener('click', () => this.selectLesson(lesson));
            container.appendChild(btn);
        });
    }

    selectLesson(lesson) {
        this.selectedLesson = lesson;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            const btnLesson = btn.dataset.lesson;
            btn.classList.toggle('active',
                (lesson === 'all' && btnLesson === 'all') ||
                (btnLesson == lesson)
            );
        });

        // If 'all' is selected, deselect specific lessons
        if (lesson === 'all') {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('.filter-btn[data-lesson="all"]').classList.add('active');
        } else {
            document.querySelector('.filter-btn[data-lesson="all"]').classList.remove('active');
        }

        this.updateStats();
    }

    updateStats() {
        const knownCards = this.getKnownCards();
        let filteredCards = this.allCards;

        if (this.selectedLesson !== 'all') {
            filteredCards = this.allCards.filter(c => c.lesson == this.selectedLesson);
        }

        const total = filteredCards.length;
        const known = filteredCards.filter(c => knownCards.includes(c.id)).length;
        const remaining = total - known;

        document.getElementById('total-cards').textContent = total;
        document.getElementById('known-cards').textContent = known;
        document.getElementById('remaining-cards').textContent = remaining;

        // Disable start button if no cards to study
        const startBtn = document.getElementById('start-btn');
        startBtn.disabled = remaining === 0;
        if (remaining === 0) {
            startBtn.textContent = 'אין כרטיסיות ללמידה';
        } else {
            startBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                התחל ללמוד (${remaining} כרטיסיות)
            `;
        }
    }

    startStudy() {
        const knownCards = this.getKnownCards();
        let filteredCards = this.allCards;

        if (this.selectedLesson !== 'all') {
            filteredCards = this.allCards.filter(c => c.lesson == this.selectedLesson);
        }

        // Exclude known cards
        this.studyCards = filteredCards.filter(c => !knownCards.includes(c.id));

        if (this.studyCards.length === 0) {
            alert('אין כרטיסיות ללמידה! נסה לאפס את הכרטיסיות שאתה יודע/ת.');
            return;
        }

        // Shuffle cards
        this.studyCards = this.shuffleArray([...this.studyCards]);
        this.currentIndex = 0;
        this.isFlipped = false;
        this.sessionReviewed = 0;
        this.sessionKnown = 0;

        this.showView('study-view');
        this.showCard();
    }

    showCard() {
        if (this.currentIndex >= this.studyCards.length) {
            this.showComplete();
            return;
        }

        const card = this.studyCards[this.currentIndex];
        this.isFlipped = false;

        // Update progress
        const progress = (this.currentIndex / this.studyCards.length) * 100;
        document.getElementById('study-progress-fill').style.width = `${progress}%`;
        document.getElementById('card-counter').textContent =
            `${this.currentIndex + 1} / ${this.studyCards.length}`;

        // Set card content based on mode
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');

        const frontContent = document.getElementById('front-content');
        const backContent = document.getElementById('back-content');

        if (this.mode === 'term-first') {
            frontContent.textContent = card.front;
            backContent.textContent = card.back;
        } else {
            frontContent.textContent = card.back;
            backContent.textContent = card.front;
        }

        // Video link
        const videoContainer = document.getElementById('video-link-container');
        if (card.videoId && card.timestamp) {
            const seconds = this.parseTimestamp(card.timestamp);
            videoContainer.innerHTML = `
                <a href="https://www.youtube.com/watch?v=${card.videoId}&t=${seconds}s"
                   target="_blank" class="video-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    צפה בסרטון (${card.timestamp})
                </a>
            `;
        } else {
            videoContainer.innerHTML = '';
        }

        // Hide rating controls until flipped
        document.getElementById('rating-controls').classList.add('hidden');
    }

    flipCard() {
        const flashcard = document.getElementById('flashcard');
        this.isFlipped = !this.isFlipped;
        flashcard.classList.toggle('flipped', this.isFlipped);

        if (this.isFlipped) {
            document.getElementById('rating-controls').classList.remove('hidden');
        }
    }

    rateCard(rating) {
        const card = this.studyCards[this.currentIndex];
        const stats = this.getCardStats();

        // SM-2 algorithm
        if (!stats[card.id]) {
            stats[card.id] = { ease: 2.5, interval: 1, repetitions: 0 };
        }

        const cardStat = stats[card.id];

        if (rating < 2) {
            // Reset on failure
            cardStat.repetitions = 0;
            cardStat.interval = 1;
        } else {
            if (cardStat.repetitions === 0) {
                cardStat.interval = 1;
            } else if (cardStat.repetitions === 1) {
                cardStat.interval = 6;
            } else {
                cardStat.interval = Math.round(cardStat.interval * cardStat.ease);
            }
            cardStat.repetitions++;
        }

        // Update ease factor
        cardStat.ease = cardStat.ease + (0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02));
        cardStat.ease = Math.max(1.3, cardStat.ease);

        cardStat.due = Date.now() + cardStat.interval * 24 * 60 * 60 * 1000;

        this.setCardStats(stats);
        this.sessionReviewed++;
        this.nextCard();
    }

    markAsKnown() {
        const card = this.studyCards[this.currentIndex];
        const knownCards = this.getKnownCards();

        if (!knownCards.includes(card.id)) {
            knownCards.push(card.id);
            this.setKnownCards(knownCards);
            this.sessionKnown++;
        }

        this.sessionReviewed++;
        this.nextCard();
    }

    nextCard() {
        this.currentIndex++;
        this.showCard();
    }

    showComplete() {
        document.getElementById('session-reviewed').textContent = this.sessionReviewed;
        document.getElementById('session-known').textContent = this.sessionKnown;
        this.showView('complete-view');
    }

    resetKnown() {
        if (confirm('האם אתה בטוח שברצונך לאפס את כל הכרטיסיות שסימנת כ"יודע/ת"?')) {
            this.setKnownCards([]);
            this.updateStats();
            alert('הכרטיסיות אופסו בהצלחה');
        }
    }

    setMode(mode) {
        this.mode = mode;
        document.getElementById('mode-term-first').classList.toggle('active', mode === 'term-first');
        document.getElementById('mode-def-first').classList.toggle('active', mode === 'def-first');
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
        // Mode buttons
        document.getElementById('mode-term-first').addEventListener('click', () => this.setMode('term-first'));
        document.getElementById('mode-def-first').addEventListener('click', () => this.setMode('def-first'));

        // All lessons button
        document.querySelector('.filter-btn[data-lesson="all"]').addEventListener('click', () => this.selectLesson('all'));

        // Start button
        document.getElementById('start-btn').addEventListener('click', () => this.startStudy());

        // Reset known button
        document.getElementById('reset-known-btn').addEventListener('click', () => this.resetKnown());

        // Flashcard flip
        document.getElementById('flashcard').addEventListener('click', () => this.flipCard());

        // Rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rating = parseInt(e.currentTarget.dataset.rating);
                this.rateCard(rating);
            });
        });

        // Know this button
        document.getElementById('know-this-btn').addEventListener('click', () => this.markAsKnown());

        // Back buttons
        document.getElementById('back-to-settings').addEventListener('click', () => {
            this.updateStats();
            this.showView('settings-view');
        });

        document.getElementById('back-to-settings-complete').addEventListener('click', () => {
            this.updateStats();
            this.showView('settings-view');
        });

        // Study again button
        document.getElementById('study-again-btn').addEventListener('click', () => this.startStudy());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('study-view').classList.contains('active')) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    this.flipCard();
                } else if (e.code === 'Digit1' && this.isFlipped) {
                    this.rateCard(0);
                } else if (e.code === 'Digit2' && this.isFlipped) {
                    this.rateCard(1);
                } else if (e.code === 'Digit3' && this.isFlipped) {
                    this.rateCard(2);
                } else if (e.code === 'Digit4' && this.isFlipped) {
                    this.rateCard(3);
                } else if (e.code === 'KeyK' && this.isFlipped) {
                    this.markAsKnown();
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});
