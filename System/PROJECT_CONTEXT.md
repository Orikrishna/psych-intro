# Psychology Learning App - Project Context

> **Read this file first in every new session to understand the project.**

## Project Overview
A learning app for TAU Introduction to Psychology course (מבוא לפסיכולוגיה).
Built for Ellie to study for exams using YouTube lecture videos.

**GitHub:** https://github.com/Orikrishna/psych-intro
**Live Site:** https://orikrishna.github.io/psych-intro/

## Project Location
`/Users/oristeinitz/Documents/Ellie_Uni/Psych_Intro/Study/` (this is the git repo)

## Folder Structure

```
Study/                          # Git repo root
├── index.html                  # Homepage with pathway cards
├── quiz.html                   # Quiz page
├── flashcards.html             # Flashcard study
├── sample-test.html            # Sample exam tests
├── summaries.html              # Summary cards page (NEW)
├── summary.html                # Single summary viewer (NEW)
├── styles.css                  # Global styles (~2400 lines)
├── data/
│   ├── questions.json          # Quiz questions by lesson
│   ├── flashcards.json         # Flashcard definitions
│   └── sample-test.json        # Sample exam questions
├── js/
│   ├── homepage.js
│   ├── quiz.js
│   ├── flashcards.js
│   ├── sample-test.js
│   └── summaries.js            # MD loading & rendering (NEW)
├── Summaries/                  # Hebrew markdown summaries (8 files)
│   ├── L01_מהי_פסיכולוגיה.md
│   ├── L02_ביהביוריזם_ולמידה.md
│   ├── L03_המהפכה_הקוגניטיבית.md
│   ├── L04_המוח.md
│   ├── L05_התפתחות.md
│   ├── L06_פסיכולוגיה_חברתית.md
│   ├── L07_אינטליגנציה_ואישיות.md
│   └── L08_פסיכופתולוגיה_וטיפול.md
└── System/
    └── PROJECT_CONTEXT.md      # This file
```

**Outside git repo:**
```
Psych_Intro/
├── Transcripts/                # Source transcripts (67 files)
│   └── L0XV0Y_*_T.md
└── video_youtube_map.json      # YouTube URL mappings
```

## Lessons Overview

| # | Hebrew Name | Emoji | Key Topics |
|---|-------------|-------|------------|
| L01 | מהי פסיכולוגיה | 🔬 | Scientific method, basic vs applied |
| L02 | ביהביוריזם ולמידה | 🐕 | Classical conditioning (Pavlov), Operant (Skinner) |
| L03 | המהפכה הקוגניטיבית | 🧠 | Cognitive revolution, memory, attention |
| L04 | המוח | ⚡ | Neurons, hemispheres, H.M., imaging |
| L05 | התפתחות | 👶 | Critical periods, Piaget, Theory of Mind |
| L06 | פסיכולוגיה חברתית | 👥 | Conformity (Asch), obedience (Milgram), bystander |
| L07 | אינטליגנציה ואישיות | 📊 | IQ, WAIS/WISC, Big Five, marshmallow test |
| L08 | פסיכופתולוגיה וטיפול | 💊 | DSM, CBT, psychodynamic, evidence-based |

## Completed Features

### ✅ Homepage (index.html)
- Pathway cards: Quiz, Flashcards, Sample Test, **Summaries**
- Progress tracking section
- Design: pastel colors, rounded corners, RTL Hebrew

### ✅ Quiz System (quiz.html)
- 270+ multiple choice questions
- Lesson filtering
- Immediate feedback with explanations
- Progress tracking

### ✅ Flashcards (flashcards.html)
- 35+ flashcards with terms/definitions
- Flip animation
- Spaced repetition

### ✅ Sample Test (sample-test.html)
- 90 real exam questions
- 5 test modes (10/20/30/60/90 questions)
- Female Hebrew UI

### ✅ Summaries Web Viewer (NEW - Jan 2026)
- **summaries.html**: 8 lesson cards with emojis, colored headers, TOC on hover
- **summary.html?lesson=L01**: Renders markdown with marked.js
- **js/summaries.js**: Dynamic MD loading, TOC extraction
- Features:
  - YouTube links open in new tabs
  - RTL Hebrew formatting
  - Tables, blockquotes styled
  - Responsive design

### ✅ 8 Hebrew Summaries (Markdown)
- 3-5 pages each, comprehensive
- YouTube timestamps with links
- ASCII diagrams, comparison tables
- Key terms tables
- "נקודות חשובות למבחן" sections

## Known Issues / TODOs

### 🔄 Mobile TOC on Summary Cards
The hover-based TOC expansion doesn't work on touch devices.
**Options:**
1. Always show TOC on mobile (CSS media query)
2. Two-tap interaction (JS)
3. Remove TOC on mobile

### 🔄 AI Podcasts (NotebookLM)
- Manual process via NotebookLM web UI
- One notebook per lesson
- Upload summary + transcripts, set Hebrew output

## Design System

### Colors
```css
--color-primary: #2d7d46;        /* Green */
--color-primary-light: #47c163;
--color-primary-dark: #235524;
--color-accent-gold: #f6d045;
--color-accent-teal: #1ba8a6;
--color-accent-coral: #ff8a7a;
--color-accent-lavender: #b8a9e8;
```

### Card Accent Colors (summaries)
- L01: #2d7d46 (green)
- L02: #1ba8a6 (teal)
- L03: #8b5cf6 (lavender)
- L04: #f6d045 (gold)
- L05: #ff8a7a (coral)
- L06: #47c163 (light green)
- L07: #60a5fa (blue)
- L08: #b8a9e8 (lavender light)

### Typography
- Font: Heebo (Google Fonts)
- RTL: `dir="rtl"` on html element

## Language Guidelines
- Use **female Hebrew** forms: לזכרי, שימי לב, בחרי
- "את" instead of "אתה"
- Academic terminology

## Quick Commands

```bash
# Project root
cd /Users/oristeinitz/Documents/Ellie_Uni/Psych_Intro/Study

# Start local server
python3 -m http.server 8080

# Git operations
git status
git add -A && git commit -m "message"
git push

# View live site
open https://orikrishna.github.io/psych-intro/
```

## Recent Git Commits
- `f74c7f9` - Add summaries web viewer feature
- `e4c25f2` - Add Hebrew lesson summaries (L01-L08)
- `e0dfaa4` - Keep answer order fixed with Hebrew letters
- `2308984` - Add Sample Test feature


