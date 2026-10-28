# 📌 Kannada Survival Kit (Kannada for Everyone)

> An interactive, offline-ready Progressive Web Application (PWA) designed to help newcomers, students, and travelers learn essential Kannada for daily interactions, travel, dining, and navigation.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kannada-for-everyone-phi.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Samsamith017/kannada-for-everyone)

---

## Live Demo

- **URL:** [https://kannada-for-everyone-phi.vercel.app](https://kannada-for-everyone-phi.vercel.app)
- **Deployment Platform:** Vercel

---

## Project Overview & Problem Statement

For non-native speakers living in or visiting Karnataka, communicating in daily scenarios (like taking auto-rickshaws, shopping, asking for directions, or ordering food) can often present a language barrier. 

**Kannada Survival Kit** solves this by providing a lightweight, high-performance, and accessible survival guide. With immediate English-to-Kannada translations, phonetics, interactive flashcards, practice quizzes, and full offline accessibility, users can confidently navigate daily life in Karnataka from day one.

---

## Key Features

- **Categorized Vocabulary & Daily Phrases**: Curated essential words and everyday expressions organized into intuitive categories (Question Words, Pronouns, Directions, Greetings, Basics).
- **English & Phonetic Guidance**: Every Kannada phrase includes English translation and clear phonetic transliteration (Romanized Kannada) for easy pronunciation.
- **Instant Translator Utility**: Quick reference search for essential everyday vocabulary.
- **Interactive Flashcards**: Active-recall flashcards to build vocabulary retention.
- **Knowledge Quiz**: Self-assessment module to test phrase recognition and track learning progress.
- **Dark / Light Mode**: Sleek glassmorphic user interface designed for comfortable viewing in any lighting environment.
- **Progressive Web App (PWA)**: Built with active Service Workers for full offline functionality and home screen installation on mobile devices.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React Framework)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom UI with Dark Mode & Glassmorphism)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA & Offline Support**: Custom Service Workers for caching static assets and client-side storage
- **Deployment**: [Vercel](https://vercel.com/)

---

## Local Setup & Installation Instructions

Follow these steps to clone and run the project on your local machine:

### Prerequisites
Make sure you have Node.js (v18 or higher) and npm installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Samsamith017/kannada-for-everyone.git
cd kannada-for-everyone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app locally.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Repository Structure

```text
kannada-for-everyone/
├── public/              # Static assets, PWA icons, and manifest
│   ├── manifest.json
│   └── sw.js            # Service worker for offline functionality
├── src/                 # Application source code
│   └── app/             # Next.js App Router pages and components
├── .gitignore
├── package.json
├── README.md
└── tailwind.config.js
```

---

## Academic / Project Submission Metadata

- **Project Title:** Kannada Survival Kit (Kannada for Everyone)
- **Repository:** `Samsamith017/kannada-for-everyone`
- **Primary Stack:** Next.js, React, Tailwind CSS, PWA
- **Live Deployment:** [https://kannada-for-everyone-phi.vercel.app](https://kannada-for-everyone-phi.vercel.app)
