# 💰 AdSense Application Checklist

> **Don't apply on day 1.** AdSense reviewers reject sites that look new or thin. Build up first, then apply.

---

## ✅ Pre-Application Checklist

### Content (most important)
- [ ] **30+ original articles published** (50+ is safer)
- [ ] Articles are **400-700 words each** (no thin content)
- [ ] Articles are spread across **at least 4 categories**
- [ ] All articles are **unique** (no copies of other sites)
- [ ] All articles **link to a primary source** (this matters for E-E-A-T)
- [ ] No spam, clickbait, or sensational headlines

### Site Age
- [ ] **Site is 2-3 weeks old minimum** (let Google index it)
- [ ] You see organic traffic in Google Search Console (any amount)

### Domain
- [ ] **Custom domain** (`news.autoflowa.in`), not a Vercel preview URL
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] WWW or non-WWW consistently used
- [ ] Domain is older than 6 months ideally (use an existing domain you own)

### Required Pages (all already built ✅)
- [x] About Us — explains who runs the site
- [x] Contact Us — has real email addresses
- [x] Privacy Policy — DPDP + GDPR compliant
- [x] Terms of Use
- [x] Disclaimer
- [x] Editorial Policy
- [x] Fact Check Policy
- [x] DMCA Policy

### Navigation & UX
- [x] Header navigation works on mobile + desktop
- [x] Footer links to all legal pages
- [x] No broken links (run a crawler before applying)
- [x] Site loads in under 3 seconds (use PageSpeed Insights)
- [x] Mobile-friendly (test with Google Mobile-Friendly Test)

### SEO
- [x] `sitemap.xml` submitted to Google Search Console
- [x] `robots.txt` allows crawling
- [x] hreflang tags on multilingual articles
- [x] JSON-LD NewsArticle schema on every article
- [x] OpenGraph tags for social sharing

### Traffic
- [ ] At least **some real visitors** (5-10 per day is fine to start)
- [ ] Set up Google Analytics 4 to track this
- [ ] Don't fake traffic with bots — Google detects this

---

## 📋 Application Steps

1. **Set up Google Analytics 4** (link to Search Console)
2. **Submit sitemap to Search Console**: `https://news.autoflowa.in/sitemap.xml`
3. Wait 1-2 weeks until you see articles indexed
4. Go to [adsense.google.com](https://adsense.google.com) → Sign up
5. Enter site URL: `https://news.autoflowa.in`
6. Add the AdSense verification snippet to the site:
   - Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXX` in Vercel env vars
   - The layout already loads the AdSense script when this env var is set ✅
   - Redeploy
7. Submit for review.
8. **Review takes 1-14 days.** Be patient. Don't reapply during review.

---

## 🚫 Common Rejection Reasons

| Reason | How to fix |
|---|---|
| "Insufficient content" | Add more articles. 30+ minimum, ideally 50+. |
| "Site under construction" | Make sure no "Coming Soon" or placeholder content. |
| "Page does not comply with policies" | Remove anything resembling adult content, hate speech, copyright violations. Our editorial policy already prevents this. |
| "Navigation issues" | Ensure footer + header links work on every page. |
| "Site doesn't have enough content yet" | This is the most common. Solution: keep publishing for 2-3 more weeks and reapply. |

---

## 📝 After Approval

### Where to place ads (start conservative for AdSense quality score)
1. **One ad above the fold** on homepage (just below header) — display ad, responsive
2. **One in-article ad** after the "Why It Matters" section
3. **One ad in the related articles section** at the bottom
4. **Sidebar ad** on category pages (if you add a sidebar)

### What NOT to do
- ❌ Don't put 5+ ads per page
- ❌ Don't put ads in places that confuse readers (between paragraphs, in headers)
- ❌ Don't click your own ads
- ❌ Don't use "Click here" or "Sponsored content" near ads (against policy)

### Optimization (after 30 days of data)
- Use **Auto Ads** initially — let Google optimize placement
- Then test manual placements with **Experiments** in AdSense
- Track **RPM** (revenue per 1000 pageviews) and **CTR**
- For Indian traffic, expect $0.50-$2 RPM initially; can rise with US/UK readers

---

## 💡 Bonus Tips for Higher Earnings

1. **Target English readers first** — English ads pay 5-10x more than Hindi/regional
2. **SEO push for tech and business categories** — these have the highest CPC
3. **Add internal links** between articles (good for both SEO and engagement)
4. **Email newsletter** — captures returning users (free traffic)
5. **Don't aim for viral traffic** — aim for **steady, qualified traffic** from Google
