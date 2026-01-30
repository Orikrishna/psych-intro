/**
 * Summaries Module
 * Handles loading and rendering markdown summaries for psychology lessons
 */

// Lesson metadata
const LESSONS = [
    {
        id: 'L01',
        file: 'L01_מהי_פסיכולוגיה.md',
        name: 'מהי פסיכולוגיה',
        emoji: '🔬',
        color: '#2d7d46' // primary green
    },
    {
        id: 'L02',
        file: 'L02_ביהביוריזם_ולמידה.md',
        name: 'ביהביוריזם ולמידה',
        emoji: '🐕',
        color: '#1ba8a6' // teal
    },
    {
        id: 'L03',
        file: 'L03_המהפכה_הקוגניטיבית.md',
        name: 'המהפכה הקוגניטיבית',
        emoji: '🧠',
        color: '#8b5cf6' // lavender
    },
    {
        id: 'L04',
        file: 'L04_המוח.md',
        name: 'המוח',
        emoji: '⚡',
        color: '#f6d045' // gold
    },
    {
        id: 'L05',
        file: 'L05_התפתחות.md',
        name: 'התפתחות',
        emoji: '👶',
        color: '#ff8a7a' // coral
    },
    {
        id: 'L06',
        file: 'L06_פסיכולוגיה_חברתית.md',
        name: 'פסיכולוגיה חברתית',
        emoji: '👥',
        color: '#47c163' // light green
    },
    {
        id: 'L07',
        file: 'L07_אינטליגנציה_ואישיות.md',
        name: 'אינטליגנציה ואישיות',
        emoji: '📊',
        color: '#60a5fa' // blue
    },
    {
        id: 'L08',
        file: 'L08_פסיכופתולוגיה_וטיפול.md',
        name: 'פסיכופתולוגיה וטיפול',
        emoji: '💊',
        color: '#b8a9e8' // lavender light
    }
];

/**
 * Extract table of contents from markdown
 * @param {string} markdown - Raw markdown content
 * @returns {string[]} - Array of h2 headings
 */
function extractTOC(markdown) {
    const lines = markdown.split('\n');
    const headings = [];

    for (const line of lines) {
        // Match ## headings (but not ### or more)
        if (line.startsWith('## ') && !line.startsWith('### ')) {
            // Remove the ## and any leading/trailing whitespace
            let heading = line.replace(/^##\s+/, '').trim();
            // Remove any markdown formatting
            heading = heading.replace(/\*\*/g, '').replace(/\*/g, '');
            // Skip table of contents heading itself
            if (!heading.includes('תוכן עניינים')) {
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
async function fetchTOC(lesson) {
    try {
        const response = await fetch(`Summaries/${lesson.file}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const markdown = await response.text();
        return extractTOC(markdown);
    } catch (error) {
        console.error(`Error fetching TOC for ${lesson.id}:`, error);
        return [];
    }
}

/**
 * Create a summary card element
 * @param {Object} lesson - Lesson object
 * @param {string[]} toc - Table of contents items
 * @returns {HTMLElement} - Card element
 */
function createSummaryCard(lesson, toc) {
    const card = document.createElement('a');
    card.href = `summary.html?lesson=${lesson.id}`;
    card.className = 'summary-card';
    card.style.setProperty('--card-accent', lesson.color);

    // Build TOC HTML
    const tocHTML = toc.length > 0
        ? `<ul class="summary-card__toc-list">
            ${toc.slice(0, 6).map(item => `<li>${item}</li>`).join('')}
            ${toc.length > 6 ? `<li class="summary-card__toc-more">+ ${toc.length - 6} נוספים...</li>` : ''}
           </ul>`
        : '<p class="summary-card__toc-empty">טוען תוכן...</p>';

    card.innerHTML = `
        <div class="summary-card__header">
            <span class="summary-card__emoji">${lesson.emoji}</span>
            <span class="summary-card__lesson-num">שיעור ${lesson.id.replace('L0', '')}</span>
        </div>
        <h3 class="summary-card__title">${lesson.name}</h3>
        <div class="summary-card__toc">
            <span class="summary-card__toc-label">תוכן עניינים</span>
            ${tocHTML}
        </div>
        <span class="summary-card__cta">צפי בסיכום ←</span>
    `;

    return card;
}

/**
 * Initialize the summaries grid on summaries.html
 */
async function initSummariesGrid() {
    const grid = document.getElementById('summary-grid');
    if (!grid) return;

    // Create cards for all lessons
    for (const lesson of LESSONS) {
        // Create card with placeholder TOC
        const card = createSummaryCard(lesson, []);
        grid.appendChild(card);

        // Fetch TOC and update card
        fetchTOC(lesson).then(toc => {
            const tocContainer = card.querySelector('.summary-card__toc');
            if (tocContainer && toc.length > 0) {
                const tocHTML = `
                    <span class="summary-card__toc-label">תוכן עניינים</span>
                    <ul class="summary-card__toc-list">
                        ${toc.slice(0, 6).map(item => `<li>${item}</li>`).join('')}
                        ${toc.length > 6 ? `<li class="summary-card__toc-more">+ ${toc.length - 6} נוספים...</li>` : ''}
                    </ul>
                `;
                tocContainer.innerHTML = tocHTML;
            }
        });
    }
}

/**
 * Load and render a summary on summary.html
 * @param {string} lessonId - Lesson ID (e.g., 'L01')
 */
async function loadSummaryPage(lessonId) {
    const lesson = LESSONS.find(l => l.id === lessonId);

    if (!lesson) {
        showError();
        return;
    }

    // Update header
    const emojiEl = document.getElementById('lesson-emoji');
    const titleEl = document.getElementById('lesson-title');
    if (emojiEl) emojiEl.textContent = lesson.emoji;
    if (titleEl) titleEl.textContent = `שיעור ${lesson.id.replace('L0', '')}: ${lesson.name}`;
    document.title = `${lesson.name} - סיכום`;

    try {
        // Fetch markdown
        const response = await fetch(`Summaries/${lesson.file}`);
        if (!response.ok) throw new Error('Failed to fetch summary');
        const markdown = await response.text();

        // Render markdown
        const contentEl = document.getElementById('summary-content');
        const loadingEl = document.getElementById('loading-state');

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

            // Show content, hide loading
            contentEl.style.display = 'block';
            if (loadingEl) loadingEl.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading summary:', error);
        showError();
    }
}

/**
 * Show error state
 */
function showError() {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');

    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on summaries.html (has grid)
    if (document.getElementById('summary-grid')) {
        initSummariesGrid();
    }
});
