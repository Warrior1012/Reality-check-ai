# Reality Check AI

An AI-powered misinformation and bias detection tool. Analyze text **and images** (news articles, WhatsApp forwards, tweets, or screenshots) and get a deep breakdown of credibility, bias, and manipulation tactics.

---

## 🚀 Features

* **Truth Score** — 0 to 100% credibility rating with a visual indicator
* **Bias Detection** — identifies political, brand, or agenda-driven bias
* **Emotional Manipulation Detector** — flags fear tactics, urgency triggers, and misleading tone
* **Claim-by-Claim Breakdown** — extracts factual claims and verifies each one
* **Flagged Keywords** — highlights manipulative or misleading phrases
* **Plain English Summary** — simplified explanation of results

### 🖼️ Image Analysis (NEW)

* Upload images or screenshots (e.g., WhatsApp forwards, news posts)
* Extracts text using OCR
* Runs the same misinformation and bias detection pipeline on extracted content

---

## 🧠 Tech Stack

| Layer         | Technology                                  |
| ------------- | ------------------------------------------- |
| Frontend      | React 19, Vite, TypeScript, Tailwind CSS v4 |
| UI Components | shadcn/ui, Radix UI, Lucide React           |
| State / API   | TanStack React Query, Wouter                |
| Backend       | Node.js 24, Express 5, TypeScript           |
| AI            | Google Gemini (`gemini-3-flash-preview`)    |
| Database      | PostgreSQL (Drizzle ORM)                    |
| Validation    | Zod, OpenAPI 3.1, Orval                     |
| Monorepo      | pnpm workspaces                             |

---

## 🗂️ Project Structure

```
├── artifacts/
│   ├── api-server/        # Backend (Express API)
│   │   └── src/routes/
│   │       └── analyze.ts
│   └── reality-check/     # Frontend (React app)
│       └── src/pages/
│           └── home.tsx
├── lib/
│   ├── api-spec/
│   ├── api-client-react/
│   ├── api-zod/
│   ├── db/                # Database schema & ORM (Drizzle + PostgreSQL)
│   └── integrations-gemini-ai/
```

---

## ⚙️ Getting Started

### Prerequisites

* Node.js 24+
* pnpm 10+
* PostgreSQL database
* Gemini API access

---

### Install

```bash
pnpm install
```

---

### Development

```bash
# Start backend
pnpm --filter @workspace/api-server run dev

# Start frontend
pnpm --filter @workspace/reality-check run dev
```

---

### Build

```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/reality-check run build
```

---

## 📡 API Reference

### `POST /api/analyze`

Analyzes text (or extracted text from images) for misinformation and bias.

#### Request

```json
{
  "content": "Text to analyze"
}
```

#### Response

```json
{
  "truthScore": 12,
  "truthLabel": "likely-false",
  "bias": "fear-mongering",
  "manipulationLevel": "high",
  "claims": [],
  "simpleSummary": "This content is misleading."
}
```

---

## 🗄️ Database Integration

* Stores analysis results for future reference
* Enables history tracking and re-analysis
* Built using **PostgreSQL + Drizzle ORM**

---

## 🔐 Environment Variables

| Variable                         | Description                  |
| -------------------------------- | ---------------------------- |
| `AI_INTEGRATIONS_GEMINI_API_KEY` | Gemini API key               |
| `DATABASE_URL`                   | PostgreSQL connection string |
| `PORT`                           | Server port                  |

---
## 🚀 Live Demo
[reality-check-os.replit.app](https://reality-check-os.replit.app)

---
## 📜 License

MIT
