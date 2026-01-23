-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- MAIN ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id TEXT UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  qualification VARCHAR(100),
  college VARCHAR(255),
  resume_filename VARCHAR(255),
  resume_url TEXT,
  domain TEXT NOT NULL, 
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature TEXT,
  amount INTEGER CHECK (amount >= 0),
  status VARCHAR(20) DEFAULT 'pending',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure table is updated if already exists
ALTER TABLE enrollments ALTER COLUMN domain TYPE TEXT;
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_domain_check;
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_status_check 
  CHECK (status IN ('pending', 'paid', 'verified', 'rejected', 'completed'));
ALTER TABLE enrollments ALTER COLUMN amount DROP DEFAULT;
ALTER TABLE enrollments ALTER COLUMN amount SET DATA TYPE INTEGER;


-- DOMAINS REFERENCE TABLE
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER DEFAULT 2500,
  seats_available INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert current domains
INSERT INTO domains (name, description, price, seats_available) VALUES
('Frontend Development', 'Professional Web UI Training', 2500, 10),
('Backend & Database', 'Server-Side & Data Systems', 3500, 10)
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price;

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_enrollments_enrollment_id ON enrollments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_domain ON enrollments(domain);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_created ON enrollments(created_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_phone ON enrollments(phone);

-- SMART TRIGGERS & FUNCTIONS
-- Auto-generate enrollment_id: ENRL-YYYYMMDD-XXX
CREATE OR REPLACE FUNCTION generate_enrollment_id()
RETURNS TRIGGER AS $$
DECLARE
  date_prefix TEXT;
  seq_number TEXT;
BEGIN
  IF NEW.enrollment_id IS NULL THEN
    date_prefix := 'ENRL-' || TO_CHAR(NOW(), 'YYYYMMDD');
    seq_number := LPAD(
      COALESCE((
        SELECT COUNT(*) + 1 
        FROM enrollments 
        WHERE enrollment_id LIKE date_prefix || '%'
      ), 1)::TEXT, 3, '0'
    );
    NEW.enrollment_id := date_prefix || '-' || seq_number;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enrollment_id ON enrollments;
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

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
CREATE TRIGGER update_enrollments_updated_at 
  BEFORE UPDATE ON enrollments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ENTERPRISE RLS POLICIES
-- Enable RLS on all tables
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Clean start for policies
DO $$
BEGIN
    -- Drop all policies for enrollments
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON enrollments;', ' ')
        FROM pg_policies 
        WHERE tablename = 'enrollments'
    );
    -- Drop all policies for domains
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON domains;', ' ')
        FROM pg_policies 
        WHERE tablename = 'domains'
    );
END $$;

-- Re-create clean public policies
CREATE POLICY "Public read enrollments" ON enrollments FOR SELECT USING (true);
CREATE POLICY "Public insert enrollments" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update enrollments" ON enrollments FOR UPDATE USING (true);
CREATE POLICY "Public all domains for everyone" ON domains FOR SELECT USING (true);

-- Grant permissions to public roles
GRANT ALL ON enrollments TO anon, authenticated;
GRANT ALL ON domains TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;




-- STORAGE BUCKETS SETUP
-- (Resumes bucket usually needs to be created via UI or specific API calls, 
-- but we ensure policies are set for it)
DROP POLICY IF EXISTS "Public Access resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public Access objects" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert objects" ON storage.objects;

CREATE POLICY "Public Access objects" ON storage.objects FOR ALL USING (bucket_id = 'resumes');
CREATE POLICY "Public Insert objects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
