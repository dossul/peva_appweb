import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

console.log('\n📋 Liste des opportunités dans pev_opportunities:\n')

const { data, error } = await supabase
  .from('pev_opportunities')
  .select('id, title, status, type, created_at, created_by')
  .order('created_at', { ascending: false })
  .limit(10)

if (error) {
  console.log('❌ Erreur:', error.message)
} else if (data && data.length > 0) {
  console.log(`✅ ${data.length} opportunité(s) trouvée(s):\n`)
  data.forEach((opp, i) => {
    console.log(`${i+1}. ${opp.title}`)
    console.log(`   ID: ${opp.id}`)
    console.log(`   Status: ${opp.status}`)
    console.log(`   Type: ${opp.type}`)
    console.log(`   Créé: ${opp.created_at}`)
    console.log(`   Par: ${opp.created_by}`)
    console.log('')
  })
} else {
  console.log('⚠️ Aucune opportunité trouvée dans la table')
}
