// Script pour vérifier la structure de pev_opportunities
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.benga.live'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkOpportunities() {
  console.log('=== AUDIT STRUCTURE pev_opportunities ===\n')
  
  // 1. Vérifier la structure de la table
  const { data, error } = await supabase
    .from('pev_opportunities')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('ERREUR pev_opportunities:', error.message)
    console.log('\nLa table n\'existe peut-être pas ou a un problème d\'accès.')
    return
  }
  
  // Si la table existe mais est vide, faire une requête pour voir les colonnes via le schéma
  console.log('Table pev_opportunities existe.')
  console.log('Nombre d\'opportunités:', data?.length || 0)
  
  if (data && data.length > 0) {
    console.log('\nCOLONNES DISPONIBLES:')
    const columns = Object.keys(data[0])
    columns.forEach(col => {
      console.log(`  - ${col}: ${typeof data[0][col]} (${data[0][col]})`)
    })
  } else {
    console.log('\nTable vide - insertion test pour voir les colonnes acceptées')
    
    // Tenter d'insérer une opportunité test pour voir les erreurs de colonnes
    const testData = {
      title: 'TEST_DELETE',
      description: 'Test pour vérifier colonnes',
      type: 'funding',
      status: 'draft'
    }
    
    const { error: insertError } = await supabase
      .from('pev_opportunities')
      .insert([testData])
    
    if (insertError) {
      console.log('\nErreur insertion test:', insertError.message)
      console.log('Details:', insertError.details)
      console.log('Hint:', insertError.hint)
    }
  }
  
  // 2. Vérifier les types d'opportunités si table existe
  console.log('\n=== Vérification pev_opportunity_types ===')
  const { data: types, error: typesError } = await supabase
    .from('pev_opportunity_types')
    .select('*')
    .limit(10)
  
  if (typesError) {
    console.log('Table pev_opportunity_types:', typesError.message)
  } else {
    console.log('Types d\'opportunités:', types?.length || 0)
    if (types && types.length > 0) {
      types.forEach(t => console.log(`  - ${t.name || t.label || JSON.stringify(t)}`))
    }
  }
  
  // 3. Vérifier les templates d'email
  console.log('\n=== Vérification pev_email_templates ===')
  const { data: templates, error: templatesError } = await supabase
    .from('pev_email_templates')
    .select('name, subject, type')
    .limit(20)
  
  if (templatesError) {
    console.log('Table pev_email_templates:', templatesError.message)
  } else {
    console.log('Templates email:', templates?.length || 0)
    if (templates && templates.length > 0) {
      templates.forEach(t => console.log(`  - ${t.name}: ${t.subject}`))
    }
  }
}

checkOpportunities()
