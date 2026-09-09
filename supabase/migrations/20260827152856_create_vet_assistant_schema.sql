/*
# Veterinary Assistant Database Schema

## Overview
Creates a complete schema for a professional veterinary assistant app.
Single-tenant (no auth) — all data is shared/public via anon+authenticated policies.

## New Tables

### pets
- `id` (uuid, PK)
- `name` (text, not null) — pet name
- `species` (text, not null) — dog, cat, bird, etc.
- `breed` (text) — breed name
- `gender` (text) — male/female
- `birth_date` (date) — date of birth
- `weight` (numeric) — weight in kg
- `photo_url` (text) — optional photo URL
- `microchip_id` (text) — microchip number
- `notes` (text) — general notes
- `created_at` (timestamptz)

### medical_records
- `id` (uuid, PK)
- `pet_id` (uuid, FK → pets)
- `record_type` (text) — vaccination, checkup, surgery, medication, lab_test
- `title` (text) — record title
- `description` (text) — details
- `date` (date) — date of record
- `veterinarian` (text) — vet name
- `next_due_date` (date) — optional next appointment
- `created_at` (timestamptz)

### appointments
- `id` (uuid, PK)
- `pet_id` (uuid, FK → pets)
- `title` (text) — appointment title
- `date` (date) — appointment date
- `time` (text) — appointment time
- `reason` (text) — reason for visit
- `clinic` (text) — clinic name
- `status` (text) — scheduled, completed, cancelled
- `created_at` (timestamptz)

### chat_history
- `id` (uuid, PK)
- `pet_id` (uuid, FK → pets, nullable) — associated pet
- `role` (text) — user or assistant
- `message` (text) — message content
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- All policies allow anon + authenticated CRUD (single-tenant, no auth screen).
*/

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  gender text,
  birth_date date,
  weight numeric,
  photo_url text,
  microchip_id text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  veterinarian text,
  next_due_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  title text NOT NULL,
  date date NOT NULL,
  time text,
  reason text,
  clinic text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  role text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- pets policies
DROP POLICY IF EXISTS "anon_select_pets" ON pets;
CREATE POLICY "anon_select_pets" ON pets FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_pets" ON pets;
CREATE POLICY "anon_insert_pets" ON pets FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_pets" ON pets;
CREATE POLICY "anon_update_pets" ON pets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_pets" ON pets;
CREATE POLICY "anon_delete_pets" ON pets FOR DELETE TO anon, authenticated USING (true);

-- medical_records policies
DROP POLICY IF EXISTS "anon_select_medical_records" ON medical_records;
CREATE POLICY "anon_select_medical_records" ON medical_records FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_medical_records" ON medical_records;
CREATE POLICY "anon_insert_medical_records" ON medical_records FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_medical_records" ON medical_records;
CREATE POLICY "anon_update_medical_records" ON medical_records FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_medical_records" ON medical_records;
CREATE POLICY "anon_delete_medical_records" ON medical_records FOR DELETE TO anon, authenticated USING (true);

-- appointments policies
DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE TO anon, authenticated USING (true);

-- chat_history policies
DROP POLICY IF EXISTS "anon_select_chat_history" ON chat_history;
CREATE POLICY "anon_select_chat_history" ON chat_history FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_history" ON chat_history;
CREATE POLICY "anon_insert_chat_history" ON chat_history FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_history" ON chat_history;
CREATE POLICY "anon_delete_chat_history" ON chat_history FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_pet_id ON chat_history(pet_id);
