/**
 * Online Lessons Module
 * Displays all online video lessons with modal player
 */

class OnlineLessonsApp {
    constructor() {
        // Lesson metadata with video IDs and topics
        this.lessons = [
            {
                id: 'L00',
                name: 'מבוא לקורס',
                emoji: '🎬',
                subtitle: 'הגדרת פסיכולוגיה, מהו מדע, פרויד והשפעתו',
                videoId: 't8XAmfsrUDs',
                color: '#6366f1'
            },
            {
                id: 'L01',
                name: 'מהי פסיכולוגיה?',
                emoji: '🔬',
                subtitle: 'השיטה המדעית, מדע בסיסי ויישומי, קורלציה וסיבתיות',
                videoId: 'jclWXJK4Tjk',
                color: '#22c55e'
            },
            {
                id: 'L02',
                name: 'ביהביוריזם ולמידה',
                emoji: '🐕',
                subtitle: 'התניה קלאסית, פבלוב, ווטסון, התניה אופרנטית, סקינר',
                videoId: 'ZnT65pkA1sY',
                color: '#06b6d4'
            },
            {
                id: 'L03',
                name: 'המהפכה הקוגניטיבית',
                emoji: '🧠',
                subtitle: 'מגבלות הביהביוריזם, עיבוד מידע, זיכרון וקשב',
                videoId: 'eBsInQFh4NY',
                color: '#8b5cf6'
            },
            {
                id: 'L04',
                name: 'המוח',
                emoji: '⚡',
                subtitle: 'נוירונים, מבנה המוח, המיספרות, פלסטיות',
                videoId: 'siIggEPg5E4',
                color: '#eab308'
            },
            {
                id: 'L05',
                name: 'התפתחות',
                emoji: '👶',
                subtitle: 'פיאז\'ה, התפתחות קוגניטיבית, תיאוריית ההתקשרות',
                videoId: 'MVgBJZxabLU',
                color: '#ef4444'
            },
            {
                id: 'L06',
                name: 'פסיכולוגיה חברתית',
                emoji: '👥',
                subtitle: 'קונפורמיות, ציות לסמכות, ניסוי מילגרם, דיסוננס קוגניטיבי',
                videoId: 'vNjPEFO165c',
                color: '#10b981'
            },
            {
                id: 'L07',
                name: 'אינטליגנציה ואישיות',
                emoji: '📊',
                subtitle: 'מדידת אינטליגנציה, IQ, תורשה וסביבה, חמשת הגדולים',
                videoId: 'D7dZexztE-8',
                color: '#3b82f6'
            },
            {
                id: 'L08',
                name: 'פסיכופתולוגיה וטיפול',
                emoji: '💊',
                subtitle: 'הפרעות נפשיות, DSM, חרדה, דיכאון, שיטות טיפול',
                videoId: 'OBxTVnGdYhQ',
                color: '#a855f7'
            }
        ];

        this.modal = null;
        this.iframe = null;
        this.init();
    }

    init() {
        this.renderLessonsList();
        this.initModal();
    }

    renderLessonsList() {
        const list = document.getElementById('lessons-list');
        if (!list) return;

        this.lessons.forEach((lesson, index) => {
            const card = document.createElement('div');
            card.className = 'video-lesson-card';
            card.style.setProperty('--card-color', lesson.color);

            const thumbnailUrl = `https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`;

            card.innerHTML = `
                <div class="video-lesson-card__thumbnail">
                    <img src="${thumbnailUrl}" alt="${lesson.name}">
                    <div class="video-lesson-card__play">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                            <polygon points="5,3 19,12 5,21"/>
                        </svg>
                    </div>
                </div>
                <div class="video-lesson-card__content">
                    <div class="video-lesson-card__header">
                        <span class="video-lesson-card__emoji">${lesson.emoji}</span>
                        <h3 class="video-lesson-card__title">שיעור ${index}: ${lesson.name}</h3>
                    </div>
                    <p class="video-lesson-card__subtitle">${lesson.subtitle}</p>
                </div>
            `;

            card.addEventListener('click', () => this.openModal(lesson, index));
            list.appendChild(card);
        });
    }

    initModal() {
        this.modal = document.getElementById('video-modal');
        this.iframe = document.getElementById('video-iframe');
        const backdrop = document.getElementById('modal-backdrop');
        const closeBtn = document.getElementById('modal-close');

        backdrop.addEventListener('click', () => this.closeModal());
        closeBtn.addEventListener('click', () => this.closeModal());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(lesson, index) {
        const title = document.getElementById('modal-title');
        title.textContent = `שיעור ${index}: ${lesson.name}`;

        // Set iframe src with autoplay and playsinline for iOS
        this.iframe.src = `https://www.youtube.com/embed/${lesson.videoId}?autoplay=1&rel=0&playsinline=1`;

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.iframe.src = ''; // Stop video
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OnlineLessonsApp();
});
