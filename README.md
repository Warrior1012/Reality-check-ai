# Reality Check AI

An AI-powered misinformation and bias detection tool. Paste any text — news article, WhatsApp forward, tweet, or reel caption — and get a forensic-level breakdown of its truthfulness, bias, and manipulation tactics.

## Features

- **Truth Score** — 0 to 100% credibility rating with a color-coded gauge
- **Bias Detection** — identifies political, brand, or agenda-driven bias
- **Emotional Manipulation Detector** — flags fear words, false urgency, anger triggers
- **Claim-by-Claim Breakdown** — extracts every factual claim and verdicts each one
- **Flagged Keywords** — highlights the exact manipulative phrases used
- **Plain English Summary** — explains findings in simple terms

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4 |
| UI Components | shadcn/ui, Radix UI, Lucide React |
| State / API | TanStack React Query, Wouter |
| Backend | Node.js 24, Express 5, TypeScript |
| AI | Google Gemini (`gemini-3-flash-preview`) |
| Validation | Zod, OpenAPI 3.1, Orval codegen |
| Monorepo | pnpm workspaces |

## Project Structure

```
├── artifacts/
│   ├── api-server/        # Express 5 backend
│   │   └── src/routes/
│   │       └── analyze.ts # POST /api/analyze — Gemini AI route
│   └── reality-check/     # React + Vite frontend
│       └── src/pages/
│           └── home.tsx   # Main analyzer UI
├── lib/
│   ├── api-spec/          # OpenAPI contract (source of truth)
│   ├── api-client-react/  # Generated React Query hooks
│   ├── api-zod/           # Generated Zod validation schemas
│   ├── db/                # Drizzle ORM + PostgreSQL schema
│   └── integrations-gemini-ai/  # Gemini AI client
```

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+
- Gemini AI Integration (auto-provisioned on Replit)

### Install

```bash
pnpm install
```

### Run codegen (after any OpenAPI spec change)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Development

```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend
pnpm --filter @workspace/reality-check run dev
```

### Typecheck

```bash
pnpm run typecheck
```

### Build

```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/reality-check run build
```

## API Reference

### `POST /api/analyze`

Analyzes text content for misinformation and bias.

**Request body:**
```json
{
  "content": "Text to analyze (max 10,000 characters)"
}
```

**Response:**
```json
{
  "truthScore": 12,
  "truthLabel": "likely-false",
  "bias": "fear-mongering",
  "biasExplanation": "Uses alarmist language without citing official sources.",
  "manipulationLevel": "high",
  "manipulationDetails": [
    {
      "type": "False urgency",
      "examples": ["Kal se internet band"],
      "severity": "high"
    }
  ],
  "claims": [
    {
      "claim": "Internet will be shut down across India.",
      "verdict": "false",
      "reason": "No official notification or credible source confirms this."
    }
  ],
  "simpleSummary": "This message is fake and designed to cause panic.",
  "highlightedWords": ["emergency", "internet band", "sarkar ne kaha"]
}
```

## Environment Variables

| Variable | Description |
|---|---|
| `AI_INTEGRATIONS_GEMINI_BASE_URL` | Gemini proxy URL  |
| `AI_INTEGRATIONS_GEMINI_API_KEY` | Gemini API key  |
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (auto-set) |

## License

MIT
