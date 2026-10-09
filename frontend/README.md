# PhishGuard AI — Frontend Application

> **Defensive-Security Scanner for Messages, URLs, and Emails**  
> Built for hackathon presentation and real-world threat detection comprehension.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build
```

The application will run locally at `http://localhost:5173`.

---

## 🧪 Zero-Backend Standalone Mock Mode

PhishGuard AI runs **100% standalone** with zero backend dependency out of the box using `VITE_USE_MOCK_API=true` in `.env.local`.

- **Demo User Account**: `aisha@example.com` / `DemoPass123!` (or use the one-click demo login buttons on `/login`)
- **Admin Account**: `admin@phishguard.ai` / `AdminPass123!` (grants access to `/admin`)
- **Realistic Dataset**: Pre-seeded with 12 diverse scan fixtures covering all 5 risk levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`, `UNKNOWN`) and all scan vectors (`message`, `url`, `email`).
- **Deterministic Hackathon Demo Scenario**: Pasting the §44 demo message produces the exact canonical **92/100 HIGH Risk Phishing** result with 4 indicators and 4 prioritized action steps.

### Failure Simulation Triggers
To demonstrate error handling live on stage without crashing the system, type these keywords into any scanner:
- `FORCE_ERROR` — Simulates a server 500 error / analysis failure.
- `FORCE_TIMEOUT` — Simulates an engine timeout (>30s) with retry options.
- `FORCE_AI_FAIL` — Simulates an AI analyzer outage while falling back to rule-based analysis.

---

## 🎨 Design & Features

- **3D Interactive Neon Background**: Interactive Three.js WebGL cursor tubes effect on the landing hero with click-to-randomize color palettes.
- **Instrument Panel Design System**: Slate blue app chrome, crisp white sheets, 1px borders, and 4-channel redundant risk encoding (color + icon + text + position/border).
- **Calibrated Risk Meter**: 0–100 horizontal segmented scale with smooth 800ms reveal count-up animations.
- **Explainable Evidence**: Quoted snippets extracted from user submissions.
- **Urgent Action Recommendations**: Prioritized steps ("Don't click", "Never share OTP", "Verify").
- **Interactive Security Education**: 10 comprehensive security guides with "Spot the Scam" practice quizzes.
- **Admin Platform Telemetry**: Aggregate risk distribution, daily scan throughput, and threat category breakdown.

---

## 🔒 Security & Accessibility Discipline

- **Zero Secrets**: No API keys, model provider keys, or tokens in frontend code.
- **Non-Clickable Scanned Links**: User-submitted URLs are rendered safely as monospace text with copy buttons, never as clickable hyperlinks.
- **WCAG AA Compliant**: High-contrast ratios, complete keyboard navigability, screen reader ARIA announcements (`role="status"`, `role="alert"`), and `prefers-reduced-motion` global support.
