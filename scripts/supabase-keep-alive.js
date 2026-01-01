#!/usr/bin/env node

/**
 * Script Keep-Alive pour Supabase (Plan Gratuit)
 * 
 * Ce script effectue une requête simple à la base de données Supabase
 * pour éviter que l'instance ne se mette en pause après 1 semaine d'inactivité.
 * 
 * Usage:
 * - Exécution manuelle: node supabase-keep-alive.js
 * - Cron (Linux/Mac): Ajouter à crontab -e:
 *   0 2 * * * cd /path/to/peva_appweb/scripts && node supabase-keep-alive.js
 * - Windows Task Scheduler: Créer une tâche planifiée quotidienne
 * - GitHub Actions: Voir .github/workflows/supabase-keep-alive.yml
 */

const https = require('https')
const { createClient } = require('@supabase/supabase-js')

// Configuration depuis variables d'environnement
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vvmahjuwrswdnaugsmcz.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWFoanV3cnN3ZG5hdWdzbWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODE2NDAsImV4cCI6MjA3Mzg1NzY0MH0.Znn0gSEHvwPoN9HQ92tdwLuM65Q25oC17IXUW-ooF-g'

// Créer client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function keepAlive() {
  const timestamp = new Date().toISOString()
  
  try {
    console.log(`[${timestamp}] 🔄 Exécution du keep-alive Supabase...`)

    // Requête simple: compter les profils (lecture seule, pas d'impact)
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.error(`[${timestamp}] ❌ Erreur:`, error.message)
      process.exit(1)
    }

    console.log(`[${timestamp}] ✅ Supabase actif - ${count || 0} profils dans la base`)
    console.log(`[${timestamp}] 🎯 Prochaine exécution recommandée: dans 24h`)
    
    // Log dans un fichier pour historique (optionnel)
    logToFile(timestamp, count)

  } catch (error) {
    console.error(`[${timestamp}] ❌ Exception:`, error.message)
    process.exit(1)
  }
}

function logToFile(timestamp, count) {
  const fs = require('fs')
  const path = require('path')
  
  const logDir = path.join(__dirname, '../logs')
  const logFile = path.join(logDir, 'supabase-keep-alive.log')

  // Créer dossier logs si nécessaire
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  const logEntry = `${timestamp} | SUCCESS | ${count} profils\n`
  
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.warn('⚠️ Impossible d\'écrire dans le log:', err.message)
    }
  })

  // Nettoyer les vieux logs (garder 30 derniers jours)
  cleanOldLogs(logFile)
}

function cleanOldLogs(logFile) {
  const fs = require('fs')
  
  try {
    const stats = fs.statSync(logFile)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    if (stats.mtimeMs < thirtyDaysAgo) {
      // Archiver ou supprimer
      const archiveFile = logFile.replace('.log', `-archive-${Date.now()}.log`)
      fs.renameSync(logFile, archiveFile)
      console.log(`📦 Log archivé: ${archiveFile}`)
    }
  } catch (error) {
    // Fichier n'existe pas encore, pas grave
  }
}

// Exécution
keepAlive()
