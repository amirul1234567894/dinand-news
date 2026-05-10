-- =====================================================
-- DINAND NEWS - Supabase Database Schema
-- Multi-language news platform schema
-- =====================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- =====================================================
-- SOURCES (whitelist of allowed RSS/API sources)
-- =====================================================
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rss', 'api', 'official_blog', 'press_release', 'government')),
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  trust_score INTEGER DEFAULT 100 CHECK (trust_score BETWEEN 0 AND 100),
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sources_active ON sources(is_active) WHERE is_active = true;

-- =====================================================
-- CATEGORIES
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  name_bn TEXT,
  name_ta TEXT,
  name_te TEXT,
  name_mr TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active, display_order);

-- =====================================================
-- TAGS
-- =====================================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);

-- =====================================================
-- ARTICLES (master record - English is the source-of-truth)
-- =====================================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,

  -- Source attribution (NEVER store original article body)
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_published_at TIMESTAMPTZ,

  -- Cover image (royalty-free or AI-generated only)
  cover_image_url TEXT,
  cover_image_alt TEXT,
  cover_image_credit TEXT,

  -- Status & moderation
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'draft')),
  is_breaking BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Quality metrics from AI
  plagiarism_score NUMERIC(5,2),
  word_count INTEGER,
  reading_time_minutes INTEGER,

  -- Analytics
  view_count INTEGER DEFAULT 0,

  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status_published ON articles(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_category ON articles(category_id, published_at DESC);
CREATE INDEX idx_articles_breaking ON articles(is_breaking, published_at DESC) WHERE is_breaking = true;
CREATE INDEX idx_articles_trending ON articles(is_trending, view_count DESC) WHERE is_trending = true;
CREATE INDEX idx_articles_source_url ON articles(source_url); -- for dedupe

-- =====================================================
-- ARTICLE TRANSLATIONS (one row per language per article)
-- =====================================================
CREATE TABLE article_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'hi', 'bn', 'ta', 'te', 'mr')),

  -- Article content (AI-generated, fully transformed)
  title TEXT NOT NULL,
  summary TEXT NOT NULL, -- 2-line summary
  key_highlights JSONB, -- array of bullet points
  what_happened TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  future_impact TEXT,

  -- SEO metadata
  seo_title TEXT,
  seo_description TEXT,
  og_title TEXT,
  og_description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(article_id, locale)
);

CREATE INDEX idx_translations_article ON article_translations(article_id);
CREATE INDEX idx_translations_locale ON article_translations(locale);
CREATE INDEX idx_translations_search ON article_translations USING gin(to_tsvector('simple', title || ' ' || summary));

-- =====================================================
-- ARTICLE TAGS (many-to-many)
-- =====================================================
CREATE TABLE article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);

-- =====================================================
-- ANALYTICS (lightweight pageview tracking)
-- =====================================================
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'share', 'click_source')),
  locale TEXT,
  referrer TEXT,
  user_agent_hash TEXT, -- hashed, not stored raw for privacy
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_article ON analytics_events(article_id, created_at DESC);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- =====================================================
-- INGESTION LOG (track what n8n has fetched)
-- =====================================================
CREATE TABLE ingestion_log (
  id BIGSERIAL PRIMARY KEY,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'duplicate', 'failed', 'rejected')),
  reason TEXT,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  raw_payload JSONB, -- store original fetch result for debugging (NOT for republishing)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingestion_log_url ON ingestion_log(source_url);
CREATE INDEX idx_ingestion_log_created ON ingestion_log(created_at DESC);

-- =====================================================
-- SETTINGS (key-value site settings)
-- =====================================================
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADMIN USERS
-- =====================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_articles
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_translations
  BEFORE UPDATE ON article_translations
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Auto-increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_usage_trigger
  AFTER INSERT ON article_tags
  FOR EACH ROW EXECUTE PROCEDURE increment_tag_usage();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- Public read access (only published articles visible)
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can read translations of published articles"
  ON article_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_translations.article_id
      AND articles.status = 'published'
    )
  );

CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Public can read article_tags of published articles"
  ON article_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_tags.article_id
      AND articles.status = 'published'
    )
  );

-- Anyone can insert analytics events (anonymous)
CREATE POLICY "Anyone can log analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Service role bypasses RLS automatically
-- All writes happen via service role from API routes (n8n, admin)

-- =====================================================
-- SEED DATA
-- =====================================================

-- Categories
INSERT INTO categories (slug, name_en, name_hi, name_bn, name_ta, name_te, name_mr, display_order) VALUES
  ('breaking',      'Breaking',       'ब्रेकिंग',        'ব্রেকিং',        'முக்கியச் செய்தி', 'బ్రేకింగ్',     'ब्रेकिंग',     1),
  ('trending',      'Trending',       'ट्रेंडिंग',       'ট্রেন্ডিং',       'பிரபலம்',          'ట్రెండింగ్',     'ट्रेंडिंग',     2),
  ('india',         'India',          'भारत',           'ভারত',           'இந்தியா',          'భారత్',         'भारत',         3),
  ('tech',          'Tech',           'टेक',            'প্রযুক্তি',         'தொழில்நுட்பம்',     'టెక్',          'टेक',          4),
  ('business',      'Business',       'बिज़नेस',         'ব্যবসা',          'வணிகம்',           'వ్యాపారం',     'व्यवसाय',      5),
  ('startup',       'Startup',        'स्टार्टअप',       'স্টার্টআপ',       'தொடக்க நிறுவனம்', 'స్టార్టప్',     'स्टार्टअप',    6),
  ('auto',          'Auto',           'ऑटो',           'অটো',            'வாகனம்',           'ఆటో',           'ऑटो',          7),
  ('sports',        'Sports',         'खेल',            'খেলাধুলা',         'விளையாட்டு',       'క్రీడలు',       'क्रीडा',       8),
  ('entertainment', 'Entertainment',  'मनोरंजन',         'বিনোদন',          'பொழுதுபோக்கு',     'వినోదం',       'मनोरंजन',      9);

-- Sources
INSERT INTO sources (name, url, type, category) VALUES
  ('PIB India',       'https://www.pib.gov.in/RssMain.aspx',                    'government',    'india'),
  ('ISRO',            'https://www.isro.gov.in/feed.xml',                       'government',    'india'),
  ('India.gov.in',    'https://www.india.gov.in/my-government/press-releases/feed', 'government', 'india'),
  ('Google Blog',     'https://blog.google/rss/',                               'official_blog', 'tech'),
  ('OpenAI News',     'https://openai.com/news/rss.xml',                        'official_blog', 'tech'),
  ('Microsoft News',  'https://news.microsoft.com/feed/',                       'official_blog', 'tech'),
  ('AWS Blog',        'https://aws.amazon.com/blogs/aws/feed/',                 'official_blog', 'tech'),
  ('Cloudflare Blog', 'https://blog.cloudflare.com/rss/',                       'official_blog', 'tech'),
  ('PR Newswire',     'https://www.prnewswire.com/rss/news-releases-list.rss',  'press_release', 'business'),
  ('GlobeNewswire',   'https://www.globenewswire.com/RssFeed/subjects/news',    'press_release', 'business');

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('site_meta',  '{"name":"Dinand News","tagline":"India''s Daily AI-Powered News Brief"}'),
  ('homepage',   '{"breaking_count":5,"trending_count":8,"latest_count":20}'),
  ('moderation', '{"auto_publish":true,"min_word_count":400,"max_plagiarism_score":30}');
