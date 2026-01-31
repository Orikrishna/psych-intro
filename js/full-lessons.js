/**
 * Full Lessons Module
 * Handles loading and rendering full course markdown summaries (24 lessons)
 */

// Full course lesson metadata
const FULL_LESSONS = [
    {
        id: 'FC01',
        file: 'FullCourse/FullCourse_01.md',
        rawFile: 'FullCourse/FullCourse_01_raw.md',
        name: 'מבוא לפסיכולוגיה',
        subtitle: 'הגדרות, גישות, מדע ההתנהגות',
        emoji: '🎓',
        color: '#2d7d46'
    },
    {
        id: 'FC02',
        file: 'FullCourse/FullCourse_02.md',
        rawFile: 'FullCourse/FullCourse_02_raw.md',
        name: 'גישות בפסיכולוגיה והמוח',
        subtitle: 'ביהביוריזם, קוגניטיביזם, נוירונים',
        emoji: '🧠',
        color: '#1ba8a6'
    },
    {
        id: 'FC03',
        file: 'FullCourse/FullCourse_03.md',
        rawFile: 'FullCourse/FullCourse_03_raw.md',
        name: 'המוח, הגישות וקשב',
        subtitle: 'מבנה המוח, קליטת גירויים, סינון',
        emoji: '⚡',
        color: '#8b5cf6'
    },
    {
        id: 'FC04',
        file: 'FullCourse/FullCourse_04.md',
        rawFile: 'FullCourse/FullCourse_04_raw.md',
        name: 'קשב – מגבלות ועוררות',
        subtitle: 'קשב סלקטיבי, עוררות, חרדת בחינות',
        emoji: '🎯',
        color: '#f6d045'
    },
    {
        id: 'FC05',
        file: 'FullCourse/FullCourse_05.md',
        rawFile: 'FullCourse/FullCourse_05_raw.md',
        name: 'קשב ותפיסה',
        subtitle: 'עיבוד מלמעלה/מלמטה, חוקי גשטלט',
        emoji: '👁️',
        color: '#ff8a7a'
    },
    {
        id: 'FC06',
        file: 'FullCourse/FullCourse_06.md',
        rawFile: 'FullCourse/FullCourse_06_raw.md',
        name: 'תפיסת עומק וקביעות',
        subtitle: 'רמזי עומק, קביעות תפיסתית, אשליות',
        emoji: '🔭',
        color: '#47c163'
    },
    {
        id: 'FC07',
        file: 'FullCourse/FullCourse_07.md',
        rawFile: 'FullCourse/FullCourse_07_raw.md',
        name: 'תפיסה – זיהוי והקשר',
        subtitle: 'זיהוי אובייקטים, השפעת הקונטקסט',
        emoji: '🧩',
        color: '#60a5fa'
    },
    {
        id: 'FC08',
        file: 'FullCourse/FullCourse_08.md',
        rawFile: 'FullCourse/FullCourse_08_raw.md',
        name: 'זיכרון – מודל שלושת המאגרים',
        subtitle: 'זיכרון חושי, לטווח קצר, לטווח ארוך',
        emoji: '🗃️',
        color: '#b8a9e8'
    },
    {
        id: 'FC09',
        file: 'FullCourse/FullCourse_09.md',
        rawFile: 'FullCourse/FullCourse_09_raw.md',
        name: 'Chunking וזיכרון עבודה',
        subtitle: 'ארגון מידע, המודל של באדלי',
        emoji: '📦',
        color: '#f472b6'
    },
    {
        id: 'FC10',
        file: 'FullCourse/FullCourse_10.md',
        rawFile: 'FullCourse/FullCourse_10_raw.md',
        name: 'זיכרון עבודה וזיכרון לטווח ארוך',
        subtitle: 'קידוד, אחסון, שליפה, רמות עיבוד',
        emoji: '💾',
        color: '#2d7d46'
    },
    {
        id: 'FC11',
        file: 'FullCourse/FullCourse_11.md',
        rawFile: 'FullCourse/FullCourse_11_raw.md',
        name: 'סכמות, רשת סמנטית והיזכרות',
        subtitle: 'ארגון ידע, היזכרות, שכחה',
        emoji: '🕸️',
        color: '#1ba8a6'
    },
    {
        id: 'FC12',
        file: 'FullCourse/FullCourse_12.md',
        rawFile: 'FullCourse/FullCourse_12_raw.md',
        name: 'זיכרון מדומה ושבעת החטאים',
        subtitle: 'False Memory, עיוותי זיכרון',
        emoji: '🎭',
        color: '#8b5cf6'
    },
    {
        id: 'FC13',
        file: 'FullCourse/FullCourse_13.md',
        rawFile: 'FullCourse/FullCourse_13_raw.md',
        name: 'למידה – מבוא והתניה קלאסית',
        subtitle: 'פבלוב, גירוי-תגובה, הכחדה',
        emoji: '🐕',
        color: '#f6d045'
    },
    {
        id: 'FC14',
        file: 'FullCourse/FullCourse_14.md',
        rawFile: 'FullCourse/FullCourse_14_raw.md',
        name: 'התניה קלאסית ואופרנטית',
        subtitle: 'Watson, Skinner, חיזוקים',
        emoji: '🎰',
        color: '#ff8a7a'
    },
    {
        id: 'FC15',
        file: 'FullCourse/FullCourse_15.md',
        rawFile: 'FullCourse/FullCourse_15_raw.md',
        name: 'למידה קוגניטיבית וחברתית',
        subtitle: 'תובנה, העברה, Bandura, חיקוי',
        emoji: '🪞',
        color: '#47c163'
    },
    {
        id: 'FC16',
        file: 'FullCourse/FullCourse_16.md',
        rawFile: 'FullCourse/FullCourse_16_raw.md',
        name: 'תיאוריות אישיות – פרויד א׳',
        subtitle: 'היסטריה, לא מודע, מודל טופוגרפי',
        emoji: '🛋️',
        color: '#60a5fa'
    },
    {
        id: 'FC17',
        file: 'FullCourse/FullCourse_17.md',
        rawFile: 'FullCourse/FullCourse_17_raw.md',
        name: 'פרויד – מודל סטרוקטוראלי',
        subtitle: 'איד, אגו, סופר-אגו, מנגנוני הגנה',
        emoji: '🎭',
        color: '#b8a9e8'
    },
    {
        id: 'FC18',
        file: 'FullCourse/FullCourse_18.md',
        rawFile: 'FullCourse/FullCourse_18_raw.md',
        name: 'מנגנוני הגנה וגישות נוספות',
        subtitle: 'הדחקה, הכחשה, Big Five',
        emoji: '🛡️',
        color: '#f472b6'
    },
    {
        id: 'FC19',
        file: 'FullCourse/FullCourse_19.md',
        rawFile: 'FullCourse/FullCourse_19_raw.md',
        name: 'פסיכופתולוגיה – מבוא',
        subtitle: 'נורמלי/אבנורמלי, DSM, אבחון',
        emoji: '📋',
        color: '#2d7d46'
    },
    {
        id: 'FC20',
        file: 'FullCourse/FullCourse_20.md',
        rawFile: 'FullCourse/FullCourse_20_raw.md',
        name: 'OCD וחרדות',
        subtitle: 'אובססיות, קומפולסיות, חרדה מוכללת',
        emoji: '🔄',
        color: '#1ba8a6'
    },
    {
        id: 'FC21',
        file: 'FullCourse/FullCourse_21.md',
        rawFile: 'FullCourse/FullCourse_21_raw.md',
        name: 'דיכאון והפרעה דו-קוטבית',
        subtitle: 'סימפטומים, מאניה, דיסתימיה',
        emoji: '🌧️',
        color: '#8b5cf6'
    },
    {
        id: 'FC22',
        file: 'FullCourse/FullCourse_22.md',
        rawFile: 'FullCourse/FullCourse_22_raw.md',
        name: 'הסברים לדיכאון וסכיזופרניה',
        subtitle: 'זליגמן, בק, דלוזיות, הזיות',
        emoji: '🔬',
        color: '#f6d045'
    },
    {
        id: 'FC23',
        file: 'FullCourse/FullCourse_23.md',
        rawFile: 'FullCourse/FullCourse_23_raw.md',
        name: 'שיטות טיפול – פסיכודינמי',
        subtitle: 'פסיכואנליזה, העברה, תובנה',
        emoji: '💬',
        color: '#ff8a7a'
    },
    {
        id: 'FC24',
        file: 'FullCourse/FullCourse_24.md',
        rawFile: 'FullCourse/FullCourse_24_raw.md',
        name: 'טיפול קוגניטיבי-התנהגותי',
        subtitle: 'CBT, מחשבות אוטומטיות, חשיפות',
        emoji: '💡',
        color: '#47c163'
    }
];

