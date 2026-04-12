-- ============================================================
-- Mohelnice Marketplace — Database Schema
-- Spusť tento soubor v Supabase SQL Editoru
-- ============================================================

-- Povolit UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE price_type_enum AS ENUM ('free', 'symbolic', 'fixed', 'negotiable');

CREATE TYPE symbolic_price_enum AS ENUM (
  'cokolada',
  'kava',
  'pivo',
  'banany',
  'vlastni'
);

-- ============================================================
-- TABULKA: users (rozšíření Supabase auth.users)
-- ============================================================

CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  city          TEXT NOT NULL DEFAULT 'Mohelnice',
  phone         TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  preferred_transfer_location TEXT DEFAULT 'Mohelnice',  -- Kde chce předávat
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  rating_avg    NUMERIC(3, 2) NOT NULL DEFAULT 0,
  rating_count  INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABULKA: listings
-- ============================================================

CREATE TABLE public.listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL,
  price_type      price_type_enum NOT NULL,
  price_amount    NUMERIC(10, 2),
  price_text      TEXT,        -- pro symbolic: 'Káva', 'Pivo', nebo vlastní text
  photos          TEXT[] NOT NULL DEFAULT '{}',
  transfer_location TEXT,       -- Kde se věc předá (Mohelnice, Zábřeh, atd.)
  location_lat    NUMERIC(10, 7),
  location_lng    NUMERIC(10, 7),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_sold         BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pro rychlé filtrování
CREATE INDEX listings_category_idx    ON public.listings (category);
CREATE INDEX listings_is_active_idx   ON public.listings (is_active);
CREATE INDEX listings_user_id_idx     ON public.listings (user_id);
CREATE INDEX listings_created_at_idx  ON public.listings (created_at DESC);
CREATE INDEX listings_search_idx      ON public.listings USING GIN (to_tsvector('simple', title || ' ' || description));

-- ============================================================
-- TABULKA: ratings
-- ============================================================

CREATE TABLE public.ratings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rater_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rated_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id  UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  score       SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (rater_id, listing_id)
);

-- ============================================================
-- FUNKCE: automatická aktualizace rating_avg a rating_count
-- ============================================================

CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    rating_avg   = (SELECT AVG(score) FROM public.ratings WHERE rated_id = NEW.rated_id),
    rating_count = (SELECT COUNT(*)   FROM public.ratings WHERE rated_id = NEW.rated_id)
  WHERE id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_rating_insert
AFTER INSERT OR UPDATE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- ============================================================
-- FUNKCE: automatické vytvoření profilu po registraci
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, city, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nový uživatel'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Mohelnice'),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings  ENABLE ROW LEVEL SECURITY;

-- Users: veřejné čtení, vlastník může upravovat
CREATE POLICY "Veřejné čtení profilů"
  ON public.users FOR SELECT USING (TRUE);

CREATE POLICY "Úprava vlastního profilu"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Listings: veřejné čtení, vlastník CRUD
CREATE POLICY "Veřejné čtení inzerátů"
  ON public.listings FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Přihlášený uživatel může vytvořit inzerát"
  ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vlastník může upravit inzerát"
  ON public.listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Vlastník může smazat inzerát"
  ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- Ratings: veřejné čtení, přihlášený může hodnotit
CREATE POLICY "Veřejné čtení hodnocení"
  ON public.ratings FOR SELECT USING (TRUE);

CREATE POLICY "Přihlášený uživatel může hodnotit"
  ON public.ratings FOR INSERT WITH CHECK (auth.uid() = rater_id AND auth.uid() != rated_id);

-- ============================================================
-- STORAGE: bucket pro fotky inzerátů
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('listings-photos', 'listings-photos', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Veřejné čtení fotek"
  ON storage.objects FOR SELECT USING (bucket_id = 'listings-photos');

CREATE POLICY "Přihlášený může nahrát fotky"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'listings-photos' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Vlastník může smazat fotky"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'listings-photos' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- SEED DATA: ukázkové inzeráty (volitelné)
-- ============================================================

-- Kategorie jsou definovány na frontendu, tady jen pro přehled:
-- 'Elektronika' | 'Oblečení' | 'Nábytek' | 'Auto-moto' | 'Dům a zahrada'
-- 'Sport' | 'Děti a hračky' | 'Knihy' | 'Zvířata' | 'Služby' | 'Ostatní'

-- Obce do 20 km od Mohelnice:
-- Mohelnice, Zábřeh, Šumperk, Postřelmov, Úsov, Loštice,
-- Litovel, Moravičany, Mírov, Pavlov, Doubravice, Třeština
