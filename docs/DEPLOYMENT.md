# 🚢 Deployment Guide

## Deploy to Vercel (recommended)

### Step 1: Push to GitHub
```bash
cd dinand-news
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dinand-news.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Root directory: leave blank (project root)
5. Build command: `npm run build` (default)
6. Click **Environment Variables** and add ALL of these:

```
NEXT_PUBLIC_SITE_URL=https://news.autoflowa.in
NEXT_PUBLIC_SUPABASE_URL=https://YOUR.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GROQ_API_KEY=gsk_...
INGEST_API_SECRET=your_random_string
```

7. Click **Deploy**.

### Step 3: Custom Domain
1. Vercel project → Settings → Domains
2. Add `news.autoflowa.in`
3. Configure DNS:
   - For subdomain on Cloudflare/Namecheap, add CNAME record:
     ```
     news → cname.vercel-dns.com
     ```
4. Wait for SSL provisioning (auto, ~5 min)

### Step 4: Verify
- Visit `https://news.autoflowa.in/en`
- Check `https://news.autoflowa.in/sitemap.xml`
- Check `https://news.autoflowa.in/robots.txt`
- Check `https://news.autoflowa.in/api/ingest` (should return API doc JSON)

---

## Deploy n8n

### Option A: n8n Cloud (easiest)
1. Sign up at [n8n.cloud](https://n8n.cloud) — paid (~$20/mo for starter)
2. Settings → Variables: add `INGEST_API_SECRET`
3. Workflows → Import from File → upload `n8n/dinand-news-workflow.json`
4. Activate.

### Option B: Self-host on a VPS (Hetzner / DigitalOcean) — cheaper
```bash
# On a fresh Ubuntu 22.04 droplet ($6/mo)
docker run -d --restart unless-stopped \
  --name n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE="Asia/Kolkata" \
  -e TZ="Asia/Kolkata" \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your_password \
  -e INGEST_API_SECRET=same_as_vercel \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Then access `http://YOUR_VPS_IP:5678`, login, import the workflow.

### Option C: Use Vercel Cron (alternative — no n8n)
Add a `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/daily-fetch", "schedule": "30 23 * * *" }
  ]
}
```
And create `/api/cron/daily-fetch` that does what the n8n workflow does. Tradeoff: no visual debugging, harder to maintain.

---

## Post-Deploy Checklist

- [ ] Site loads at custom domain with SSL
- [ ] All 6 language routes work (`/en`, `/hi`, `/bn`, `/ta`, `/te`, `/mr`)
- [ ] Footer links go to legal pages
- [ ] Cookie banner appears on first visit
- [ ] `sitemap.xml` returns valid XML
- [ ] `/api/ingest` returns API docs on GET
- [ ] n8n workflow tested manually (run once, see article published)
- [ ] Wait 24h, check that 5 AM IST cron fires
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up uptime monitoring (UptimeRobot, free)
