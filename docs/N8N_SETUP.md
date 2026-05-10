# 🤖 n8n Workflow Setup Guide

This workflow automates the entire daily publishing pipeline.

## What it does

```
5:00 AM IST (cron)
    ↓
Read 9 whitelisted RSS sources (PIB, ISRO, Google Blog, OpenAI, etc.)
    ↓
Parse top 3 latest items from each
    ↓
Filter out items with < 50 chars of content
    ↓
For each item: POST to /api/ingest with bearer auth
    ↓
The Next.js API:
  - Dedupes by source_url
  - Sends extracted facts to Groq LLM
  - Generates fresh English article (500-700 words)
  - Plagiarism heuristic check (rejects > 30% similarity)
  - Translates to Hindi, Bangla, Tamil, Telugu, Marathi (parallel)
  - Inserts to Supabase
  - Returns success/duplicate/rejected status
    ↓
Aggregate results → log
```

---

## Setup

### 1. Import the workflow
- Open your n8n instance
- Workflows → Import from File → upload `dinand-news-workflow.json`

### 2. Add the secret
- Settings → Variables (or env vars on self-hosted)
- Add: `INGEST_API_SECRET` = same value as in your Vercel deployment

### 3. Adjust the cron (if needed)
- Default: `30 23 * * *` UTC = **5:00 AM IST**
- To change: edit the "Daily 5 AM IST" node

### 4. Test once manually
- Click "Execute Workflow" button on the trigger
- Watch the execution flow
- Open your Dinand News site → you should see new articles

### 5. Activate
- Toggle **Active** in the top-right of the workflow
- It will now run daily automatically

---

## Customizing Sources

Edit the **"Source Whitelist"** code node in n8n. Add new sources to the array:

```javascript
const sources = [
  { name: 'New Source Name', url: 'https://...rss.xml', category: 'tech' },
  // ...
];
```

**Categories must match** what's in Supabase: `breaking`, `india`, `tech`, `business`, `startup`, `auto`, `sports`, `entertainment`.

---

## Adding Sources to Supabase

Each new source must also be added to the `sources` table in Supabase:

```sql
INSERT INTO sources (name, url, type, category) VALUES
  ('Reddit r/india', 'https://www.reddit.com/r/india/.rss', 'rss', 'india');
```

---

## Monitoring

### In n8n
- Executions tab shows daily runs with status
- Failed executions auto-retry (configurable)

### In Supabase
- Table `ingestion_log` tracks every fetch attempt
- Filter `status = 'success'` for published, `status = 'rejected'` for plagiarism failures

### Set up alerts (optional)
Add a final node in the workflow → Slack / Email / Telegram → notify if total published < 5 per day.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| 401 Unauthorized | INGEST_API_SECRET mismatch | Make sure n8n env var matches Vercel env var |
| 400 Invalid payload | Bad RSS data | Check the failing item's facts content |
| 422 Plagiarism too high | LLM copied source wording | Tweak the system prompt in `lib/groq.ts` |
| Translations missing | Groq API rate limit | Free tier ~30 req/min — add delay or upgrade |
| No articles publishing | Cron not active | Check workflow is toggled Active |
