# PhishGuard AI 🛡️

> **Next-Generation Defensive Security Scanner & Threat Intelligence Platform**  
> AI-powered detection for phishing messages, deceptive URLs, and malicious emails with explainable evidence and actionable remediation steps.

---

## 📁 Monorepo Structure

This repository combines both the **Frontend UI** and **Backend Service** for PhishGuard AI:

```
PHISHGUARD-AI/
├── frontend/                  # React + Vite Interactive Frontend Application
│   ├── public/                # Static assets
│   ├── src/                   # React components, pages, contexts, services, hooks
│   │   ├── api/               # API client & mock engine
│   │   ├── components/        # Reusable UI components & instrument panels
│   │   ├── contexts/          # Auth, scan, and notification state
│   │   ├── layouts/           # App and Auth layouts
│   │   └── pages/             # Landing, Scanner, Dashboard, Admin, Education
│   ├── .env.example           # Frontend environment variable template
│   ├── package.json           # Node dependencies and scripts
│   └── vite.config.js         # Vite configuration & dev proxy
│
├── backend/                   # Django REST Framework + Google Gemini Backend Service
│   ├── accounts/              # User models, authentication & JWT endpoints
│   ├── config/                # Django project settings & URL routing
│   ├── dashboard/             # Analytics, aggregation & admin telemetry
│   ├── scanner/               # Multi-signal detection engine (Rules, URL heuristics, Gemini AI)
│   ├── tests/                 # Automated test suite (31 unit & integration tests)
│   ├── .env.example           # Backend environment variable template
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
│
├── .gitignore                 # Unified gitignore for Node & Python environments
└── README.md                  # Master documentation
```

---

## ⚡ Quick Start

### 1. Backend Setup (Django + DRF)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run database migrations
python manage.py migrate

# Seed demo user and 14 realistic sample scans
python manage.py seed_demo

# (Optional) Verify AI Analyzer connectivity with Gemini API
python manage.py check_ai

# Start Django backend server
python manage.py runserver 8000
```

- **Backend API Base**: `http://127.0.0.1:8000/api/v1/`
- **Django Admin Portal**: `http://127.0.0.1:8000/admin/`

---

### 2. Frontend Setup (React + Vite)

```bash
# In a new terminal window, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start Vite development server
npm run dev
```

- **Frontend Application**: `http://localhost:5173`

> **Note on Standalone vs Live Mode**:
> In `frontend/.env.local`:
> - Set `VITE_USE_MOCK_API=false` to connect to the live Django backend at `http://localhost:8000/api/v1`.
> - Set `VITE_USE_MOCK_API=true` to run 100% standalone offline with browser-based mock intelligence and deterministic hackathon demo fixtures.

---

## 🛡️ Core Architecture & Detection Pipeline

```
                               ┌─────────────────────────────┐
                               │     User Input Submission   │
                               │  (Message / URL / Email)    │
                               └──────────────┬──────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
          ┌──────────────────────┐┌──────────────────────┐┌──────────────────────┐
          │  Deterministic Rule  ││   Zero-Network URL   ││  Google Gemini AI    │
          │     Engine Catalogue ││  Heuristic Analyzer  ││   Reasoning Engine   │
          └──────────┬───────────┘└──────────┬───────────┘└──────────┬───────────┘
                     │                       │                       │
                     └───────────────────────┼───────────────────────┘
                                             ▼
                               ┌─────────────────────────────┐
                               │   Risk Calibration Engine   │
                               │ (Decisive Floors & Ceilings)│
                               └─────────────┬───────────────┘
                                             ▼
                               ┌─────────────────────────────┐
                               │  Final Explainable Score    │
                               │ (0-100 Meter + Indicators + │
                               │  Prioritized Action Steps)  │
                               └─────────────────────────────┘
```

---

## 🧪 Testing & Validation

### Backend Automated Test Suite
```bash
cd backend
python manage.py test
```
Runs comprehensive test suites validating:
- Rule catalogue matching & authentic OTP false-positive avoidance
- URL heuristics without external network leakages
- Risk combination, decisive floors & boundaries
- AI JSON validation, timeouts & prompt injection defense
- End-to-end authentication, multi-tenant data isolation, and dashboard metrics

### Frontend Linting & Build Check
```bash
cd frontend
npm run build
```

---

## 🔐 Credentials & Demo Accounts

### Default Demo Accounts (after running `python manage.py seed_demo` or in mock mode)
- **User Account**: `aisha@example.com` / `DemoPass123!`
- **Admin Account**: `admin@phishguard.ai` / `AdminPass123!`

---

## 📄 License & Attribution

Developed with ❤️ for defensive cybersecurity awareness and threat intelligence.
