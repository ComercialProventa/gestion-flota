-- Migration: Add foto_url column to buses table
-- Execute this in your Supabase SQL Editor

ALTER TABLE buses ADD COLUMN IF NOT EXISTS foto_url text;

-- Create public bucket for vehicle photos
-- Run this in the Supabase SQL Editor or via the Dashboard > Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehiculos', 'vehiculos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to vehicle photos
CREATE POLICY "Public read access for vehiculos"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehiculos');

-- Allow authenticated users to upload vehicle photos
CREATE POLICY "Authenticated upload to vehiculos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vehiculos' AND auth.role() = 'authenticated');

-- Allow authenticated users to update vehicle photos
CREATE POLICY "Authenticated update in vehiculos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'vehiculos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete vehicle photos
CREATE POLICY "Authenticated delete in vehiculos"
ON storage.objects FOR DELETE
USING (bucket_id = 'vehiculos' AND auth.role() = 'authenticated');
