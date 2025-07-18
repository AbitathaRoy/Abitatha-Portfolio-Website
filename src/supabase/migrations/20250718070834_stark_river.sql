/*
  # Complete Admin Authentication and Content Management System

  1. New Tables
    - `admin_users` - Stores admin user references and roles
    - `site_content` - Stores editable site content
    - `page_settings` - Stores page-specific settings

  2. Security
    - Enable RLS on all tables
    - Admin-only policies for content management
    - Public read access for site content

  3. Content Management
    - Home page editable content
    - Data science corner settings
    - Social media links
*/

-- Create admin_users table to track admin roles
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Create site_content table for editable content
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'home_hero', 'home_stats', 'data_science_header', etc.
  content_key text NOT NULL,
  content_value text NOT NULL,
  content_type text DEFAULT 'text' CHECK (content_type IN ('text', 'number', 'url', 'json')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, content_key)
);

-- Create page_settings table for page configurations
CREATE TABLE IF NOT EXISTS page_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL, -- 'home', 'data_science', etc.
  setting_key text NOT NULL,
  setting_value text NOT NULL,
  setting_type text DEFAULT 'text' CHECK (setting_type IN ('text', 'boolean', 'number', 'json')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page, setting_key)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Site content policies
CREATE POLICY "Anyone can read site content"
  ON site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage site content"
  ON site_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Page settings policies
CREATE POLICY "Anyone can read page settings"
  ON page_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage page settings"
  ON page_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Insert default site content
INSERT INTO site_content (section, content_key, content_value, content_type) VALUES
-- Home page hero section
('home_hero', 'badge_text', 'Aspiring Data Scientist', 'text'),
('home_hero', 'main_title', 'Turning Data into', 'text'),
('home_hero', 'highlight_title', 'Insights', 'text'),
('home_hero', 'description', '3rd year B.Tech. student at University of Delhi, passionate about extracting meaningful patterns from data and building intelligent solutions that make a difference.', 'text'),
('home_hero', 'cta_primary', 'Explore My Work', 'text'),
('home_hero', 'cta_secondary', 'Download Resume', 'text'),

-- Home page stats
('home_stats', 'projects_count', '15', 'number'),
('home_stats', 'projects_label', 'Projects', 'text'),
('home_stats', 'technologies_count', '5', 'number'),
('home_stats', 'technologies_label', 'Technologies', 'text'),
('home_stats', 'experience_count', '2', 'number'),
('home_stats', 'experience_label', 'Years Learning', 'text'),

-- Social media links
('social_links', 'github_url', '#', 'url'),
('social_links', 'linkedin_url', '#', 'url'),
('social_links', 'email_url', '#', 'url'),

-- Data science corner
('data_science_header', 'title', 'Data Science Projects', 'text'),
('data_science_header', 'description', 'Exploring the world of data through machine learning, statistical analysis, and predictive modeling. Each project represents a journey of discovery and learning.', 'text')

ON CONFLICT (section, content_key) DO NOTHING;

-- Insert default page settings
INSERT INTO page_settings (page, setting_key, setting_value, setting_type) VALUES
('home', 'show_stats', 'true', 'boolean'),
('home', 'show_corners_preview', 'true', 'boolean'),
('data_science', 'show_featured_section', 'true', 'boolean'),
('data_science', 'posts_per_page', '12', 'number')

ON CONFLICT (page, setting_key) DO NOTHING;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = user_uuid
  );
$$;

-- Function to get user admin role
CREATE OR REPLACE FUNCTION get_admin_role(user_uuid uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM admin_users 
  WHERE user_id = user_uuid
  LIMIT 1;
$$;