/*
# Blue Mist Core Schema

## Overview
Creates the full data layer for Blue Mist Interiors: consultations, AI-generated designs,
furniture orders, feedback/ratings, and design suggestions. Single-tenant (no auth)
so all policies allow anon + authenticated.

## New Tables
1. consultations — booking requests from the contact form
2. design_images — AI-generated design images saved per user session
3. furniture_orders — furniture-only purchase orders with material selection
4. feedback — customer feedback and star ratings
5. admin_actions — accept/reject log for consultations

## Columns
### consultations
- id (uuid PK)
- full_name, email, phone (text)
- rooms (jsonb array of {roomType, roomSize, style, colors, budget, furnitureRequirements, materials})
- is_multi_room (bool)
- currency (text: 'USD' or 'INR')
- delivery_area (text)
- delivery_charges (numeric)
- deposit_option (text: 'half' or 'full')
- user_photo_url (text, nullable)
- preferred_date (date)
- message (text)
- status (text: 'pending', 'accepted', 'rejected')
- created_at (timestamptz)

### design_images
- id (uuid PK)
- session_id (text, identifies the visitor)
- user_email (text, nullable)
- room_type (text)
- style (text)
- image_url (text)
- design_data (jsonb — full AI result)
- created_at (timestamptz)

### furniture_orders
- id (uuid PK)
- full_name, email, phone (text)
- item_name (text)
- material (text)
- material_price (numeric)
- quantity (int)
- delivery_area (text)
- delivery_charges (numeric)
- currency (text)
- total_price (numeric)
- deposit_option (text)
- created_at (timestamptz)

### feedback
- id (uuid PK)
- name (text)
- email (text)
- rating (int 1-5)
- message (text)
- project_type (text, nullable)
- created_at (timestamptz)

## Security
- RLS enabled on all tables.
- All policies use TO anon, authenticated (no auth screen in this app).
*/

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  rooms jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_multi_room boolean NOT NULL DEFAULT false,
  currency text NOT NULL DEFAULT 'INR',
  delivery_area text,
  delivery_charges numeric DEFAULT 0,
  deposit_option text DEFAULT 'half',
  user_photo_url text,
  preferred_date date,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_consultations" ON consultations;
CREATE POLICY "anon_select_consultations" ON consultations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_consultations" ON consultations;
CREATE POLICY "anon_insert_consultations" ON consultations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_consultations" ON consultations;
CREATE POLICY "anon_update_consultations" ON consultations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_consultations" ON consultations;
CREATE POLICY "anon_delete_consultations" ON consultations FOR DELETE
  TO anon, authenticated USING (true);

-- --

CREATE TABLE IF NOT EXISTS design_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  user_email text,
  room_type text NOT NULL,
  style text NOT NULL,
  image_url text NOT NULL,
  design_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE design_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_design_images" ON design_images;
CREATE POLICY "anon_select_design_images" ON design_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_design_images" ON design_images;
CREATE POLICY "anon_insert_design_images" ON design_images FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_design_images" ON design_images;
CREATE POLICY "anon_update_design_images" ON design_images FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_design_images" ON design_images;
CREATE POLICY "anon_delete_design_images" ON design_images FOR DELETE
  TO anon, authenticated USING (true);

-- --

CREATE TABLE IF NOT EXISTS furniture_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  item_name text NOT NULL,
  material text NOT NULL,
  material_price numeric NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  delivery_area text,
  delivery_charges numeric DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  total_price numeric NOT NULL DEFAULT 0,
  deposit_option text DEFAULT 'half',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE furniture_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_furniture_orders" ON furniture_orders;
CREATE POLICY "anon_select_furniture_orders" ON furniture_orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_furniture_orders" ON furniture_orders;
CREATE POLICY "anon_insert_furniture_orders" ON furniture_orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_furniture_orders" ON furniture_orders;
CREATE POLICY "anon_update_furniture_orders" ON furniture_orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_furniture_orders" ON furniture_orders;
CREATE POLICY "anon_delete_furniture_orders" ON furniture_orders FOR DELETE
  TO anon, authenticated USING (true);

-- --

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  message text NOT NULL,
  project_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback" ON feedback FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
CREATE POLICY "anon_update_feedback" ON feedback FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_feedback" ON feedback;
CREATE POLICY "anon_delete_feedback" ON feedback FOR DELETE
  TO anon, authenticated USING (true);

-- --

CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE,
  action text NOT NULL,
  admin_note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_admin_actions" ON admin_actions;
CREATE POLICY "anon_select_admin_actions" ON admin_actions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_admin_actions" ON admin_actions;
CREATE POLICY "anon_insert_admin_actions" ON admin_actions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_admin_actions" ON admin_actions;
CREATE POLICY "anon_update_admin_actions" ON admin_actions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_admin_actions" ON admin_actions;
CREATE POLICY "anon_delete_admin_actions" ON admin_actions FOR DELETE
  TO anon, authenticated USING (true);
