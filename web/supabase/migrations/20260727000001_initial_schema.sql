-- Initial schema: Mega Hits 506
-- Uses gen_random_uuid() (native PG13+, no extension needed)

-- ============================================================
-- PHOTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS event_photos (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, photo_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

-- Public read access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access' AND tablename = 'photos') THEN
    CREATE POLICY "Public read access" ON photos FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access' AND tablename = 'videos') THEN
    CREATE POLICY "Public read access" ON videos FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access' AND tablename = 'events') THEN
    CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access' AND tablename = 'event_photos') THEN
    CREATE POLICY "Public read access" ON event_photos FOR SELECT USING (true);
  END IF;
END
$$;

-- Admin write access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert access' AND tablename = 'photos') THEN
    CREATE POLICY "Admin insert access" ON photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "Admin update access" ON photos FOR UPDATE USING (auth.role() = 'authenticated');
    CREATE POLICY "Admin delete access" ON photos FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert access' AND tablename = 'videos') THEN
    CREATE POLICY "Admin insert access" ON videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "Admin update access" ON videos FOR UPDATE USING (auth.role() = 'authenticated');
    CREATE POLICY "Admin delete access" ON videos FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert access' AND tablename = 'events') THEN
    CREATE POLICY "Admin insert access" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "Admin update access" ON events FOR UPDATE USING (auth.role() = 'authenticated');
    CREATE POLICY "Admin delete access" ON events FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert access' AND tablename = 'event_photos') THEN
    CREATE POLICY "Admin insert access" ON event_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "Admin delete access" ON event_photos FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END
$$;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('photos', 'photos', true, 5242880, '{image/jpeg,image/png,image/webp}')
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read photos' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY "Public read photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin upload photos' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY "Admin upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete photos' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY "Admin delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
  END IF;
END
$$;
