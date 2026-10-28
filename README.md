<h1>Kannada for Everyone</h1> <h2>(Kannada Survival Kit)</h2>

> An interactive, offline-ready Progressive Web Application (PWA) designed to assist non-native speakers, students, and visitors in learning essential Kannada for daily interactions, travel, dining, and navigation.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kannada-for-everyone-phi.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Samsamith017/kannada-for-everyone)

---

Live Demo
* **Production URL:** [https://kannada-for-everyone-phi.vercel.app](https://kannada-for-everyone-phi.vercel.app)
* **Deployment Platform:** (https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

Project Overview
Non-native residents and visitors in Karnataka frequently encounter language barriers during routine activities such as commuting, shopping, asking for directions, or ordering food. 

**Kannada Survival Kit** addresses this challenge by providing a lightweight, responsive, and accessible resource. The platform features curated English-to-Kannada translations, phonetic transliterations, interactive flashcards, practice quizzes, and offline accessibility to support practical communication skills.

---

## Key Features
* **Categorized Vocabulary & Phrases:** Organized modules covering high-frequency words and expressions (Question Words, Pronouns, Directions, Greetings, and Basics).
* **Phonetic Pronunciation Guidance:** Each entry pairs original script display with English translation and Romanized Kannada transliteration.
* **Instant Vocabulary Reference:** Searchable utility for rapid reference during live interactions.
* **Interactive Flashcards:** Active-recall tools to reinforce retention.
* **Self-Assessment Quizzes:** Practice modules to evaluate comprehension and monitor progress.
* **Progressive Web App (PWA):** Equipped with service workers for full offline availability and mobile home screen installation.

---

## Tech Stack
* **Framework:** Next.js (App Router)
* **Library:** React
* **Styling:** Tailwind CSS
* **Iconography:** Lucide React
* **PWA / Offline:** Service Workers
* **Deployment:** Vercel

---

## Local Development Setup

### Prerequisites
* Node.js (v18.0 or higher)
* npm (v9.0 or higher)

### Installation & Execution
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Samsamith017/kannada-for-everyone.git
   cd kannada-for-everyone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   ```bash
   Open `http://localhost:3000` in your browser.

5. **Build for production (optional):**
   ```bash
   npm run build
   npm run start
   ```

---

## 📁Repository Structure

```text
kannada-for-everyone/
├── public/              # Static assets, PWA manifest, and service worker
│   ├── manifest.json
│   └── sw.js            # Service worker implementation
├── src/
│   └── app/             # Next.js App Router pages and UI components
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Project Metadata
* **Project Title:** Kannada for Everyone
* **Repository:** `Samsamith017/kannada-for-everyone`
* **Core Technologies:** Next.js, React, Tailwind CSS, PWA
* **Live URL:** [https://kannada-for-everyone-phi.vercel.app](https://kannada-for-everyone-phi.vercel.app)
