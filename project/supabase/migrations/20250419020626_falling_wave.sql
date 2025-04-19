/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `location` (text, required)
      - `area` (numeric, required)
      - `progress` (numeric, required)
      - `description` (text, required)
      - `current_status` (text)
      - `notes` (text)
      - `image_url` (text)
      - `pdf_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `projects` table
    - Add policies for:
      - Anyone can read projects
      - Only authenticated users can insert projects
      - Only project owners can update their projects
      - Only project owners can delete their projects
*/

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  area numeric NOT NULL,
  progress numeric NOT NULL,
  description text NOT NULL,
  current_status text,
  notes text,
  image_url text,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read projects
CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert projects
CREATE POLICY "Authenticated users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own projects
CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);