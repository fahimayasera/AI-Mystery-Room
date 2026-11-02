# 🕵️ AI Mystery Room

### Every mystery has a secret. Every clue tells a story. Can you uncover the truth?

Step into an AI-powered mystery investigation experience where your imagination creates the case and your curiosity solves it.

Create fictional mystery scenarios, investigate suspects, explore AI-generated evidence, uncover hidden clues, and make your final accusation.

**Think like a detective. Question every detail. Solve the mystery.**

---

## 📌 Project Overview

AI Mystery Room is an interactive, single-player mystery investigation website. Users provide a short scenario, and the AI generates a fictional mystery case containing suspects, clues, evidence, and a hidden culprit.

Players investigate the case, discover clues, request hints, and accuse a suspect to reveal the solution and their score.

## ✨ Features

- **AI Mystery Generation:** Create mystery cases from user-provided scenarios.
- **Multiple Suspects:** Investigate different fictional characters.
- **Evidence and Clues:** Explore case information to uncover the truth.
- **Hint System:** Request hints when you need help.
- **Accusation System:** Select the suspect you believe is responsible.
- **Scoring System:** Earn points for correct accusations and discovered clues.
- **Results Page:** View the solution and your investigation score.

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

**AI Integration**
- Google Gemini API (`@google/genai`)

**Validation**
- Zod

## 🎮 How It Works

1. Enter a short mystery scenario.
2. Choose a difficulty level.
3. Let the AI generate a fictional investigation.
4. Examine suspects, evidence, and clues.
5. Discover clues and request hints if needed.
6. Accuse the suspect you believe is responsible.
7. View the final solution and your score.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Google Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/AI-Mystery-Room.git
cd AI-Mystery-Room
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder using `.env.example` as a reference. Add your MongoDB connection string and Gemini API key.

Start the backend:

```bash
npm run dev
```

### Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 📁 Project Structure

```text
AI-Mystery-Room/
├── client/          # React frontend
├── server/          # Express backend
├── SPEC.md          # Project specification
└── README.md        # Project documentation
```

## 🔐 Security Note

API keys and database credentials must be stored in environment variables. Never commit your `.env` file or share your secret keys publicly.

## 🚧 Current Scope

This is an MVP project. Mystery generation, investigation, clue discovery, hints, accusations, and scoring are implemented. Evidence is currently presented as text; AI-generated images and CCTV video are not yet implemented.

## 👩‍💻 Project

**AI Mystery Room**  
A spec-driven development project.
