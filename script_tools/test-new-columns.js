import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

const newColumns = [
  'detailed_description',
  'budget_salary', 
  'required_skills',
  'organization',
  'contact_email',
  'contact_phone',
  'funding_amount',
  'funding_type',
  'equity_percentage',
  'stage',
  'job_title',
  'contract_type',
  'partnership_type',
  'duration',
  'partnership_benefits',
  'mission_duration',
  'daily_rate',
  'start_date',
  'visibility',
  'send_notifications'
]

console.log('\n🔍 Test des NOUVELLES colonnes de pev_opportunities:\n')

for (const col of newColumns) {
  const { error } = await supabase.from('pev_opportunities').select(col).limit(1)
  if (error) {
    console.log(`❌ ${col} - MANQUE`)
  } else {
    console.log(`✅ ${col}`)
  }
}
