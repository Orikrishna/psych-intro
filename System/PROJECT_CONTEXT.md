# Psychology Learning App - Project Context

> **Read this file first in every new session to understand the project.**

## Project Overview
A learning app for TAU Introduction to Psychology course (מבוא לפסיכולוגיה).
Built for Ellie to study for exams using YouTube lecture videos.

## Project Location
`/Users/oristeinitz/Documents/Ellie_Uni/Psych_Intro/`

## Key Folders

```
Psych_Intro/
├── Study/                    # Main web app (git repo is HERE)
│   ├── index.html           # Homepage
│   ├── quiz.html            # Quiz page
│   ├── flashcards.html      # Flashcard study page
│   ├── styles.css           # Global styles
│   └── data/
│       ├── questions.json   # Quiz questions by lesson
│       └── flashcards.json  # Flashcard definitions
├── Summaries/               # Hebrew markdown summaries (8 files)
│   ├── L01_מהי_פסיכולוגיה.md
│   ├── L02_ביהביוריזם_ולמידה.md
│   ├── L03_הפסיכולוגיה_הקוגניטיבית.md
│   ├── L04_המוח.md
│   ├── L05_התפתחות.md
│   ├── L06_פסיכולוגיה_חברתית.md
│   ├── L07_אינטליגנציה_ואישיות.md
│   └── L08_פסיכופתולוגיה_וטיפול.md
├── Transcripts/             # YouTube video transcripts (67 files)
│   └── L0XV0Y_*_T.md        # Format: L[lesson]V[video]_[name]_T.md
├── System/                  # This folder - project documentation
│   └── PROJECT_CONTEXT.md   # This file
└── video_youtube_map.json   # Maps video IDs to YouTube URLs
```

## Lessons Overview

| # | Hebrew Name | English | Key Topics |
|---|-------------|---------|------------|
| L01 | מהי פסיכולוגיה | What is Psychology | Scientific method, basic vs applied |
| L02 | ביהביוריזם ולמידה | Behaviorism | Classical conditioning (Pavlov), Operant (Skinner) |
| L03 | הפסיכולוגיה הקוגניטיבית | Cognitive Psychology | Cognitive revolution, memory, attention |
| L04 | המוח | The Brain | Neurons, hemispheres, H.M., imaging methods |
| L05 | התפתחות | Development | Critical periods, Piaget, Theory of Mind |
| L06 | פסיכולוגיה חברתית | Social Psychology | Conformity (Asch), obedience (Milgram), bystander effect |
| L07 | אינטליגנציה ואישיות | Intelligence & Personality | IQ, WAIS/WISC, Big Five, marshmallow test |
| L08 | פסיכופתולוגיה וטיפול | Psychopathology | DSM, CBT, psychodynamic, evidence-based treatment |

## Completed Features

### ✅ Study Web App
- Homepage with lesson navigation
- Quiz system with immediate feedback
- Flashcard study mode
- Responsive design

### ✅ 8 Hebrew Summaries
- Comprehensive 3-5 page summaries
- YouTube links with timestamps
- ASCII diagrams and comparison tables
- Key terms tables
- "נקודות חשובות למבחן" sections

## Pending Features

### 🔄 AI Podcasts (NotebookLM)
- User needs to manually create via NotebookLM web UI
- One notebook per lesson
- Upload: summary + transcripts
- Set Hebrew output
- Generate Audio Overview

## Language Guidelines
- Use **female Hebrew** forms (לזכרי, שימי לב)
- Academic terminology in Hebrew
- Proper RTL formatting in markdown

## Git Info
- **Repo location:** `/Users/oristeinitz/Documents/Ellie_Uni/Psych_Intro/Study/`
- **Main branch:** Check with `git branch`
- Summaries folder is OUTSIDE the git repo

## Quick Commands

```bash
# Go to project
cd /Users/oristeinitz/Documents/Ellie_Uni/Psych_Intro

# Go to git repo
cd /Users/oristeinitz/Documents/Ellie_Uni/Psych_Intro/Study

# List summaries
ls -la Summaries/

# List transcripts for a lesson
ls Transcripts/L01*
```

## Plan File Location
Full project plan: `/Users/oristeinitz/.claude/plans/indexed-popping-quill.md`
