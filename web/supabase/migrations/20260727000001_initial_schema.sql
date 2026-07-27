-- Initial schema: Mega Hits 506
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PHOTOS
-- ============================================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIDEOS
-- ============================================================
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENT PHOTOS (many-to-many)
-- ============================================================
CREATE TABLE event_photos (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, photo_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_events_event_date ON events(event_date DESC);
CREATE INDEX idx_events_slug ON events(slug);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON photos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON videos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON event_photos FOR SELECT USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Admin insert access" ON photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON photos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON videos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON videos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON event_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON event_photos FOR DELETE USING (auth.role() = 'authenticated');
