README.md (root)

# 🎥 LiveMeet Platform

A production-grade, AI-powered video conferencing platform built with FastAPI, React, LiveKit, and OpenAI.

## ✨ Features

- 🎥 **HD Video Calls** — Up to 50 participants with WebRTC
- 🤖 **AI Copilot** — Real-time Q&A, code generation, meeting summaries
- 🎨 **Virtual Backgrounds** — Powered by MediaPipe
- 🎨 **Collaborative Whiteboard** — Using Tldraw
- 🔇 **Noise Suppression** — Browser-side audio filtering
- 📁 **File Sharing** — Upload and share files in meetings
- 🎬 **URL Video Sync** — Watch YouTube together
- 💬 **Real-time Chat** — With AI assistant
- 🖐️ **Reactions & Hand Raise**
- 🎙️ **Server-side Recording** — With AI summaries
- 🔐 **Security** — JWT, passwords, waiting room, host controls
- 🌓 **Dark/Light Theme**

## 🏗️ Tech Stack

**Backend:** FastAPI • PostgreSQL • Redis • LiveKit • OpenAI
**Frontend:** React + Vite • Tailwind CSS • LiveKit React Components • Tldraw • MediaPipe

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- OpenAI API key

### Setup

1. **Clone & configure:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   Run:docker compose up --build
   ```

Open:
Frontend: http://localhost:5173
Backend API: http://localhost:8000
API Docs: http://localhost:8000/api/docs
📁 Project Structure
live-meet-platform/
├── backend/ # FastAPI application
│ ├── app/
│ │ ├── config/ # Settings
│ │ ├── models/ # SQLAlchemy models
│ │ ├── schemas/ # Pydantic schemas
│ │ ├── routes/ # API endpoints
│ │ ├── services/ # Business logic
│ │ ├── utils/ # Utilities
│ │ ├── middleware/# Auth, logging, rate-limit
│ │ └── websocket/ # Real-time handlers
│ ├── alembic/ # DB migrations
│ └── tests/ # Pytest tests
├── frontend/ # React application
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── hooks/
│ └── services/
├── docker-compose.yml
└── .env

📖 Documentation
docs/api.md — API endpoints
docs/architecture.md — System design
docs/setup.md — Detailed setup
🧪 Testing

# Backend tests

docker compose exec backend pytest

# Frontend build

cd frontend && npm run build

📝 License
MIT

👥 Authors
Built for a college project / mentor demo.

---
