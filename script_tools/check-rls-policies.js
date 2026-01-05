/**
 * Script pour lister toutes les policies RLS sur les tables de messagerie
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

console.log('\n🔍 VÉRIFICATION DES POLICIES RLS SUR TABLES MESSAGERIE\n')

// Requête pour lister les policies
const { data, error } = await supabase.rpc('get_policies_info')

if (error) {
  console.log('Impossible de récupérer les policies via RPC')
  console.log('Erreur:', error.message)
  
  // Test direct sur les tables
  console.log('\n📋 Test direct des tables:\n')
  
  const tables = ['pev_messages', 'pev_conversation_participants', 'pev_conversations']
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1)
    console.log(`${table}: ${error ? '❌ ' + error.message : '✅ OK'}`)
  }
}

console.log('\n')
