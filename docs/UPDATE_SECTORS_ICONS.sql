-- Ajout des icônes Material Design pour les secteurs d'activité
-- À exécuter dans Supabase SQL Editor
-- Icônes choisies pour éviter conflits avec modules plateforme

UPDATE pev_sectors SET icon = 'mdi-sprout' WHERE slug = 'agriculture-durable';
UPDATE pev_sectors SET icon = 'mdi-food-apple' WHERE slug = 'agroalimentaire';
UPDATE pev_sectors SET icon = 'mdi-hammer' WHERE slug = 'construction-ecologique';
UPDATE pev_sectors SET icon = 'mdi-water' WHERE slug = 'eau-assainissement';
UPDATE pev_sectors SET icon = 'mdi-palm-tree' WHERE slug = 'ecotourisme';
UPDATE pev_sectors SET icon = 'mdi-solar-power' WHERE slug = 'energie-renouvelable';
UPDATE pev_sectors SET icon = 'mdi-recycle' WHERE slug = 'gestion-dechets';
UPDATE pev_sectors SET icon = 'mdi-bus-electric' WHERE slug = 'transport-vert';

-- Vérification
SELECT name, slug, icon, color FROM pev_sectors ORDER BY sort_order;

/*
COHÉRENCE AVEC MODULES PLATEFORME:
✅ Aucun conflit visuel détecté

Modules plateforme (existants):
- Tableau de Bord: mdi-view-dashboard
- Annuaire: mdi-map-search
- Entreprises & RSE: mdi-domain (building)
- Place de Marché: mdi-briefcase
- Ressources: mdi-library
- Événements: mdi-calendar-star

Secteurs (nouveaux):
- Agriculture: mdi-sprout (pousse)
- Agroalimentaire: mdi-food-apple (pomme)
- Construction: mdi-hammer (marteau) ← CHANGÉ pour éviter conflit avec mdi-domain
- Eau: mdi-water (goutte)
- Écotourisme: mdi-palm-tree (palmier) ← CHANGÉ plus évocateur
- Énergie: mdi-solar-power (solaire)
- Déchets: mdi-recycle (recyclage) ← CHANGÉ plus positif
- Transport: mdi-bus-electric (bus électrique)
*/
