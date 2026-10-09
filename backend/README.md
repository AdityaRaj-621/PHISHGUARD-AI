# PhishGuard AI — Backend Service

A security intelligence backend for phishing, fraudulent message, and malicious link detection. Built with **Django 5.2**, **Django REST Framework**, **SimpleJWT**, and **Google Gemini AI**.

---

## Key Features

- **Multi-Signal Detection Pipeline**:
  - **Deterministic Rule Engine**: Zero-network regex/keyword catalogue with anti-false-positive guards for authentic bank notifications.
  - **URL Analyzer**: Heuristic string analysis (Punycode, lookalike domain distance, IP hosts, `@` manipulation, high-risk keywords) without making outbound HTTP requests to user-supplied targets.
  - **AI Analyzer (Gemini)**: Defensive reasoning engine with prompt-injection isolation, certainty sanitization, and graceful failure fallback.
  - **Risk Calibration Engine**: Score aggregation with decisive floors (e.g. lookalike domains, credential harvesting) and thin-evidence ceilings.
  - **Deterministic Recommendations**: Actionable safety guidance prioritized by risk severity.
- **Explainable Results**: Every scan returns a structured breakdown of rule hits, URL parameters, AI signals, and applied floors.
- **Enterprise Isolation & Data Minimization**: Strict multi-tenant data boundaries returning 404s for cross-user attempts; sanitized logs without raw content or credentials.
- **Full Dashboard Analytics**: Aggregated risk distributions, continuous 14-day zero-filled activity charts, awareness metrics, and admin stats.

---

## Quickstart

### 1. Setup Environment
```bash
# Clone the repository and enter the directory
cd "PHISHGUARD(AI) BACKEND"

# Create and activate virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure keys if needed:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | Preconfigured for development |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:5173,http://127.0.0.1:5173` |
| `GEMINI_API_KEY` | Google Gemini API key | Blank (Runs in `rules_only` mode if empty) |
| `AI_MODEL` | Gemini model name | `gemini-2.0-flash` |
| `AI_ENABLED` | Enable LLM reasoning | `True` (only active when API key is present) |
| `AI_TIMEOUT_SECONDS` | Maximum timeout for LLM calls | `12` |

### 3. Database & Seeding
```bash
# Run migrations
python manage.py migrate

# Seed demo user & 14 realistic backdated scans
python manage.py seed_demo

# Check AI status
python manage.py check_ai
```

### 4. Run Development Server
```bash
python manage.py runserver 8000
```
API Root: `http://127.0.0.1:8000/api/v1/`
Admin Portal: `http://127.0.0.1:8000/admin/`

---

## Running the Automated Test Suite

```bash
python manage.py test
```
Runs 31 comprehensive unit and integration tests covering:
- Rule catalogue matching & authentic OTP false-positive avoidance
- URL heuristics & zero-network-call verification
- Risk combination, decisive floors & boundary levels
- AI JSON validation, timeouts & prompt injection defense
- End-to-end authentication, scanning, multi-user isolation, and dashboard metrics.

---

## API Overview

### Authentication (`/api/v1/auth/`)
- `POST /api/v1/auth/register/` — Register and receive JWT access + refresh tokens.
- `POST /api/v1/auth/login/` — Login with username or email.
- `POST /api/v1/auth/token/refresh/` — Refresh access token.
- `GET/PATCH /api/v1/auth/profile/` — User profile and awareness score.
- `POST /api/v1/auth/change-password/` — Change password.
- `POST /api/v1/auth/education-topic/` — Increment completed education topics.

### Scans (`/api/v1/scans/`)
- `POST /api/v1/scans/message/` — Scan SMS/Chat message content.
- `POST /api/v1/scans/url/` — Scan suspicious web link.
- `POST /api/v1/scans/email/` — Scan email with subject, sender, and body.
- `GET /api/v1/scans/` — Paginated history with filtering (`type`, `risk_level`, `threat_type`, `search`, `ordering`, `date_from`, `date_to`).
- `GET /api/v1/scans/<id>/` — Canonical scan result with indicators, recommendations, and AI analysis.
- `DELETE /api/v1/scans/<id>/` — Delete scan record.

### Dashboard & Analytics (`/api/v1/dashboard/`)
- `GET /api/v1/dashboard/` — User dashboard metrics (risk distribution, awareness score, 14-day continuous scan activity, recent scans, alerts).
- `GET /api/v1/admin/stats/` — System-wide aggregate statistics (Admin only).
