/**
 * Analytics Module
 * Tracks site visits, page views, and user actions using Supabase
 */

const Analytics = (function() {
    // Supabase configuration
    const SUPABASE_URL = 'https://tbcgkmuucjxynibokxuo.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiY2drbXV1Y2p4eW5pYm9reHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjQxODEsImV4cCI6MjA4NTcwMDE4MX0.oGYJoFlzIaFGehfC7gf0O0VK0y2_HJjISwQXUmUEbOU';

    // Animal names for anonymous users (with emojis)
    const ADJECTIVES = [
        'Happy', 'Clever', 'Swift', 'Brave', 'Gentle', 'Wise', 'Calm', 'Bright',
        'Kind', 'Bold', 'Quick', 'Warm', 'Cool', 'Sharp', 'Soft', 'Lucky'
    ];
    const ANIMALS = {
        'Fox': '🦊', 'Owl': '🦉', 'Bear': '🐻', 'Wolf': '🐺', 'Deer': '🦌',
        'Hawk': '🦅', 'Lion': '🦁', 'Tiger': '🐯', 'Panda': '🐼', 'Koala': '🐨',
        'Eagle': '🦅', 'Dolphin': '🐬', 'Penguin': '🐧', 'Rabbit': '🐰', 'Otter': '🦦',
        'Falcon': '🦅', 'Cat': '🐱', 'Dog': '🐶', 'Elephant': '🐘', 'Giraffe': '🦒',
        'Zebra': '🦓', 'Monkey': '🐵', 'Gorilla': '🦍', 'Hippo': '🦛', 'Rhino': '🦏',
        'Camel': '🐫', 'Kangaroo': '🦘', 'Hedgehog': '🦔', 'Squirrel': '🐿️', 'Bat': '🦇',
        'Whale': '🐋', 'Shark': '🦈', 'Octopus': '🐙', 'Crab': '🦀', 'Turtle': '🐢',
        'Frog': '🐸', 'Butterfly': '🦋', 'Bee': '🐝', 'Ladybug': '🐞', 'Unicorn': '🦄'
    };
    const ANIMAL_NAMES = Object.keys(ANIMALS);

    let userId = null;
    let sessionId = null;
    let currentPage = null;
    let pageStartTime = null;
    let pagesVisited = [];

    /**
     * Generate a device fingerprint based on browser characteristics
     */
    function generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
        const canvasData = canvas.toDataURL();

        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            canvasData.slice(-50)
        ];

        // Simple hash function
        let hash = 0;
        const str = components.join('|');
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'fp_' + Math.abs(hash).toString(36);
    }

    /**
     * Generate a random animal name with emoji
     */
    function generateAnimalName() {
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const animalName = ANIMAL_NAMES[Math.floor(Math.random() * ANIMAL_NAMES.length)];
        const emoji = ANIMALS[animalName];
        return `${emoji} ${adj} ${animalName}`;
    }

    /**
     * Make a request to Supabase
     */
    async function supabaseRequest(endpoint, method, body = null) {
        try {
            const options = {
                method,
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                }
            };
            if (body) {
                options.body = JSON.stringify(body);
            }
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
            if (!response.ok) {
                console.warn('Analytics request failed:', response.status);
                return null;
            }
            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (e) {
            console.warn('Analytics error:', e);
            return null;
        }
    }

    /**
     * Detect device type from user agent
     */
    function detectDeviceType() {
        const ua = navigator.userAgent.toLowerCase();
        if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/i.test(navigator.userAgent)) {
            return 'tablet';
        }
        if (/mobile|iphone|ipod|android.*mobile|webos|blackberry|opera mini|iemobile/i.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    /**
     * Get or create user based on device fingerprint
     */
    async function getOrCreateUser() {
        const fingerprint = generateFingerprint();

        // Check localStorage first for faster load
        const cached = localStorage.getItem('analytics_user');
        if (cached) {
            const data = JSON.parse(cached);
            if (data.fingerprint === fingerprint) {
                userId = data.userId;
                return userId;
            }
        }

        // Check if user exists in Supabase
        const existing = await supabaseRequest(
            `users?device_fingerprint=eq.${fingerprint}&select=id`,
            'GET'
        );

        if (existing && existing.length > 0) {
            userId = existing[0].id;
        } else {
            // Create new user with device type
            const animalName = generateAnimalName();
            const deviceType = detectDeviceType();
            const created = await supabaseRequest('users', 'POST', {
                device_fingerprint: fingerprint,
                animal_name: animalName,
                device_type: deviceType
            });
            if (created && created.length > 0) {
                userId = created[0].id;
            }
        }

        // Cache in localStorage
        if (userId) {
            localStorage.setItem('analytics_user', JSON.stringify({
                fingerprint,
                userId
            }));
        }

        return userId;
    }

    /**
     * Sync localStorage name to database (for returning users)
     */
    async function syncLocalNameToDatabase(name) {
        if (!userId || !name) return;

        // Always update - this ensures returning users get their localStorage name synced
        await supabaseRequest(
            `users?id=eq.${userId}`,
            'PATCH',
            { display_name: name }
        );
    }

    /**
     * Start a new session
     */
    async function startSession() {
        if (!userId) return null;

        const created = await supabaseRequest('sessions', 'POST', {
            user_id: userId,
            pages_visited: []
        });

        if (created && created.length > 0) {
            sessionId = created[0].id;
            // Cache session ID
            sessionStorage.setItem('analytics_session', sessionId);
        }

        return sessionId;
    }

    /**
     * Update session with visited pages
     */
    async function updateSession() {
        if (!sessionId || pagesVisited.length === 0) return;

        await supabaseRequest(
            `sessions?id=eq.${sessionId}`,
            'PATCH',
            { pages_visited: pagesVisited }
        );
    }

    /**
     * End the current session
     */
    async function endSession() {
        if (!sessionId) return;

        await supabaseRequest(
            `sessions?id=eq.${sessionId}`,
            'PATCH',
            {
                ended_at: new Date().toISOString(),
                pages_visited: pagesVisited
            }
        );
    }

    /**
     * Track an event
     */
    async function trackEvent(eventType, eventData = {}) {
        if (!userId) return;

        // Use cached session if available
        if (!sessionId) {
            sessionId = sessionStorage.getItem('analytics_session');
        }

        await supabaseRequest('events', 'POST', {
            user_id: userId,
            session_id: sessionId,
            event_type: eventType,
            event_data: eventData
        });
    }

    /**
     * Track page view
     */
    function trackPageView() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        currentPage = page;
        pageStartTime = Date.now();

        if (!pagesVisited.includes(page)) {
            pagesVisited.push(page);
            updateSession();
        }

        trackEvent('page_view', { page });
    }

    /**
     * Track page exit (time spent)
     */
    function trackPageExit() {
        if (currentPage && pageStartTime) {
            const duration = Math.round((Date.now() - pageStartTime) / 1000);
            trackEvent('page_exit', {
                page: currentPage,
                duration_seconds: duration
            });
        }
    }

    /**
     * Initialize analytics
     */
    async function init() {
        // Don't track on admin page
        if (window.location.pathname.includes('admin-analytics')) {
            return;
        }

        await getOrCreateUser();

        // Sync localStorage name to database if exists but not in DB
        const localName = localStorage.getItem('user-name');
        if (localName && userId) {
            // Check if we need to sync (could be returning user)
            syncLocalNameToDatabase(localName);
        }

        // Check for existing session
        const existingSession = sessionStorage.getItem('analytics_session');
        if (existingSession) {
            sessionId = existingSession;
        } else {
            await startSession();
        }

        // Track page view
        trackPageView();

        // Track page exit on unload
        window.addEventListener('beforeunload', () => {
            trackPageExit();
            endSession();
        });

        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                trackPageExit();
            } else {
                pageStartTime = Date.now();
            }
        });
    }

    // Public API
    return {
        init,
        trackEvent,

        /**
         * Track quiz completion
         */
        trackQuizComplete(quizType, lesson, score, total) {
            trackEvent('quiz_complete', {
                quiz_type: quizType, // 'online', 'frontal', 'sample'
                lesson,
                score,
                total,
                percentage: Math.round((score / total) * 100)
            });
        },

        /**
         * Track flashcard session
         */
        trackFlashcardSession(cardsReviewed, cardsKnown) {
            trackEvent('flashcard_session', {
                cards_reviewed: cardsReviewed,
                cards_known: cardsKnown
            });
        },

        /**
         * Track video watched
         */
        trackVideoWatch(lessonId, lessonName) {
            trackEvent('video_watch', {
                lesson_id: lessonId,
                lesson_name: lessonName
            });
        },

        /**
         * Track individual question answer for difficulty analysis
         */
        trackQuestionAnswer(quizType, lesson, questionIndex, questionData, selectedAnswer, isCorrect, timeMs) {
            const questionId = `${lesson}_q${questionIndex}`;

            // Track in events table
            trackEvent('question_answer', {
                quiz_type: quizType,
                lesson: lesson,
                question_id: questionId,
                is_correct: isCorrect,
                time_to_answer_ms: timeMs
            });

            // Also store in dedicated table for difficulty analysis
            supabaseRequest('question_attempts', 'POST', {
                user_id: userId,
                question_id: questionId,
                question_text: questionData.question ? questionData.question.substring(0, 200) : '',
                quiz_type: quizType,
                lesson: lesson,
                selected_answer: selectedAnswer,
                correct_answer: questionData.correct,
                is_correct: isCorrect,
                time_to_answer_ms: timeMs
            });
        },

        /**
         * Update user's display name (from welcome modal)
         */
        async updateUserName(name) {
            if (!userId) {
                // Try to get cached userId
                const cached = localStorage.getItem('analytics_user');
                if (cached) {
                    userId = JSON.parse(cached).userId;
                }
            }

            if (!userId) {
                console.warn('Cannot update user name: no user ID');
                return false;
            }

            const result = await supabaseRequest(
                `users?id=eq.${userId}`,
                'PATCH',
                { display_name: name }
            );

            if (result !== null) {
                console.log('User name updated:', name);
                return true;
            }
            return false;
        }
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
    Analytics.init();
}
