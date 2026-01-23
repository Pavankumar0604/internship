-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- MAIN ENROLLMENTS TABLE
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id TEXT UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  qualification VARCHAR(100),
  college VARCHAR(255),
  resume_filename VARCHAR(255),
  resume_url TEXT,
  domain VARCHAR(100) NOT NULL CHECK (domain IN ('UI/UX Design', 'Frontend Development', 'Database Concepts', 'Digital Marketing')),
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature TEXT,
  amount INTEGER DEFAULT 500 CHECK (amount > 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'verified', 'rejected')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DOMAINS REFERENCE TABLE (Future-proof)
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER DEFAULT 500,
  seats_available INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert domains from flyer
INSERT INTO domains (name, description, seats_available) VALUES
('UI/UX Design', 'HTML/CSS Design Training', 10),
('Frontend Development', 'HTML/CSS/JS Development', 10),
('Database Concepts', 'HTML/SQL Database Training', 10),
('Digital Marketing', 'Digital Marketing Certification', 10);

-- PERFORMANCE INDEXES
CREATE INDEX idx_enrollments_enrollment_id ON enrollments(enrollment_id);
CREATE INDEX idx_enrollments_domain ON enrollments(domain);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_created ON enrollments(created_at);
CREATE INDEX idx_enrollments_phone ON enrollments(phone);

-- SMART TRIGGERS & FUNCTIONS
-- Auto-generate enrollment_id: ENRL-YYYYMMDD-XXX
CREATE OR REPLACE FUNCTION generate_enrollment_id()
RETURNS TRIGGER AS $$
DECLARE
  date_prefix TEXT;
  seq_number TEXT;
BEGIN
  date_prefix := 'ENRL-' || TO_CHAR(NOW(), 'YYYYMMDD');
  seq_number := LPAD(
    COALESCE((
      SELECT COUNT(*) + 1 
      FROM enrollments 
      WHERE enrollment_id LIKE date_prefix || '%'
    ), 1)::TEXT, 3, '0'
  );
  NEW.enrollment_id := date_prefix || '-' || seq_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_enrollment_id 
  BEFORE INSERT ON enrollments 
  FOR EACH ROW EXECUTE FUNCTION generate_enrollment_id();

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enrollments_updated_at 
  BEFORE UPDATE ON enrollments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ENTERPRISE RLS POLICIES
-- Enable RLS on all tables
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Public read (stats only)
CREATE POLICY "Public read enrollments stats" ON enrollments
  FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated insert enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Service role full access
CREATE POLICY "Service role full access" ON enrollments
  FOR ALL USING (auth.role() = 'service_role');

-- Domains: public read-only
CREATE POLICY "Public read domains" ON domains
  FOR SELECT USING (true);

-- STORAGE BUCKETS SETUP
-- Create resumes storage bucket (public access)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true);

-- Storage policies for resumes
CREATE POLICY "Public Access resumes" ON storage.objects FOR ALL
  USING (bucket_id = 'resumes');

-- Authenticated upload policy
CREATE POLICY "Authenticated upload resumes" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'resumes'
  );
