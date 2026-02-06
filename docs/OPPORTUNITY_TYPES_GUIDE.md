# Guide des Types d'Opportunités - 2iE GreenHub

**Date de création:** 5 février 2026  
**Dernière mise à jour:** 5 février 2026  
**Statut:** ✅ Harmonisé

---

## 📋 Exigences Client

Les types d'opportunités demandés par le client sont:

| Type (Affichage) | Valeur (BDD) | Icône |
|------------------|--------------|-------|
| Appels à projets | `appels_projets` | `mdi-bullhorn` |
| Stages | `stages` | `mdi-account-school` |
| Thèses | `theses` | `mdi-school` |
| Fundraising | `fundraising` | `mdi-currency-usd` |
| Emplois | `emplois` | `mdi-briefcase` |
| Vente/Achat équipements | `vente_equipements` | `mdi-package-variant` |
| Vente/Achat matières | `vente_matieres` | `mdi-leaf` |
| Idées business | `idees_business` | `mdi-lightbulb` |

---

## 🔧 Corrections du 5 février 2026

### Faute d'orthographe corrigée
- ❌ **Avant:** "Found raising"
- ✅ **Après:** "Fundraising"

### Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| `src/views/OpportunitiesView.vue` | Corrigé "Found raising" → "Fundraising" |
| `src/views/CreateOpportunityView.vue` | Nouveaux types harmonisés |
| `src/views/create/CreateOpportunityView.vue` | Nouveaux types harmonisés |
| `src/views/ProfileView.vue` | Couleurs et icônes mises à jour |
| `src/views/DashboardView.vue` | Fonctions helper ajoutées |
| `src/components/admin/AdminOpportunitiesManager.vue` | Types de filtres mis à jour |

---

## 📊 Mapping Couleurs

```javascript
const colors = {
  'appels_projets': 'blue',
  'stages': 'green',
  'theses': 'purple',
  'fundraising': 'orange',
  'emplois': 'teal',
  'vente_equipements': 'indigo',
  'vente_matieres': 'pink',
  'idees_business': 'amber'
}
```

---

## 🎨 Mapping Icônes

```javascript
const icons = {
  'appels_projets': 'mdi-bullhorn',
  'stages': 'mdi-account-school',
  'theses': 'mdi-school',
  'fundraising': 'mdi-currency-usd',
  'emplois': 'mdi-briefcase',
  'vente_equipements': 'mdi-package-variant',
  'vente_matieres': 'mdi-leaf',
  'idees_business': 'mdi-lightbulb'
}
```

---

## 📁 Structure de la Table `pev_opportunities`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | Identifiant unique |
| title | text | Titre de l'opportunité |
| description | text | Description détaillée |
| type | text | Type (voir tableau ci-dessus) |
| category | text | Catégorie/Secteur |
| organization | text | Organisation proposant |
| location | text | Localisation |
| deadline | date | Date limite |
| amount | numeric | Montant (si applicable) |
| status | text | Statut (draft, published, closed) |
| created_by | uuid | FK vers auth.users |
| created_at | timestamp | Date de création |

---

## ⚠️ Règles à Suivre

### ❌ NE JAMAIS FAIRE

1. **Ne jamais utiliser les anciens types:**
   - `job` → utiliser `emplois`
   - `internship` → utiliser `stages`
   - `funding` → utiliser `fundraising`
   - `partnership` → type supprimé (utiliser une autre catégorie)
   - `tender` → utiliser `appels_projets`
   - `contract` → type supprimé

2. **Ne jamais mal orthographier "Fundraising":**
   - ❌ "Found raising"
   - ❌ "Fund raising"
   - ✅ "Fundraising"

### ✅ TOUJOURS FAIRE

1. **Utiliser les valeurs snake_case en BDD:**
   ```javascript
   // Bon
   type: 'appels_projets'
   type: 'idees_business'
   
   // Mauvais
   type: 'Appels à projets'
   type: 'idées business'
   ```

2. **Afficher les labels avec accents pour l'UI:**
   ```javascript
   getLabel('theses') // → "Thèses"
   getLabel('idees_business') // → "Idées business"
   ```

---

## 🔄 Fonctions Helper

### getOpportunityTypeColor(type)
Retourne la couleur Vuetify pour un type donné.

### getOpportunityTypeLabel(type)
Retourne le label d'affichage avec accents.

### Exemple d'utilisation
```vue
<v-chip :color="getOpportunityTypeColor(opportunity.type)">
  {{ getOpportunityTypeLabel(opportunity.type) }}
</v-chip>
```

---

## 📝 Checklist Avant Ajout de Nouveau Type

- [ ] Ajouter la valeur dans `opportunityTypes` de CreateOpportunityView.vue
- [ ] Ajouter le mapping couleur dans tous les fichiers concernés
- [ ] Ajouter le mapping icône
- [ ] Ajouter dans les filtres admin
- [ ] Tester l'affichage sur OpportunitiesView.vue
- [ ] Mettre à jour cette documentation

---

*Document généré automatiquement - 2iE GreenHub Platform*
