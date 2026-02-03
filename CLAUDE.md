# Psychology Exam Prep Website

A study website for Ellie's Tel Aviv University psychology exam (Feb 16, 2026).

## Tech Stack
- Vanilla HTML/CSS/JavaScript (no frameworks)
- Hosted on GitHub Pages: https://orikrishna.github.io/psych-intro/
- RTL Hebrew layout (`dir="rtl"`)

## File Structure
```
Study/
├── index.html          # Homepage with hero, pathway cards, footer
├── styles.css          # All CSS styles
├── quiz.html           # Online lessons quiz (L00-L08)
├── full-quiz.html      # Frontal lessons quiz (FC01-FC24)
├── sample-test.html    # Sample exam with 5 modes
├── summaries.html      # Summary cards grid
├── summary.html        # Individual summary viewer
├── flashcards.html     # Flashcard practice
├── full-lessons.html   # Full course lessons list
├── full-lesson.html    # Individual lesson viewer
├── js/
│   ├── quiz.js         # Online quiz logic
│   ├── full-quiz.js    # Frontal quiz logic (24 lessons)
│   ├── sample-test.js  # Sample test logic
│   ├── summaries.js    # Summary cards
│   ├── flashcards.js   # Flashcard logic
│   ├── full-lessons.js # Full lessons grid
│   └── homepage.js     # Countdown timer
├── data/
│   ├── questions.json       # Online quiz questions
│   ├── full-course-questions.json  # Frontal quiz questions
│   ├── sample-tests.json    # Sample test questions
│   └── flashcards.json      # Flashcard data
├── Summaries/
│   ├── L01-L08 markdown files
│   └── FullCourse/ (FC summaries)
└── images/
    ├── hero-bg.png      # Floral pastel hero background
    └── footer-bg.webp   # Footer background
```

## Design Conventions

### Colors
- Primary green: `#2d7d46`
- Background cream: `#faf8f5`
- Pastel gradients for cards (white → light tint)

### Hero Section
- Background image with CSS `mask-image` fade (not overlay)
- 464px height, image fades from 50% to transparent at bottom
- Title: "הכנה למבחן בפסיכולוגיה"
- Countdown timer to Feb 16, 2026 9:00 Israel time

### Lesson Cards (quiz.html, full-quiz.html)
- Each lesson has unique pastel `bgColor` and `strokeColor`
- Circle shows emoji (full-quiz) or number (quiz)
- Completed lessons (60%+): dark stroke around circle via `box-shadow`
- Green checkmark badge at top-right corner

### Homepage Pathway Cards
- Light gradient backgrounds (white → pastel)
- No top line on hover (removed)
- Each card has unique color scheme

### Sample Test Cards
- 5 modes with emojis and pastel gradients
- 4px colored border-top strip

## Pending Tasks
1. Fix quiz distractors for FC21 and FC22 (balance answer lengths, randomize correct answer positions)

## Local Development
Files won't load via `file://` due to CORS. Use:
```bash
cd /Users/oristeinitz/Documents/Ellie_Uni/Psych_Intro/Study
python3 -m http.server 8000
```
Then open http://localhost:8000

## Git
- Repo: https://github.com/Orikrishna/psych-intro
- Deploy: `git add . && git commit -m "message" && git push origin main`
