import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

console.log('\n📦 Liste des buckets Supabase Storage:\n')

const { data, error } = await supabase.storage.listBuckets()

if (error) {
  console.log('❌ Erreur:', error.message)
} else if (data && data.length > 0) {
  data.forEach(bucket => {
    console.log(`✅ ${bucket.name} (public: ${bucket.public})`)
  })
} else {
  console.log('⚠️ Aucun bucket trouvé')
}
