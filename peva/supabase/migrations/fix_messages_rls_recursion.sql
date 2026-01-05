-- ============================================================
-- MIGRATION: Corriger la récursion infinie des policies RLS
-- Date: 2026-01-04 (v2 - correction complète)
-- Description: Corrige l'erreur 500 sur TOUTES les tables messagerie
-- ============================================================

-- ============================================================
-- 1. DÉSACTIVER RLS temporairement pour nettoyer
-- ============================================================

ALTER TABLE IF EXISTS pev_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pev_conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pev_messages DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. SUPPRIMER TOUTES les policies existantes
-- ============================================================

-- pev_conversations
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pev_conversations'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON pev_conversations', pol.policyname);
  END LOOP;
END $$;

-- pev_conversation_participants
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pev_conversation_participants'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON pev_conversation_participants', pol.policyname);
  END LOOP;
END $$;

-- pev_messages
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pev_messages'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON pev_messages', pol.policyname);
  END LOOP;
END $$;

-- ============================================================
-- 3. RECRÉER les policies SIMPLES sans récursion
-- ============================================================

-- === pev_conversations ===
CREATE POLICY "conversations_select" ON pev_conversations
FOR SELECT TO authenticated USING (true);

CREATE POLICY "conversations_insert" ON pev_conversations
FOR INSERT TO authenticated WITH CHECK (true);

-- === pev_conversation_participants ===
CREATE POLICY "participants_select" ON pev_conversation_participants
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "participants_insert" ON pev_conversation_participants
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "participants_delete" ON pev_conversation_participants
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- === pev_messages ===
CREATE POLICY "messages_select" ON pev_messages
FOR SELECT TO authenticated USING (sender_id = auth.uid());

CREATE POLICY "messages_insert" ON pev_messages
FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

CREATE POLICY "messages_update" ON pev_messages
FOR UPDATE TO authenticated USING (sender_id = auth.uid());

CREATE POLICY "messages_delete" ON pev_messages
FOR DELETE TO authenticated USING (sender_id = auth.uid());

-- ============================================================
-- 4. RÉACTIVER RLS
-- ============================================================

ALTER TABLE pev_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
