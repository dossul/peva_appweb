import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

const table = process.argv[2] || 'pev_opportunities'

// Colonnes potentielles à tester
const columns = [
  'id', 'created_by', 'company_id', 'title', 'description', 'type', 'category',
  'location', 'country', 'region', 'city', 'is_remote', 'salary_min', 'salary_max',
  'currency', 'requirements', 'deadline', 'status', 'views_count', 'applications_count',
  'created_at', 'updated_at',
  // Colonnes potentiellement manquantes
  'attachments', 'promote_premium', 'auto_share_social', 'social_links', 
  'premium_starts_at', 'premium_ends_at'
]

console.log(`\n🔍 Test des colonnes de ${table}:\n`)

for (const col of columns) {
  const { error } = await supabase.from(table).select(col).limit(1)
  if (error && error.message.includes('does not exist')) {
    console.log(`❌ ${col} - N'EXISTE PAS`)
  } else {
    console.log(`✅ ${col}`)
  }
}
