-- Supabase Schema Migration for Gym SaaS Platform

-- 1. gyms table
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    plan TEXT, -- For gym's own pricing tiers
    subscription_plan TEXT DEFAULT 'basic', -- For SaaS tier (basic, pro, premium)
    subscription_status TEXT DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    access_key TEXT,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. plans table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    duration_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    plan TEXT, -- Plan name as text (for simplified UI logic)
    status TEXT DEFAULT 'active',
    membership_end DATE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'present',
    check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out TIMESTAMP WITH TIME ZONE
);

-- 5. payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'paid',
    date DATE DEFAULT CURRENT_DATE,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. trainers table
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    specialty TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for development (as requested)
ALTER TABLE gyms DISABLE ROW LEVEL SECURITY;
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainers DISABLE ROW LEVEL SECURITY;
