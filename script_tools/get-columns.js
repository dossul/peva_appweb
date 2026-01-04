import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

const table = process.argv[2] || 'pev_opportunities'

console.log(`\n📋 Colonnes de ${table}:\n`)

const { data, error } = await supabase.from(table).select().limit(1)

if (error) {
  console.log('❌ Erreur:', error.message)
} else if (data && data[0]) {
  Object.keys(data[0]).forEach((col, i) => console.log(`${i+1}. ${col}`))
} else {
  // Table vide - tenter insertion test pour voir erreurs
  console.log('Table vide. Test insertion...')
  const testData = { title: 'TEST', description: 'TEST', type: 'job', created_by: '00000000-0000-0000-0000-000000000000' }
  const { error: insertErr } = await supabase.from(table).insert(testData)
  if (insertErr) {
    console.log('Colonnes requises:', insertErr.message)
  }
}
