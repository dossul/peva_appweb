/**
 * Script de vérification des buckets Supabase Storage
 * Vérifie quels buckets existent et lesquels manquent
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

// Liste de TOUS les buckets requis par le projet PEVA
const REQUIRED_BUCKETS = [
  { name: 'avatars', public: true, description: 'Photos de profil utilisateurs' },
  { name: 'logos', public: true, description: 'Logos des entreprises' },
  { name: 'documents', public: true, description: 'Documents opportunités, ressources' },
  { name: 'images', public: true, description: 'Images générales du contenu' },
  { name: 'videos', public: false, description: 'Vidéos uploadées' },
  { name: 'greenhub-private', public: false, description: 'Rapports RSE confidentiels' }
]

console.log('\n📦 VÉRIFICATION DES BUCKETS SUPABASE STORAGE\n')
console.log('=' .repeat(60))

// Récupérer les buckets existants
const { data: existingBuckets, error } = await supabase.storage.listBuckets()

if (error) {
  console.log('\n❌ ERREUR lors de la récupération des buckets:', error.message)
  console.log('\n⚠️ Note: listBuckets() peut nécessiter des droits admin (service_role key)')
  process.exit(1)
}

const existingNames = (existingBuckets || []).map(b => b.name)

console.log('\n📋 BUCKETS EXISTANTS:')
if (existingBuckets && existingBuckets.length > 0) {
  existingBuckets.forEach(b => {
    console.log(`   ✅ ${b.name} (public: ${b.public})`)
  })
} else {
  console.log('   ⚠️ Aucun bucket trouvé')
}

console.log('\n📋 BUCKETS REQUIS PAR LE PROJET:')
const missingBuckets = []

for (const bucket of REQUIRED_BUCKETS) {
  if (existingNames.includes(bucket.name)) {
    console.log(`   ✅ ${bucket.name} - ${bucket.description}`)
  } else {
    console.log(`   ❌ ${bucket.name} - ${bucket.description} [MANQUANT]`)
    missingBuckets.push(bucket)
  }
}

console.log('\n' + '=' .repeat(60))

if (missingBuckets.length === 0) {
  console.log('\n🎉 TOUS LES BUCKETS SONT PRÉSENTS!\n')
} else {
  console.log(`\n⚠️ ${missingBuckets.length} BUCKET(S) MANQUANT(S):\n`)
  missingBuckets.forEach(b => {
    console.log(`   - ${b.name} (public: ${b.public})`)
  })
  
  console.log('\n📝 SQL POUR CRÉER LES BUCKETS MANQUANTS:\n')
  console.log('-- Exécutez ce SQL dans votre panel Supabase (SQL Editor)\n')
  
  for (const bucket of missingBuckets) {
    console.log(`-- Créer bucket: ${bucket.name}`)
    console.log(`INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)`)
    console.log(`VALUES ('${bucket.name}', '${bucket.name}', ${bucket.public}, 52428800, NULL)`)
    console.log(`ON CONFLICT (id) DO NOTHING;\n`)
  }
  
  console.log('-- Policies RLS pour accès public aux buckets publics\n')
  
  for (const bucket of missingBuckets.filter(b => b.public)) {
    console.log(`-- Policies pour ${bucket.name}`)
    console.log(`CREATE POLICY "Allow public read ${bucket.name}" ON storage.objects`)
    console.log(`FOR SELECT TO public USING (bucket_id = '${bucket.name}');`)
    console.log(`CREATE POLICY "Allow authenticated upload ${bucket.name}" ON storage.objects`)
    console.log(`FOR INSERT TO authenticated WITH CHECK (bucket_id = '${bucket.name}');`)
    console.log(`CREATE POLICY "Allow owner delete ${bucket.name}" ON storage.objects`)
    console.log(`FOR DELETE TO authenticated USING (bucket_id = '${bucket.name}' AND auth.uid()::text = (storage.foldername(name))[1]);\n`)
  }
  
  for (const bucket of missingBuckets.filter(b => !b.public)) {
    console.log(`-- Policies pour ${bucket.name} (privé)`)
    console.log(`CREATE POLICY "Allow authenticated access ${bucket.name}" ON storage.objects`)
    console.log(`FOR ALL TO authenticated USING (bucket_id = '${bucket.name}')`)
    console.log(`WITH CHECK (bucket_id = '${bucket.name}');\n`)
  }
}

console.log('=' .repeat(60))
console.log('\n')
