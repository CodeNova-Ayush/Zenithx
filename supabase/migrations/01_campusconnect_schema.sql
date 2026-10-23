-- CampusConnect Production Supabase PostgreSQL Schema & RLS Policies
-- AI-Powered Campus Operations Intelligence Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'staff', 'admin')),
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Campus Buildings & Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
  id TEXT PRIMARY KEY,
  building TEXT NOT NULL,
  building_code TEXT NOT NULL UNIQUE,
  building_type TEXT NOT NULL CHECK (building_type IN ('hostel', 'academic', 'library', 'dining', 'facility')),
  floors JSONB DEFAULT '[]'::jsonb,
  rooms JSONB DEFAULT '[]'::jsonb,
  coordinates JSONB NOT NULL,
  map_position JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  categories JSONB NOT NULL,
  sla_hours JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  title TEXT NOT NULL,
  original_description TEXT NOT NULL,
  ai_summary TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electricity', 'cleanliness', 'internet')),
  department TEXT NOT NULL,
  building TEXT NOT NULL,
  floor TEXT,
  room TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed', 'reopened')),
  assigned_staff_id UUID REFERENCES public.profiles(id),
  assigned_staff_name TEXT,
  assigned_at TIMESTAMPTZ,
  sla_target_hours INTEGER NOT NULL,
  sla_deadline TIMESTAMPTZ NOT NULL,
  is_overdue BOOLEAN DEFAULT false,
  student_rating INTEGER CHECK (student_rating >= 1 AND student_rating <= 5),
  student_feedback TEXT,
  is_duplicate_of TEXT REFERENCES public.tickets(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_student ON public.tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON public.tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_building ON public.tickets(building);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);

-- 5. Ticket Events (Immutable Trust Ledger)
CREATE TABLE IF NOT EXISTS public.ticket_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  event_type TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_events_ticket ON public.ticket_events(ticket_id);

-- 6. Ticket Attachments
CREATE TABLE IF NOT EXISTS public.ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('complaint_photo', 'resolution_evidence')),
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id),
  uploader_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Resolution Assessments (AI Proof-of-Fix records)
CREATE TABLE IF NOT EXISTS public.resolution_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  visible_changes JSONB DEFAULT '[]'::jsonb,
  remaining_concerns JSONB DEFAULT '[]'::jsonb,
  evidence_limitations JSONB DEFAULT '[]'::jsonb,
  verdict TEXT NOT NULL,
  confidence_score INTEGER NOT NULL,
  is_ai_evaluated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Duplicate Candidates Queue
CREATE TABLE IF NOT EXISTS public.duplicate_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  candidate_ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  similarity_score INTEGER NOT NULL,
  match_signals JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed_duplicate', 'marked_separate')),
  reviewed_by TEXT,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id TEXT NOT NULL,
  ticket_id TEXT REFERENCES public.tickets(id) ON DELETE CASCADE,
  ticket_number TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resolution_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duplicate_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read profiles; users can update own profile
CREATE POLICY "Profiles readable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Tickets: Students can view their own; staff/admin can view all
CREATE POLICY "Students see own tickets" ON public.tickets
  FOR SELECT TO authenticated
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

CREATE POLICY "Students can create tickets" ON public.tickets
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Staff and Admins can update tickets" ON public.tickets
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- Ticket Events: Non-internal visible to student; internal only visible to staff/admin
CREATE POLICY "Events visibility policy" ON public.ticket_events
  FOR SELECT TO authenticated
  USING (
    (NOT is_internal AND EXISTS (
      SELECT 1 FROM public.tickets WHERE tickets.id = ticket_events.ticket_id AND tickets.student_id = auth.uid()
    ))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );
