/*
# Create user profiles and veterinary cases tables

## Overview
Adds multi-user support to the veterinary platform: user profiles with trial tracking,
and per-user veterinary cases with full clinical reasoning data persistence.

## New Tables

### user_profiles
- `id` (uuid, PK, references auth.users)
- `email` (text, not null)
- `role` (text) — user's professional role (veterinarian, student, pet owner, etc.)
- `preferred_lang` (text, default 'fa') — preferred interface language
- `trial_started_at` (timestamptz) — when the 7-day trial began
- `trial_ends_at` (timestamptz) — when the trial expires
- `subscribed` (boolean, default false)
- `created_at` (timestamptz)

### veterinary_cases
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users, not null)
- `patient_name` (text) — name of the animal patient
- `species` (text, not null) — dog, cat, horse, etc.
- `breed` (text)
- `age_years` (numeric)
- `sex` (text)
- `weight` (numeric)
- `chief_complaint` (text)
- `history` (text)
- `vaccination_status` (text)
- `previous_medications` (text)
- `clinical_input` (jsonb) — serialized ClinicalInput object
- `reasoning_output` (jsonb) — serialized ReasoningOutput object
- `working_diagnosis` (text)
- `treatment` (text)
- `follow_up` (text)
- `status` (text, default 'active')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security
- RLS enabled on both tables.
- Owner-scoped CRUD: each authenticated user can only access their own rows.
- user_profiles: user can read/update only their own profile. No inserts (profiles
  are created by a trigger when a new auth user signs up — but since we use OTP,
  we create the profile from the client on first login).
- veterinary_cases: full owner-scoped CRUD (select/insert/update/delete).
*/

-- ============================================================
-- user_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text,
  preferred_lang text NOT NULL DEFAULT 'fa',
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  subscribed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- veterinary_cases
-- ============================================================
CREATE TABLE IF NOT EXISTS veterinary_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name text,
  species text NOT NULL,
  breed text,
  age_years numeric,
  sex text,
  weight numeric,
  chief_complaint text,
  history text,
  vaccination_status text,
  previous_medications text,
  clinical_input jsonb,
  reasoning_output jsonb,
  working_diagnosis text,
  treatment text,
  follow_up text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE veterinary_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cases" ON veterinary_cases;
CREATE POLICY "select_own_cases" ON veterinary_cases FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cases" ON veterinary_cases;
CREATE POLICY "insert_own_cases" ON veterinary_cases FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cases" ON veterinary_cases;
CREATE POLICY "update_own_cases" ON veterinary_cases FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cases" ON veterinary_cases;
CREATE POLICY "delete_own_cases" ON veterinary_cases FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_veterinary_cases_user_id ON veterinary_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_veterinary_cases_status ON veterinary_cases(status);

-- ============================================================
-- Update existing tables (pets, medical_records, appointments, chat_history)
-- to be owner-scoped instead of public.
-- Add user_id columns and convert policies from anon-public to owner-scoped.
-- ============================================================

-- Add user_id to pets
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'user_id') THEN
    ALTER TABLE pets ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id to medical_records
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'user_id') THEN
    ALTER TABLE medical_records ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id to appointments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'user_id') THEN
    ALTER TABLE appointments ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id to chat_history
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_history' AND column_name = 'user_id') THEN
    ALTER TABLE chat_history ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Replace pets policies with owner-scoped versions
DROP POLICY IF EXISTS "anon_select_pets" ON pets;
DROP POLICY IF EXISTS "anon_insert_pets" ON pets;
DROP POLICY IF EXISTS "anon_update_pets" ON pets;
DROP POLICY IF EXISTS "anon_delete_pets" ON pets;

CREATE POLICY "select_own_pets" ON pets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_pets" ON pets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_pets" ON pets FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_pets" ON pets FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Replace medical_records policies
DROP POLICY IF EXISTS "anon_select_medical_records" ON medical_records;
DROP POLICY IF EXISTS "anon_insert_medical_records" ON medical_records;
DROP POLICY IF EXISTS "anon_update_medical_records" ON medical_records;
DROP POLICY IF EXISTS "anon_delete_medical_records" ON medical_records;

CREATE POLICY "select_own_medical_records" ON medical_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_medical_records" ON medical_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_medical_records" ON medical_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_medical_records" ON medical_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Replace appointments policies
DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;

CREATE POLICY "select_own_appointments" ON appointments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_appointments" ON appointments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_appointments" ON appointments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_appointments" ON appointments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Replace chat_history policies
DROP POLICY IF EXISTS "anon_select_chat_history" ON chat_history;
DROP POLICY IF EXISTS "anon_insert_chat_history" ON chat_history;
DROP POLICY IF EXISTS "anon_delete_chat_history" ON chat_history;

CREATE POLICY "select_own_chat_history" ON chat_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_chat_history" ON chat_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_chat_history" ON chat_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
