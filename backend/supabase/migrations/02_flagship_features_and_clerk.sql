-- CampusConnect Migration 02: Flagship Features & Clerk Third-Party Auth Integration
-- 1. Outage Detective Infrastructure Graph & Incidents
-- 2. Show-Me Reporting Multimodal Media Records
-- 3. Repair Copilot Knowledge Base & Feedback

-- Enable pgvector extension for semantic similarity search if available
CREATE EXTENSION IF NOT EXISTS vector;

-- ---------------------------------------------------------------------------
-- 1. CLERK AUTH RLS SUPPORT
-- ---------------------------------------------------------------------------
-- Helper function to extract requesting user ID from Clerk JWT
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')::text;
$$ LANGUAGE SQL STABLE;

-- ---------------------------------------------------------------------------
-- 2. OUTAGE DETECTIVE: INFRASTRUCTURE GRAPH & PROBABLE INCIDENTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.infrastructure_nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electricity', 'cleanliness', 'internet')),
  parent_ids JSONB DEFAULT '[]'::jsonb,
  building TEXT NOT NULL,
  floor INTEGER,
  room TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.probable_incidents (
  id TEXT PRIMARY KEY,
  incident_number TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electricity', 'cleanliness', 'internet')),
  title TEXT NOT NULL,
  shared_node_id TEXT NOT NULL REFERENCES public.infrastructure_nodes(id),
  shared_node_name TEXT NOT NULL,
  shared_node_type TEXT NOT NULL,
  building TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed', 'confirmed', 'dismissed', 'resolved')),
  confidence JSONB NOT NULL,
  member_ticket_ids JSONB NOT NULL,
  ai_explanation TEXT,
  technician_work_order_draft TEXT,
  student_notice TEXT,
  work_order_assigned_to TEXT,
  assigned_staff_name TEXT,
  dismissal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.probable_incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_building ON public.probable_incidents(building);

-- ---------------------------------------------------------------------------
-- 3. SHOW-ME REPORTING: MULTIMODAL MEDIA RECORDS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ticket_media_records (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'audio')),
  storage_path TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  transcript_original TEXT,
  transcript_english TEXT,
  detected_language TEXT,
  visual_observations JSONB DEFAULT '[]'::jsonb,
  audio_observations JSONB DEFAULT '[]'::jsonb,
  safety_concerns JSONB DEFAULT '[]'::jsonb,
  is_safety_hazard BOOLEAN DEFAULT false,
  confidence_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. REPAIR COPILOT: KNOWLEDGE BASE & FEEDBACK
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_base_entries (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electricity', 'cleanliness', 'internet')),
  title TEXT NOT NULL,
  issue_summary TEXT NOT NULL,
  location_type TEXT NOT NULL,
  fixture_type TEXT NOT NULL,
  resolution_notes TEXT NOT NULL,
  parts_used JSONB DEFAULT '[]'::jsonb,
  time_spent_minutes INTEGER NOT NULL,
  tools_needed JSONB DEFAULT '[]'::jsonb,
  student_confirmed_fix BOOLEAN DEFAULT true,
  is_reliable BOOLEAN DEFAULT true,
  helpful_votes INTEGER DEFAULT 0,
  unhelpful_votes INTEGER DEFAULT 0,
  embedding_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_category ON public.knowledge_base_entries(category);

CREATE TABLE IF NOT EXISTS public.copilot_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  technician_id TEXT NOT NULL,
  helpful BOOLEAN NOT NULL,
  edited_checklist JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------------
ALTER TABLE public.infrastructure_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.probable_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_media_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_feedback ENABLE ROW LEVEL SECURITY;

-- Infrastructure nodes: Read-only for authenticated campus users
CREATE POLICY "Infrastructure readable by authenticated users" ON public.infrastructure_nodes
  FOR SELECT TO authenticated USING (true);

-- Incidents: Visible only to staff and administrators
CREATE POLICY "Incidents staff read policy" ON public.probable_incidents
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id::text = requesting_user_id() AND role IN ('staff', 'admin'))
  );

CREATE POLICY "Incidents staff write policy" ON public.probable_incidents
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id::text = requesting_user_id() AND role IN ('staff', 'admin'))
  );

-- Knowledge Base: Readable by staff and technicians
CREATE POLICY "Knowledge base staff access" ON public.knowledge_base_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id::text = requesting_user_id() AND role IN ('staff', 'admin'))
  );

-- Copilot feedback: Submittable by authenticated staff
CREATE POLICY "Copilot feedback insert" ON public.copilot_feedback
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id::text = requesting_user_id() AND role IN ('staff', 'admin'))
  );
