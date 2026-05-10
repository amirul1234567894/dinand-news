# 🚀 Dinand News — Complete Setup Guide (Beginner Friendly)

> **Eta tor jonne ami likhchhi step-by-step**, ekdom screen-by-screen.
> Confusion thakle prottek step e ami likhchhi ki dekhbi, ki click korbi.

---

## 📋 Tor lagbe (before starting)

- 1 ta **GitHub account** (free) → [github.com](https://github.com)
- 1 ta **Vercel account** (free) → [vercel.com](https://vercel.com)
- 1 ta **Supabase account** (free) → [supabase.com](https://supabase.com)
- 1 ta **Groq account** (free) → [console.groq.com](https://console.groq.com)
- 1 ta **n8n account** OR ekta **$6/month VPS** (eta paid, last e add korbi)
- **Domain**: tor `news.autoflowa.in` already kena ache toh? Na thakle Cloudflare/Namecheap theke kine ne.

**Total cost month e**: $0 first month (sob free tier), tarpor n8n hosting cost ($6) — eta o optional, Vercel cron diye o korte parbi.

---

## 🎯 Big Picture (ki kaj hobe)

```
   Step 1: Code download → npm install → local e test
        ↓
   Step 2: Supabase project banai → SQL paste → DB ready
        ↓
   Step 3: Groq API key nai (FREE)
        ↓
   Step 4: GitHub e push → Vercel e import → live website!
        ↓
   Step 5: Custom domain news.autoflowa.in connect
        ↓
   Step 6: n8n setup → daily 5 AM auto-publish shuru
        ↓
   Step 7: Test the API once (manual ingest call)
        ↓
   Step 8: 2-3 weeks wait → AdSense apply
```

---

## 🛠️ STEP 1: Code download + local e test (15 minutes)

### 1.1 Code unzip kor
- Tor `dinand-news.zip` open kor
- Ekta folder e extract kor (jeman `Desktop/dinand-news/`)

### 1.2 Node.js install kor (jodi nei)
- [nodejs.org](https://nodejs.org) e ja → **LTS version** (20 ba 22) download kor
- Install kor (default settings)
- Terminal/CMD open kore check kor: `node -v` → `v20.x.x` ba `v22.x.x` dekhabe

### 1.3 Project install kor
Terminal e jaa project folder e:

**Windows:**
```cmd
cd Desktop\dinand-news
npm install
```

**Mac/Linux:**
```bash
cd ~/Desktop/dinand-news
npm install
```

Eta 2-3 minutes lagbe. Lots of packages download hobe.

### 1.4 `.env.local` file banao
- `.env.example` file ta copy kor
- Rename kor: **`.env.local`** (note: dot diye shuru, file extension nei)
- Khol kor — niche steps e ki ki value bharbi seita bolchhi.

### 1.5 First time run
```bash
npm run dev
```

Browser e jaa: **http://localhost:3000**

> ❗ Eta automatically `/en` e redirect korbe → tui dekhbi homepage. Tobe articles thakbe na karon Supabase set up nei. Ekta empty page dekhbi "No articles published yet" message diye. Eta normal — Step 2 e fix hobe.

**Stop the dev server**: Terminal e `Ctrl + C` chap.

---

## 🗄️ STEP 2: Supabase Setup (10 minutes)

### 2.1 Project banao
1. [supabase.com/dashboard](https://supabase.com/dashboard) e login kor
2. Click **"New Project"**
3. Fill:
   - **Project name**: `dinand-news`
   - **Database Password**: ekta strong password de (save kore rakh)
   - **Region**: `Mumbai (ap-south-1)` — India te fastest
   - **Pricing Plan**: **Free**
4. Click **"Create new project"**
5. ~2 minutes wait kor — provisioning

### 2.2 SQL Schema paste kor
1. Left sidebar e **"SQL Editor"** click kor
2. Top right e **"+ New query"** click
3. `dinand-news/supabase/migrations/001_initial_schema.sql` file open kor (text editor e)
4. **Sob content copy** kor
5. SQL Editor e paste kor
6. Bottom right e **"Run"** click (ba Ctrl+Enter)
7. Success message ashbe → 9 categories + 10 sources insert hoye gechhe!

> ❗ Verify: Left sidebar **"Table Editor"** click → Tui dekhbi `articles`, `categories`, `sources`, `article_translations` etc tables.

### 2.3 API Keys collect kor
1. Left sidebar **"Project Settings"** (gear icon, niche)
2. Click **"API"**
3. Copy these 3 things:

| What | Where | Paste in `.env.local` as |
|---|---|---|
| **Project URL** | Top of API page | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** key | "Project API keys" section | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role secret** key | Same section, "Reveal" click korte hobe | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **service_role** key SECRET — never share, never push to GitHub.

---

## 🤖 STEP 3: Groq API Key (FREE, 2 minutes)

1. [console.groq.com](https://console.groq.com) → Sign up (Google/GitHub login fastest)
2. Left sidebar **"API Keys"**
3. Click **"Create API Key"**
4. Name: `dinand-news`
5. Copy the key (eta only ekbar dekhabe — save kore rakh!)
6. `.env.local` e paste kor: `GROQ_API_KEY=gsk_...`

---

## 🔐 STEP 4: Generate Ingest Secret (1 minute)

Eta ekta random string banate hobe — n8n aar tor API ke connect korte.

**Mac/Linux:**
```bash
openssl rand -hex 32
```

**Windows (PowerShell):**
```powershell
[System.BitConverter]::ToString((1..32 | ForEach-Object {Get-Random -Max 256})).Replace("-","").ToLower()
```

**Easiest (browser):** [random.org/strings](https://www.random.org/strings/?num=1&len=64&digits=on&loweralpha=on&unique=on&format=html&rnd=new) → 64 char string copy kor

Output ekta long string hobe like `a3f4b9c2d8...64char total`

`.env.local` e paste kor:
```
INGEST_API_SECRET=a3f4b9c2d8e1f5a7b9c2d8e1f5a7b9c2d8e1f5a7b9c2d8e1f5a7b9c2d8e1f5a7
```

---

## ✅ Step 1-4 Final Check

Tor `.env.local` file ekhon emon dekhabe:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Dinand News

NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

GROQ_API_KEY=gsk_xyz123...

INGEST_API_SECRET=a3f4b9c2d8...

ADMIN_EMAIL=admin@autoflowa.in
```

**Test again locally:**
```bash
npm run dev
```

Open http://localhost:3000 → Should load without errors. Articles thakbe na, but Supabase connect hoyeche.

---

## 🧪 STEP 5: Test the Ingest API (5 minutes — IMPORTANT!)

Production e jawar age dekhi automation kaj korche kina.

### 5.1 Test korar dui way ache:

**Way A: cURL (terminal)**
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer YOUR_INGEST_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "source_url": "https://example.com/test-article-1",
    "source_name": "Test Source",
    "category_slug": "tech",
    "facts": "Google announced a new AI model called Gemini 3 today. The model can process text, images, and video simultaneously. Initial benchmarks show it outperforms previous models by 30 percent on coding tasks. The model will be available to developers next month through Google Cloud APIs. Pricing has not yet been disclosed but is expected to be competitive with OpenAI offerings."
  }'
```

**Way B: Postman/Hoppscotch (easier UI)**
1. [hoppscotch.io](https://hoppscotch.io) khol (free, online)
2. Method: **POST**
3. URL: `http://localhost:3000/api/ingest`
4. Headers tab:
   - `Authorization` = `Bearer YOUR_INGEST_SECRET`
   - `Content-Type` = `application/json`
5. Body tab → JSON → paste:
   ```json
   {
     "source_url": "https://example.com/test-1",
     "source_name": "Test Source",
     "category_slug": "tech",
     "facts": "Google announced a new AI model called Gemini 3 today. The model processes text, images, and video. Benchmarks show 30% improvement on coding tasks. Available next month via Google Cloud APIs. Pricing competitive with OpenAI."
   }
   ```
6. Click **Send**

### 5.2 What to expect:
- Wait ~30-60 seconds (Groq generation + 5 translations)
- Response:
  ```json
  {
    "ok": true,
    "status": "published",
    "article_id": "uuid-here",
    "slug": "google-announces-gemini-3-ai-model",
    "url": "http://localhost:3000/en/article/google-announces-gemini-3-ai-model",
    "plagiarism_score": "12.3",
    "translations": [
      { "locale": "hi", "ok": true },
      { "locale": "bn", "ok": true },
      { "locale": "ta", "ok": true },
      { "locale": "te", "ok": true },
      { "locale": "mr", "ok": true }
    ]
  }
  ```

### 5.3 Verify it worked:
1. Open browser: `http://localhost:3000/en` → Tor article hero te dekhabe!
2. Click on article → Full article load hobe
3. Top right e language switcher → `हिन्दी` click → Hindi version
4. Same article 6 languages e paben!

> 🎉 **Eta jodi kaj kore, tor automation pipeline working!**

### 5.4 Common errors:

| Error | Reason | Fix |
|---|---|---|
| `401 Unauthorized` | INGEST_API_SECRET mismatch | Check tor `.env.local` aar curl/postman header same kina |
| `400 Invalid payload` | Missing field | `facts` minimum 50 chars dorkar |
| `500 AI generation failed` | Groq API key wrong | Check `GROQ_API_KEY` |
| `422 Plagiarism too high` | LLM ekta source er wording copy korechhe | Test data different rakh |
| Long timeout (>2 min) | Groq slow ba network | Restart dev server, retry |

---

## 🚢 STEP 6: GitHub + Vercel Deploy (15 minutes)

### 6.1 GitHub Repository banao
1. [github.com/new](https://github.com/new) e ja
2. Repository name: `dinand-news`
3. **Private** select kor (recommended — code public na korbi)
4. Initialize with README **uncheck** (already ache)
5. Click **Create repository**

### 6.2 Code push kor
Terminal e tor project folder e:

```bash
cd dinand-news

# Git init
git init
git add .
git commit -m "Initial commit"

# GitHub e connect
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dinand-news.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with tor actual GitHub username.

> ❗ Push korar somoy GitHub credentials chaibe. Pasword diye kaj nei — **Personal Access Token** lagbe:
> 1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
> 2. Scopes: `repo` check kor
> 3. Token copy kor → password jaaygay paste kor

### 6.3 Vercel e deploy
1. [vercel.com/new](https://vercel.com/new) e ja
2. **Import Git Repository** → tor `dinand-news` repo select kor
3. **Configure Project**:
   - Framework Preset: `Next.js` (auto-detect)
   - Root Directory: leave default
   - Build Command: leave default (`npm run build`)
4. **Environment Variables** — eta MOST IMPORTANT step:

Click "Add" for each:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://news.autoflowa.in` |
| `NEXT_PUBLIC_SITE_NAME` | `Dinand News` |
| `NEXT_PUBLIC_SUPABASE_URL` | tor supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tor anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | tor service role key |
| `GROQ_API_KEY` | tor Groq key |
| `INGEST_API_SECRET` | tor random string |

5. Click **Deploy** → ~2 minutes wait

### 6.4 First deploy successful?
Vercel ekta URL dibe like `dinand-news-xyz.vercel.app`. Open kor → tor site live!

---

## 🌐 STEP 7: Custom Domain (`news.autoflowa.in`) — 10 minutes

### 7.1 Vercel e domain add kor
1. Vercel project → **Settings** → **Domains**
2. Type kor: `news.autoflowa.in`
3. Click **Add**
4. Vercel ekta CNAME record dekhabe like:
   ```
   Type: CNAME
   Name: news
   Value: cname.vercel-dns.com
   ```

### 7.2 DNS provider e CNAME add kor
- Tor `autoflowa.in` jekhane hosted (Cloudflare? Namecheap? GoDaddy?), DNS settings e jaa
- New record:
  - **Type**: CNAME
  - **Name**: `news`
  - **Value/Target**: `cname.vercel-dns.com`
  - **Proxy** (jodi Cloudflare): **OFF** (gray cloud) — important!
  - **TTL**: Auto/3600
- Save

### 7.3 Wait for SSL
- Vercel auto SSL issue korbe
- 1-10 minutes lagbe
- Tarpor **https://news.autoflowa.in** e visit kor → site live with SSL!

### 7.4 SITE_URL update kor
Ekhon Vercel env vars e:
- Edit `NEXT_PUBLIC_SITE_URL` → `https://news.autoflowa.in`
- Redeploy: Vercel → Deployments → latest → ⋯ → Redeploy

---

## 🤖 STEP 8: n8n Setup (Choose ONE option)

### Option A: n8n Cloud (Easy, $20/month)
1. [n8n.cloud](https://n8n.cloud) → Start free trial → Sign up
2. Create new workflow → **Import from File** → `n8n/dinand-news-workflow.json` upload kor
3. **Settings** → **Variables** → Add:
   - Name: `INGEST_API_SECRET`
   - Value: (same value as Vercel)
4. **CRITICAL: Edit the workflow** — find the "Set Config" node, update `ingest_api_url` to `https://news.autoflowa.in/api/ingest`
5. Click **Test workflow** to run once manually
6. Toggle **Active** ON

### Option B: Self-host on a VPS ($6/month, more work)
1. **Buy a VPS**: [hetzner.com](https://www.hetzner.com/cloud) or [digitalocean.com](https://digitalocean.com)
   - Cheapest: Hetzner CPX11 = €4.51/month (~$5)
2. SSH into your VPS:
   ```bash
   ssh root@YOUR_VPS_IP
   ```
3. Install Docker:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
4. Run n8n:
   ```bash
   docker run -d --restart unless-stopped \
     --name n8n \
     -p 5678:5678 \
     -e GENERIC_TIMEZONE="Asia/Kolkata" \
     -e TZ="Asia/Kolkata" \
     -e N8N_BASIC_AUTH_ACTIVE=true \
     -e N8N_BASIC_AUTH_USER=admin \
     -e N8N_BASIC_AUTH_PASSWORD=YOUR_PASSWORD \
     -e INGEST_API_SECRET=YOUR_SECRET \
     -v n8n_data:/home/node/.n8n \
     docker.n8n.io/n8nio/n8n
   ```
5. Open `http://YOUR_VPS_IP:5678` → login (admin/YOUR_PASSWORD)
6. Import workflow from JSON, activate

### Option C: Vercel Cron (Free, simpler) — **RECOMMENDED FOR YOU**

Eta amar suggestion — n8n na use kore Vercel er builtin cron use kor. Onek easy.

Make a new file: `src/app/api/cron/daily/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const SOURCES = [
  { name: 'PIB India', url: 'https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', category: 'india' },
  { name: 'Google Blog', url: 'https://blog.google/rss/', category: 'tech' },
  { name: 'OpenAI News', url: 'https://openai.com/news/rss.xml', category: 'tech' },
  { name: 'Microsoft News', url: 'https://news.microsoft.com/feed/', category: 'tech' },
  { name: 'AWS Blog', url: 'https://aws.amazon.com/blogs/aws/feed/', category: 'tech' },
  { name: 'Cloudflare Blog', url: 'https://blog.cloudflare.com/rss/', category: 'tech' },
];

export async function GET(req: NextRequest) {
  // Vercel cron auth check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parser = new Parser();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const results = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items.slice(0, 3);

      for (const item of items) {
        const facts = (item.contentSnippet || item.content || item.title || '').slice(0, 4000);
        if (facts.length < 50) continue;

        const res = await fetch(`${baseUrl}/api/ingest`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.INGEST_API_SECRET}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source_url: item.link!,
            source_name: source.name,
            source_published_at: item.isoDate || item.pubDate,
            category_slug: source.category,
            facts,
          }),
        });
        results.push({ source: source.name, status: res.status, slug: (await res.json()).slug });
      }
    } catch (err: any) {
      results.push({ source: source.name, error: err.message });
    }
  }

  return NextResponse.json({ ok: true, results });
}
```

Add `vercel.json` to project root:
```json
{
  "crons": [
    { "path": "/api/cron/daily", "schedule": "30 23 * * *" }
  ]
}
```

Add env var in Vercel: `CRON_SECRET` = (same as INGEST_API_SECRET ba ekta different random string)

Push to GitHub → Vercel auto-deploys → Done. Cron runs daily at 5 AM IST.

> Vercel free tier supports daily cron — perfect for you.

---

## 📊 STEP 9: Search Console + Sitemap (5 minutes)

1. [search.google.com/search-console](https://search.google.com/search-console)
2. **Add property** → **URL prefix** → `https://news.autoflowa.in`
3. Verify via DNS TXT record (Vercel handles cleanly) ba HTML file
4. Once verified → **Sitemaps** in left menu
5. Add sitemap: `sitemap.xml`
6. Submit

---

## 🎉 STEP 10: 2-3 Weeks Wait, Then AdSense

- Daily check kor: articles publish hochche kina (`/api/ingest` logs in Supabase `ingestion_log` table)
- Total 30-50 articles publish hole, AdSense apply kor
- See `docs/ADSENSE_CHECKLIST.md` for full pre-application checklist

---

## ❓ Common Questions / Confusions

### Q: "npm install" e error ashche?
A: Node.js version check kor (`node -v`). 18+ thaktei hobe. Lower hole upgrade kor.

### Q: Supabase SQL run e error?
A: Pure file ta paste korte hobe — partial paste hole `extension` create faill ashbe. Re-run from start.

### Q: Local e curl test e timeout ashche?
A: Groq free tier slow hote pare peak time e. Wait 1 min, retry. Persistent issue hole API key check kor.

### Q: "Article published" but `/en` e show korche na?
A: ISR cache. 10 min wait kor, ba Vercel deployment redeploy kor.

### Q: Vercel env var add korechhi but kaj korche na?
A: Env var change kore **redeploy** kortei hobe. Old deployment use korbe old vars.

### Q: Cookie banner sob page e dekhabe?
A: Ha. Browser e `localStorage` clear kore test korte parish: DevTools → Application → Local Storage → Clear.

### Q: Article hindi/bangla version e dekhachhe na, but English e ache?
A: Translation pipeline failed during ingest. Check Supabase `article_translations` table — `locale='hi'` row exists kina.

### Q: AdSense apply kortechhi but reject hochche?
A: 99% time eta thin content er karon. **More articles publish kor** + **2 more weeks wait** + retry. AdSense reapply 30 days lock korbe rejection er por.

---

## 🆘 Need Help?

Eta first time deployment hole kichu jinish miss hote pare. Atleast 2-3 din lagbe sob smooth korte. Patience rakh!

Email: editorial@autoflowa.in (jodi tor own domain handle thake)
GitHub Issues: tor own private repo e create kor

---

🎯 **Final Goal**: 30 days e site stable + 50+ articles + AdSense approved → daily passive income shuru!

🇮🇳 Made with ❤️ in India · Best of luck bhai!
