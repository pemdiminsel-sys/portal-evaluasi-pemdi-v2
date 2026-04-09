-- Setup OPD-Indikators Junction Table with RLS Policy
-- Run this SQL in Supabase SQL Editor

-- 1. Create opd_indikators table
CREATE TABLE IF NOT EXISTS opd_indikators (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  opd_id BIGINT NOT NULL REFERENCES opds(id) ON DELETE CASCADE,
  indikator_id BIGINT NOT NULL REFERENCES indikators(id) ON DELETE CASCADE,
  is_responsibility BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(opd_id, indikator_id)
);

-- 2. Enable Row Level Security
ALTER TABLE opd_indikators ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow SELECT for all authenticated users
CREATE POLICY "opd_indikators_select_policy" ON opd_indikators
  FOR SELECT
  USING (true);

-- Allow INSERT, UPDATE, DELETE for authenticated users (for now, can be restricted later)
CREATE POLICY "opd_indikators_insert_policy" ON opd_indikators
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "opd_indikators_update_policy" ON opd_indikators
  FOR UPDATE
  USING (true);

CREATE POLICY "opd_indikators_delete_policy" ON opd_indikators
  FOR DELETE
  USING (true);

-- 4. Create index untuk performance
CREATE INDEX IF NOT EXISTS idx_opd_indikators_opd_id ON opd_indikators(opd_id);
CREATE INDEX IF NOT EXISTS idx_opd_indikators_indikator_id ON opd_indikators(indikator_id);

-- 5. Verify table created
SELECT * FROM opd_indikators LIMIT 1;
