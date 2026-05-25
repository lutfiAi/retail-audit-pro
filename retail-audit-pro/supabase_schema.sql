-- =====================================================
-- Retail Audit Pro — Supabase Database Schema
-- نفّذ هذا الملف في Supabase SQL Editor
-- =====================================================

-- 1. جدول الشركات (Tenants)
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter','business','enterprise')),
  max_branches INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول المستخدمين
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  full_name TEXT,
  role TEXT DEFAULT 'auditor' CHECK (role IN ('admin','manager','auditor','viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الفروع
CREATE TABLE branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول جلسات التدقيق
CREATE TABLE audit_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  branch_id UUID REFERENCES branches(id),
  session_key TEXT NOT NULL,
  mode TEXT CHECK (mode IN ('store','hq')),
  hq_dept_id TEXT,
  data JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  notes JSONB DEFAULT '{}',
  total_score INT DEFAULT 0,
  max_score INT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','reviewed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_key)
);

-- 5. جدول التوصيات وخطط العمل
CREATE TABLE action_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES audit_sessions(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_text TEXT,
  risk_level TEXT CHECK (risk_level IN ('H','M','L')),
  action TEXT,
  assigned_to TEXT,
  due_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدم برؤية بيانات شركته فقط
CREATE POLICY "Users see own company data" ON audit_sessions
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users see own sessions" ON audit_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function: تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON audit_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- بعد تنفيذ هذا الملف، أضف مستخدماً من Supabase Dashboard
-- Authentication > Users > Invite User
-- =====================================================
