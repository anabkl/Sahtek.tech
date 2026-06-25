# Sahtek — Code for Health, Build for Impact 🎀

Sahtek is a hackathon-born digital health platform focused on breast cancer awareness for Moroccan women.  
We built it as a portfolio-ready product that combines accessible education, empathetic AI guidance, and practical prevention tools.

🌍 **Live:** https://sahtek.tech

---

## Vision

**Code for health. Build for impact.**  
Sahtek aims to make life-saving awareness tools easy to access, culturally relevant, and mobile-first.

---

## Core Features

- 🤖 **AI Chat in Moroccan Darija**  
  Breast cancer awareness assistant focused on educational guidance and emotional support.

- 📲 **SMS reminder mock flow**  
  Simulated monthly reminder workflow to encourage consistent self-check habits.

- 🩺 **Risk-awareness and prevention content**  
  Clear, localized educational resources for symptoms, prevention, and when to seek medical advice.

---

## Tech Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- Zustand + Framer Motion
- Hosted on **Netlify**

### Backend
- .NET 8 Web API (ASP.NET Core)
- AI chat integration via DeepSeek API
- Hosted on **Render**

### Dev & Delivery
- Docker (backend deployment)
- GitHub-based workflow for collaboration and release readiness

---

## Repository Structure

```text
.
├── backend/                 # .NET 8 API (chat, content, risk, reminders)
├── public/                  # Static assets
├── src/                     # React frontend app
├── package.json             # Frontend scripts/dependencies
├── vite.config.ts           # Frontend build config
└── README.md
```

---

## Local Development

### Frontend
```bash
npm ci
npm run dev
```

### Backend
```bash
cd backend
dotnet run
```

---

## Portfolio Note

Sahtek is intentionally built as a practical, production-oriented health-awareness MVP:  
empathetic UX, culturally aware language support, and deploy-ready architecture for real-world iteration.