/**
 * Extract table of contents from markdown
 * @param {string} markdown - Raw markdown content
 * @returns {string[]} - Array of h2 headings
 */
function extractFullLessonTOC(markdown) {
    const lines = markdown.split('\n');
    const headings = [];

    for (const line of lines) {
        if (line.startsWith('## ') && !line.startsWith('### ')) {
            let heading = line.replace(/^##\s+/, '').trim();
            heading = heading.replace(/\*\*/g, '').replace(/\*/g, '');
            if (!heading.includes('תוכן עניינים') && !heading.includes('סיכום מושגים') && !heading.includes('נקודות למבחן')) {
                headings.push(heading);
            }
        }
    }

    return headings;
}

/**
 * Fetch markdown file and extract TOC
 * @param {Object} lesson - Lesson object
 * @returns {Promise<string[]>} - Array of TOC items
 */
async function fetchFullLessonTOC(lesson) {
    try {
        const response = await fetch(`Summaries/${lesson.file}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const markdown = await response.text();
        return extractFullLessonTOC(markdown);
    } catch (error) {
        console.error(`Error fetching TOC for ${lesson.id}:`, error);
        return [];
    }
}

/**
 * Create a full lesson summary card element
 * @param {Object} lesson - Lesson object
 * @param {number} index - Lesson index (0-23)
 * @returns {HTMLElement} - Card element
 */
function createFullLessonCard(lesson, index) {
    const card = document.createElement('a');
    card.href = `full-lesson.html?lesson=${lesson.id}`;
    card.className = 'summary-card full-lesson-card';
    card.style.setProperty('--card-accent', lesson.color);

    card.innerHTML = `
        <div class="summary-card__header">
            <span class="summary-card__emoji">${lesson.emoji}</span>
            <span class="summary-card__lesson-num">שיעור ${index + 1}</span>
        </div>
        <h3 class="summary-card__title">${lesson.name}</h3>
        <p class="summary-card__subtitle">${lesson.subtitle}</p>
        <span class="summary-card__cta">צפי בסיכום ←</span>
    `;

    return card;
}

/**
 * Initialize the full lessons grid on full-lessons.html
 */
async function initFullLessonsGrid() {
    const grid = document.getElementById('full-lessons-grid');
    if (!grid) return;

    // Create cards for all 24 lessons
    FULL_LESSONS.forEach((lesson, index) => {
        const card = createFullLessonCard(lesson, index);
        grid.appendChild(card);
    });
}

/**
 * Load and render a full lesson on full-lesson.html
 * @param {string} lessonId - Lesson ID (e.g., 'FC01')
 * @param {boolean} showRaw - Whether to show raw version
 */
async function loadFullLessonPage(lessonId, showRaw = false) {
    const lessonIndex = FULL_LESSONS.findIndex(l => l.id === lessonId);
    const lesson = FULL_LESSONS[lessonIndex];

    if (!lesson) {
        showFullLessonError();
        return;
    }

    // Determine which file to load
    const fileToLoad = showRaw ? lesson.rawFile : lesson.file;
    const titleSuffix = showRaw ? ' (מקור)' : '';

    // Update header
    const emojiEl = document.getElementById('lesson-emoji');
    const titleEl = document.getElementById('lesson-title');
    if (emojiEl) emojiEl.textContent = lesson.emoji;
    if (titleEl) titleEl.textContent = `שיעור ${lessonIndex + 1}: ${lesson.name}${titleSuffix}`;
    document.title = `${lesson.name}${titleSuffix} - סיכום מלא`;

    try {
        // Fetch markdown
        const response = await fetch(`Summaries/${fileToLoad}`);
        if (!response.ok) throw new Error('Failed to fetch summary');
        const markdown = await response.text();

        // Render markdown
        const contentEl = document.getElementById('summary-content');
        const loadingEl = document.getElementById('loading-state');
        const rawLinkEl = document.getElementById('raw-link');

        if (contentEl && typeof marked !== 'undefined') {
            // Configure marked for better rendering
            marked.setOptions({
                breaks: true,
                gfm: true
            });

            contentEl.innerHTML = marked.parse(markdown);

            // Make external links open in new tab
            contentEl.querySelectorAll('a[href^="http"]').forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });

            // Update raw/formatted link
            if (rawLinkEl) {
                if (showRaw) {
                    // Currently viewing raw, link to formatted
                    rawLinkEl.href = `full-lesson.html?lesson=${lessonId}`;
                    rawLinkEl.innerHTML = '<span>📄</span> צפי בסיכום המעוצב';
                } else {
                    // Currently viewing formatted, link to raw
                    rawLinkEl.href = `full-lesson.html?lesson=${lessonId}&type=raw`;
                    rawLinkEl.innerHTML = '<span>📄</span> צפי בסיכום המקורי';
                }
                rawLinkEl.style.display = 'inline-flex';
            }

            // Show content, hide loading
            contentEl.style.display = 'block';
            if (loadingEl) loadingEl.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading full lesson:', error);
        showFullLessonError();
    }
}

/**
 * Show error state
 */
function showFullLessonError() {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');

    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on full-lessons.html (has grid)
    if (document.getElementById('full-lessons-grid')) {
        initFullLessonsGrid();
    }
});
