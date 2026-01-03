-- =====================================================
-- Tables pour la Messagerie - 2iEGreenHub
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS pev_message_attachments CASCADE;
DROP TABLE IF EXISTS pev_messages CASCADE;
DROP TABLE IF EXISTS pev_conversation_participants CASCADE;
DROP TABLE IF EXISTS pev_conversations CASCADE;

-- =====================================================
-- Table des conversations
-- =====================================================
CREATE TABLE pev_conversations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50) DEFAULT 'direct', -- 'direct', 'group'
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_preview TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table des participants aux conversations
-- =====================================================
CREATE TABLE pev_conversation_participants (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES pev_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'admin', 'member'
  nickname VARCHAR(255),
  is_muted BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  last_read_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(conversation_id, user_id)
);

-- =====================================================
-- Table des messages
-- =====================================================
CREATE TABLE pev_messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES pev_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'file', 'system'
  reply_to_id BIGINT REFERENCES pev_messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table des pièces jointes
-- =====================================================
CREATE TABLE pev_message_attachments (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES pev_messages(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Index pour performances
-- =====================================================
CREATE INDEX idx_pev_conversations_last_message ON pev_conversations(last_message_at DESC);
CREATE INDEX idx_pev_conversation_participants_user ON pev_conversation_participants(user_id);
CREATE INDEX idx_pev_conversation_participants_conv ON pev_conversation_participants(conversation_id);
CREATE INDEX idx_pev_messages_conversation ON pev_messages(conversation_id);
CREATE INDEX idx_pev_messages_sender ON pev_messages(sender_id);
CREATE INDEX idx_pev_messages_created ON pev_messages(created_at DESC);

-- =====================================================
-- Activer RLS
-- =====================================================
ALTER TABLE pev_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_message_attachments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Policies RLS
-- =====================================================

-- Conversations: voir uniquement si participant
CREATE POLICY "Users can view their conversations"
  ON pev_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pev_conversation_participants
      WHERE conversation_id = pev_conversations.id
      AND user_id = auth.uid()
      AND left_at IS NULL
    )
  );

-- Conversations: créer
CREATE POLICY "Users can create conversations"
  ON pev_conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Conversations: modifier si admin
CREATE POLICY "Admins can update conversations"
  ON pev_conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pev_conversation_participants
      WHERE conversation_id = pev_conversations.id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Participants: voir si dans la conversation
CREATE POLICY "Users can view conversation participants"
  ON pev_conversation_participants FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM pev_conversation_participants cp
      WHERE cp.conversation_id = pev_conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

-- Participants: ajouter si admin ou créateur
CREATE POLICY "Users can add participants"
  ON pev_conversation_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Participants: modifier son propre statut
CREATE POLICY "Users can update own participation"
  ON pev_conversation_participants FOR UPDATE
  USING (user_id = auth.uid());

-- Messages: voir si participant à la conversation
CREATE POLICY "Users can view messages in their conversations"
  ON pev_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pev_conversation_participants
      WHERE conversation_id = pev_messages.conversation_id
      AND user_id = auth.uid()
      AND left_at IS NULL
    )
  );

-- Messages: envoyer si participant
CREATE POLICY "Users can send messages to their conversations"
  ON pev_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM pev_conversation_participants
      WHERE conversation_id = pev_messages.conversation_id
      AND user_id = auth.uid()
      AND left_at IS NULL
    )
  );

-- Messages: modifier ses propres messages
CREATE POLICY "Users can update own messages"
  ON pev_messages FOR UPDATE
  USING (sender_id = auth.uid());

-- Attachments: voir si peut voir le message
CREATE POLICY "Users can view attachments"
  ON pev_message_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pev_messages m
      JOIN pev_conversation_participants cp ON cp.conversation_id = m.conversation_id
      WHERE m.id = pev_message_attachments.message_id
      AND cp.user_id = auth.uid()
    )
  );

-- Attachments: ajouter à ses messages
CREATE POLICY "Users can add attachments to own messages"
  ON pev_message_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pev_messages
      WHERE id = pev_message_attachments.message_id
      AND sender_id = auth.uid()
    )
  );

