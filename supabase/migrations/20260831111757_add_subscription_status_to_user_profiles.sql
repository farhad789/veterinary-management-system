/*
# Add subscription_status column to user_profiles

## Overview
Adds a `subscription_status` column to track the user's trial/subscription state
explicitly in the database (TRIAL_ACTIVE, TRIAL_EXPIRING, TRIAL_EXPIRED, SUBSCRIBED).

## Changes
- `user_profiles.subscription_status` (text, default 'TRIAL_ACTIVE') — tracks the
  current subscription state of the user.

## Security
- No policy changes. Existing owner-scoped RLS policies on user_profiles remain unchanged.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_status text NOT NULL DEFAULT 'TRIAL_ACTIVE';
  END IF;
END $$;
