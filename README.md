# Daniel Chung — Portfolio

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://dchungs-portfolio.web.app)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase&logoColor=white)

A personal portfolio site built to showcase my work as a full-stack developer — from a graduation team project through to independently shipped full-stack apps. It's a single-page React app with an interactive intro, an animated project gallery, a skill-based project filter, and a live visitor comment board.

**Live site:** [dchungs-portfolio.web.app](https://dchungs-portfolio.web.app)

## Features

- **Drag-to-unlock intro** — a key-and-lock drag-and-drop interaction (`@hello-pangea/dnd`) gates the rest of the site, with animated glow cues signaling what's draggable and where it drops.
- **Skill-filterable project explorer** — clicking a tech-stack icon animates in the projects that were built with it, powered by Framer Motion.
- **Animated project showcase** — a Framer Motion slider highlights major and side projects, each linking out to its GitHub repo and live demo.
- **Live guestbook** — visitors can leave a public comment, persisted in real time via Firestore.

## Tech Stack

| Layer            | Tools                                                        |
| ----------------- | ------------------------------------------------------------- |
| Framework/Build   | React 19, TypeScript, Vite                                    |
| Styling/Animation | styled-components, Framer Motion                              |
| Drag & Drop       | @hello-pangea/dnd                                              |
| Routing/State     | React Router, Recoil                                           |
| Backend/Data      | Firebase (Firestore)                                           |
| Hosting           | Firebase Hosting                                                |

## Project Structure

```
src/
├── App.tsx              # Route setup and top-level layout
├── project-list.tsx     # Project data (team, main, and sub projects)
├── firebase.ts          # Firebase app/Firestore initialization
└── components/
    ├── Intro.tsx         # Drag-to-unlock landing screen
    ├── Header.tsx        # Site header/nav
    ├── Me.tsx             # Bio, experience, and skill-filterable projects
    ├── SkillProjects.tsx # Animated project list filtered by selected skill
    ├── Projects.tsx       # Project showcase slider
    ├── Card.tsx            # Project card used in the showcase/slider
    ├── Board.tsx            # Firestore-backed visitor comment board
    ├── timeline.tsx         # Comment timeline rendering
    ├── Footer.tsx            # Site footer
    └── NotFound.tsx           # 404 fallback route
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/danielhc0228/my-portfolio.git
cd my-portfolio
npm install
```

### Development

```bash
npm run dev
```

### Build & Preview

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
```

### Deploy

```bash
npm run deploy     # builds and deploys to Firebase Hosting
```

## Key Components

### Intro.tsx

The first screen visitors see. A drag-and-drop key-and-lock interaction, built with `@hello-pangea/dnd`, unlocks the rest of the page.

![Intro drag-to-unlock demo](https://github.com/user-attachments/assets/95799fe7-b353-4592-98f7-a725927d92ab)

### Me.tsx

Bio section covering experience, education, career goals, and skills. Clicking a skill icon reveals the projects built with it, animated in via `SkillProjects.tsx`.

### Projects.tsx

Showcases major projects (team projects, solo full-stack builds) and smaller side projects, all sourced from `project-list.tsx`. Uses Framer Motion's `AnimatePresence` to animate the project slider.

![Project slider demo](https://github.com/user-attachments/assets/05990f87-fa79-440b-83b7-d8338a47c3b8)

### Board.tsx

A public guestbook where visitors can leave a comment, written directly to and rendered live from Firestore.

![Guestbook demo](https://github.com/user-attachments/assets/64093494-f1bc-4650-b831-747b08105de0)

## Contact

**Daniel Chung** — [GitHub](https://github.com/danielhc0228)

Feel free to explore the code, open an issue, or reach out via GitHub if you'd like to connect.