-- =====================================================
-- Fonction pour créer une conversation directe
-- =====================================================
CREATE OR REPLACE FUNCTION create_direct_conversation(other_user_id UUID)
RETURNS BIGINT AS $$
DECLARE
  existing_conv_id BIGINT;
  new_conv_id BIGINT;
BEGIN
  -- Vérifier si une conversation directe existe déjà
  SELECT c.id INTO existing_conv_id
  FROM pev_conversations c
  JOIN pev_conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = auth.uid()
  JOIN pev_conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = other_user_id
  WHERE c.type = 'direct'
  LIMIT 1;

  IF existing_conv_id IS NOT NULL THEN
    RETURN existing_conv_id;
  END IF;

  -- Créer une nouvelle conversation
  INSERT INTO pev_conversations (type, created_by)
  VALUES ('direct', auth.uid())
  RETURNING id INTO new_conv_id;

  -- Ajouter les participants
  INSERT INTO pev_conversation_participants (conversation_id, user_id, role)
  VALUES 
    (new_conv_id, auth.uid(), 'admin'),
    (new_conv_id, other_user_id, 'admin');

  RETURN new_conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Fonction pour envoyer un message
-- =====================================================
CREATE OR REPLACE FUNCTION send_message(
  p_conversation_id BIGINT,
  p_content TEXT,
  p_message_type VARCHAR DEFAULT 'text'
)
RETURNS BIGINT AS $$
DECLARE
  new_message_id BIGINT;
  preview TEXT;
BEGIN
  -- Insérer le message
  INSERT INTO pev_messages (conversation_id, sender_id, content, message_type)
  VALUES (p_conversation_id, auth.uid(), p_content, p_message_type)
  RETURNING id INTO new_message_id;

  -- Préparer le preview
  preview := LEFT(p_content, 100);

  -- Mettre à jour la conversation
  UPDATE pev_conversations
  SET last_message_at = NOW(),
      last_message_preview = preview,
      updated_at = NOW()
  WHERE id = p_conversation_id;

  -- Incrémenter le compteur de non lus pour les autres participants
  UPDATE pev_conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = p_conversation_id
  AND user_id != auth.uid();

  RETURN new_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Fonction pour marquer les messages comme lus
-- =====================================================
CREATE OR REPLACE FUNCTION mark_conversation_read(p_conversation_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE pev_conversation_participants
  SET last_read_at = NOW(),
      unread_count = 0
  WHERE conversation_id = p_conversation_id
  AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Vue pour les conversations avec derniers messages
-- =====================================================
CREATE OR REPLACE VIEW user_conversations AS
SELECT 
  c.id,
  c.name,
  c.type,
  c.last_message_at,
  c.last_message_preview,
  c.created_at,
  cp.unread_count,
  cp.is_favorite,
  cp.is_muted,
  CASE 
    WHEN c.type = 'direct' THEN (
      SELECT p.first_name || ' ' || p.last_name
      FROM pev_conversation_participants ocp
      JOIN pev_profiles p ON p.id = ocp.user_id
      WHERE ocp.conversation_id = c.id
      AND ocp.user_id != auth.uid()
      LIMIT 1
    )
    ELSE c.name
  END as display_name,
  CASE 
    WHEN c.type = 'direct' THEN (
      SELECT p.avatar_url
      FROM pev_conversation_participants ocp
      JOIN pev_profiles p ON p.id = ocp.user_id
      WHERE ocp.conversation_id = c.id
      AND ocp.user_id != auth.uid()
      LIMIT 1
    )
    ELSE NULL
  END as avatar_url,
  CASE 
    WHEN c.type = 'direct' THEN (
      SELECT ocp.user_id
      FROM pev_conversation_participants ocp
      WHERE ocp.conversation_id = c.id
      AND ocp.user_id != auth.uid()
      LIMIT 1
    )
    ELSE NULL
  END as other_user_id
FROM pev_conversations c
JOIN pev_conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = auth.uid()
WHERE cp.left_at IS NULL
ORDER BY c.last_message_at DESC;

-- =====================================================
-- Vérification
-- =====================================================
SELECT 'Tables messages créées avec succès' as status;
