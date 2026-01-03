# 🔐 Credentials des Comptes Administrateurs

> **Instance Supabase:** https://supabase.benga.live  
> **Date de création:** 2 janvier 2026  
> **Méthode:** API Admin Supabase (`supabaseAdmin.auth.admin.createUser()`)

---

## 📋 Comptes Créés

### 🔴 Super Administrateur

| Champ | Valeur |
|-------|--------|
| **Email** | superadmin@2iegreenhub.org |
| **Password** | SuperAdmin@2iE2026! |
| **User ID** | 7abd1a2f-261a-4db0-922d-d11317c7282f |
| **Role** | super_admin |
| **User Type** | admin |

---

### 🟠 Administrateur

| Champ | Valeur |
|-------|--------|
| **Email** | admin@2iegreenhub.org |
| **Password** | Admin@2iE2026! |
| **User ID** | d5080418-554c-49ea-9272-49a150c08526 |
| **Role** | admin |
| **User Type** | admin |

---

### 🟡 Modérateur

| Champ | Valeur |
|-------|--------|
| **Email** | moderator@2iegreenhub.org |
| **Password** | Moderator@2iE2026! |
| **User ID** | 2ddb012c-19c6-497d-8660-bd1d0fe1804d |
| **Role** | moderator |
| **User Type** | moderator |

---

### 🟢 Utilisateurs Standards

#### Entrepreneur

| Champ | Valeur |
|-------|--------|
| **Email** | entrepreneur@2iegreenhub.org |
| **Password** | User@2iE2026! |
| **User ID** | 386c2608-f15f-4e54-ac08-1939e1266803 |
| **Role** | user |
| **User Type** | entrepreneur |

#### Investisseur

| Champ | Valeur |
|-------|--------|
| **Email** | investor@2iegreenhub.org |
| **Password** | User@2iE2026! |
| **User ID** | f4a4394b-49e1-4cff-8e75-0e6e2e798375 |
| **Role** | user |
| **User Type** | investor |

#### Chercheur

| Champ | Valeur |
|-------|--------|
| **Email** | researcher@2iegreenhub.org |
| **Password** | User@2iE2026! |
| **User ID** | 5c7cb2ed-0400-491d-8476-af06fbca5e86 |
| **Role** | user |
| **User Type** | researcher |

---

## 🚀 Résumé Rapide

```
ADMIN        → admin@2iegreenhub.org         | Admin@2iE2026!
SUPER_ADMIN  → superadmin@2iegreenhub.org    | SuperAdmin@2iE2026!
MODERATOR    → moderator@2iegreenhub.org     | Moderator@2iE2026!
ENTREPRENEUR → entrepreneur@2iegreenhub.org  | User@2iE2026!
INVESTOR     → investor@2iegreenhub.org      | User@2iE2026!
RESEARCHER   → researcher@2iegreenhub.org    | User@2iE2026!
```

---

## ⚠️ Notes de Sécurité

- **NE PAS** commiter ce fichier avec les mots de passe en production
- Changer les mots de passe après le premier déploiement
- Ajouter `ADMIN_CREDENTIALS.md` au `.gitignore` si nécessaire

---

## 🔧 Script de Création

Les comptes ont été créés avec le script:
```
script_tools/create-users-via-api.js
```

Ce script utilise l'API Admin Supabase pour créer les utilisateurs correctement.

---

*Dernière mise à jour: 2 janvier 2026 - 15:56 UTC*
