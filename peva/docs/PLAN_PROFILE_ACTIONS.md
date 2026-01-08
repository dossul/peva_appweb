# 📋 PLAN IMPLÉMENTATION - Actions Profil Utilisateur

> **Date** : 8 janvier 2026 - 23:30 UTC  
> **Vue concernée** : `src/views/ProfileView.vue`, `src/views/UserProfileView.vue`  
> **Statut** : ✅ IMPLÉMENTÉ

---

## ✅ VÉRIFICATION COMPLÈTE DE L'EXISTANT

### Tables et Fonctions Supabase CONFIRMÉES

| Élément | Statut | Fichier Source |
|---------|--------|----------------|
| `pev_connections` | ✅ EXISTE | Utilisé dans `connectionService.js` |
| `pev_conversations` | ✅ EXISTE | `migrations/create_messages_tables.sql` |
| `pev_favorites` | ✅ EXISTE | Utilisé dans `resourcesService.js`, `opportunitiesService.js` |
| RPC `create_direct_conversation` | ✅ EXISTE | `migrations/create_messages_tables.sql:206` |

### Colonnes `pev_connections` (vérifiées dans le code)

```javascript
// connectionService.js:39-44
.insert({
  requester_id: user.id,        // UUID - FK vers auth.users
  addressee_id: targetUserId,   // UUID - FK vers auth.users
  message: requestData.message, // TEXT - message optionnel
  status: 'pending',            // VARCHAR - 'pending'|'accepted'|'declined'
  requested_at: new Date()      // TIMESTAMPTZ
})
```

**Colonnes supplémentaires utilisées** : `responded_at`, `created_at`

### Colonnes `pev_favorites` (vérifiées dans le code)

```javascript
// resourcesService.js:453-456
.insert([{
  entity_type: 'resource',      // VARCHAR - pas un ENUM
  entity_id: resourceId.toString(), // VARCHAR/TEXT
  user_id: userId               // UUID
}])
```

**Valeurs `entity_type` existantes** : `'resource'`, `'opportunity'`

### Services Existants UTILISABLES

| Service | Fonction | Prêt à l'emploi |
|---------|----------|-----------------|
| `connectionService.sendRequest()` | Envoyer demande connexion | ✅ OUI |
| `connectionService.getConnections()` | Lister connexions | ✅ OUI |
| `connectionService.areConnected()` | Vérifier si connecté | ✅ OUI |
| `messagesService.getOrCreateDirectConversation()` | Créer/récupérer conversation | ✅ OUI |
| `resourcesService.addToFavorites()` | Ajouter favori | ⚠️ Pour `resource` uniquement |

---

## ⚠️ ÉLÉMENTS MANQUANTS - AUTORISATION REQUISE

### 1. Route `/user/:id` - N'EXISTE PAS

**Problème** : Impossible de voir le profil d'un autre utilisateur.

**Action requise** : Ajouter dans `src/router/index.js`
```javascript
{
  path: '/user/:id',
  name: 'UserProfile',
  component: () => import('@/views/UserProfileView.vue'),
  meta: { requiresAuth: true, title: 'Profil Utilisateur - 2iE GreenHub' }
}
```

**Autorisation** : [ ] OUI / [ ] NON

---

### 2. Vue `UserProfileView.vue` - N'EXISTE PAS

**Problème** : Pas de composant pour afficher le profil d'un autre utilisateur.

**Action requise** : Créer `src/views/UserProfileView.vue`

**Autorisation** : [ ] OUI / [ ] NON

---

### 3. Fonction `getConnectionStatus()` - N'EXISTE PAS

**Problème** : Pas de fonction pour vérifier le statut de connexion avec un utilisateur.

**Action requise** : Ajouter dans `src/services/connectionService.js`
```javascript
async getConnectionStatus(targetUserId) {
  // Retourne: 'none' | 'pending' | 'connected' | 'declined' | 'self'
}
```

**Autorisation** : [ ] OUI / [ ] NON

---

### 4. Favoris Utilisateurs - `entity_type: 'user'` NON TESTÉ

**Problème** : `pev_favorites.entity_type` accepte actuellement `'resource'` et `'opportunity'`.
Si c'est un VARCHAR simple (pas un ENUM), on peut ajouter `'user'` sans migration.

**Action requise** : 
- **Option A** : Tester l'insertion avec `entity_type: 'user'` (si VARCHAR → fonctionne)
- **Option B** : Si ENUM → migration SQL pour ajouter `'user'`

**Autorisation pour tester Option A** : [ ] OUI / [ ] NON

---

### 5. Fonctions Favoris Utilisateurs - N'EXISTENT PAS

**Problème** : Pas de fonctions pour gérer les favoris d'utilisateurs.

**Action requise** : Ajouter dans `src/services/connectionService.js`
```javascript
async addUserToFavorites(targetUserId) { ... }
async removeUserFromFavorites(targetUserId) { ... }
async isUserFavorite(targetUserId) { ... }
```

**Autorisation** : [ ] OUI / [ ] NON

---

## 🔍 ANALYSE COMPLÈTE

### ❌ Problème Identifié

La page `/profile` affiche **son propre profil** mais contient 3 boutons d'action destinés à interagir avec **un autre utilisateur** :

| Bouton | Problème |
|--------|----------|
| **SE CONNECTER** | Affiché sur son propre profil = incohérent |
| **ENVOYER UN MESSAGE** | Pas de destinataire (on est sur son propre profil) |
| **AJOUTER AUX FAVORIS** | S'ajouter soi-même aux favoris = absurde |

### 🔎 Analyse du Code Actuel

**Fichier** : `@/src/views/ProfileView.vue:46-56`
```vue
<!-- Actions - PROBLÈME: Ces boutons sont pour interagir avec AUTRUI -->
<div class="d-flex flex-column ga-2">
  <v-btn color="white" variant="flat" prepend-icon="mdi-plus" class="text-green-darken-2">
    Se connecter
  </v-btn>
  <v-btn color="white" variant="outlined" prepend-icon="mdi-email">
    Envoyer un message
  </v-btn>
  <v-btn color="white" variant="outlined" prepend-icon="mdi-heart">
    Ajouter aux favoris
  </v-btn>
</div>
```

**Cause racine** : Il n'existe PAS de route `/profile/:id` pour voir le profil d'un autre utilisateur.

---

## 📊 RESSOURCES EXISTANTES

### Tables Supabase Vérifiées

| Table | Statut | Colonnes Clés |
|-------|--------|---------------|
| `pev_connections` | ✅ Existe | `requester_id`, `addressee_id`, `status` (pending/accepted/declined), `message`, `requested_at`, `responded_at` |
| `pev_messages` | ✅ Existe | `conversation_id`, `sender_id`, `content`, `is_edited`, `is_deleted` |
| `pev_conversations` | ✅ Existe | `type` (direct/group), `name`, `created_by` |
| `pev_conversation_participants` | ✅ Existe | `conversation_id`, `user_id`, `role`, `is_muted`, `is_favorite` |
| `pev_favorites` | ✅ Existe | `entity_type`, `entity_id`, `user_id` |

### Services Existants

| Service | Fonction | Statut |
|---------|----------|--------|
| `connectionService.js` | `sendRequest(requestData)` | ✅ Complet (avec emails et notifications) |
| `connectionService.js` | `acceptRequest(requestId)` | ✅ Complet |
| `connectionService.js` | `declineRequest(requestId)` | ✅ Complet |
| `connectionService.js` | `getConnections(userId)` | ✅ Complet |
| `messagesService.js` | `getOrCreateDirectConversation(otherUserId)` | ✅ Utilise RPC `create_direct_conversation` |
| `messagesService.js` | `sendMessage(conversationId, content)` | ✅ Complet |
| `resourcesService.js` | `addToFavorites(entityId, userId)` | ✅ Pour `entity_type: 'resource'` |
| `opportunitiesService.js` | `addToFavorites(entityId, userId)` | ✅ Pour `entity_type: 'opportunity'` |

### ⚠️ Manques Identifiés

| Élément | Statut | Impact |
|---------|--------|--------|
| Route `/profile/:id` | ❌ N'existe pas | Impossible de voir le profil d'un autre utilisateur |
| `UserProfileView.vue` | ❌ N'existe pas | Pas de vue pour profil externe |
| Favoris utilisateurs | ❌ Pas supporté | `pev_favorites` ne supporte que `resource` et `opportunity`, pas `user` |

---

## 🎯 PLAN D'IMPLÉMENTATION GRANULAIRE

### 📌 Prérequis : Créer la Vue Profil Externe

Avant d'implémenter les 3 fonctionnalités, il faut créer une vue pour voir le profil d'un **AUTRE** utilisateur.

---

### PHASE 0 : Infrastructure (Prérequis)

#### 0.1 - Créer `UserProfileView.vue`

**Fichier à créer** : `src/views/UserProfileView.vue`

**Fonctionnalités** :
- Afficher le profil d'un utilisateur via son ID (route param)
- Charger les données depuis `pev_profiles` par ID
- Afficher les 3 boutons d'action (SE CONNECTER, MESSAGE, FAVORIS)
- Gérer le cas où l'ID est celui de l'utilisateur connecté → rediriger vers `/profile`

**Template** :
```vue
<template>
  <div class="user-profile-view">
    <!-- Si c'est son propre profil → afficher bouton "Modifier mon profil" -->
    <!-- Sinon → afficher les 3 boutons d'action -->
    
    <template v-if="isOwnProfile">
      <v-btn color="green" @click="router.push('/profile')">
        Modifier mon profil
      </v-btn>
    </template>
    
    <template v-else>
      <!-- Bouton SE CONNECTER -->
      <v-btn v-if="!isConnected && !hasPendingRequest" @click="openConnectionDialog">
        Se connecter
      </v-btn>
      <v-btn v-else-if="hasPendingRequest" disabled>
        Demande envoyée
      </v-btn>
      <v-btn v-else color="green" disabled>
        <v-icon>mdi-check</v-icon> Connecté
      </v-btn>
      
      <!-- Bouton ENVOYER MESSAGE -->
      <v-btn @click="sendMessage">
        Envoyer un message
      </v-btn>
      
      <!-- Bouton FAVORIS -->
      <v-btn @click="toggleFavorite">
        {{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
      </v-btn>
    </template>
  </div>
</template>
```

**Estimation** : 2h

#### 0.2 - Ajouter la Route

**Fichier** : `src/router/index.js`

**Code à ajouter** :
```javascript
{
  path: '/user/:id',
  name: 'UserProfile',
  component: () => import('@/views/UserProfileView.vue'),
  meta: { 
    requiresAuth: true,
    title: 'Profil Utilisateur - 2iE GreenHub'
  }
}
```

**Estimation** : 5 min

#### 0.3 - Modifier `ProfileView.vue`

**Actions** :
1. Supprimer les 3 boutons d'action (lignes 46-56)
2. Ajouter un bouton "Voir mon profil public" → `/user/{monId}`
3. Ajouter un bouton "Modifier mon profil" → `/settings/profile` (si existe)

**Estimation** : 15 min

---

### PHASE 1 : Fonctionnalité "SE CONNECTER"

#### 1.1 - Vérification du Statut de Connexion

**Service** : `connectionService.js`

**Fonction à ajouter** :
```javascript
async getConnectionStatus(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'not_authenticated' }
  
  if (user.id === targetUserId) return { status: 'self' }
  
  const { data } = await supabase
    .from('pev_connections')
    .select('id, status, requester_id')
    .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},addressee_id.eq.${user.id})`)
    .single()
  
  if (!data) return { status: 'none' }
  if (data.status === 'accepted') return { status: 'connected' }
  if (data.status === 'pending') {
    return { 
      status: 'pending', 
      isRequester: data.requester_id === user.id 
    }
  }
  if (data.status === 'declined') return { status: 'declined' }
  
  return { status: 'none' }
}
```

**Estimation** : 20 min

#### 1.2 - Dialog de Demande de Connexion

**Composant** : Intégré dans `UserProfileView.vue`

**UI** :
```vue
<v-dialog v-model="connectionDialog" max-width="500">
  <v-card>
    <v-card-title>
      <v-icon class="mr-2">mdi-account-plus</v-icon>
      Se connecter avec {{ targetUser.first_name }}
    </v-card-title>
    <v-card-text>
      <p class="mb-4">Ajoutez un message personnalisé (optionnel) :</p>
      <v-textarea
        v-model="connectionMessage"
        label="Message"
        variant="outlined"
        rows="3"
        counter="500"
        :rules="[v => !v || v.length <= 500 || 'Max 500 caractères']"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="connectionDialog = false">Annuler</v-btn>
      <v-btn color="green" variant="flat" :loading="sending" @click="sendConnectionRequest">
        Envoyer la demande
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**Logique** :
```javascript
const sendConnectionRequest = async () => {
  sending.value = true
  try {
    await connectionService.sendRequest({
      targetUserId: route.params.id,
      message: connectionMessage.value
    })
    connectionStatus.value = 'pending'
    connectionDialog.value = false
    snackbar.value = { show: true, message: 'Demande envoyée !', color: 'success' }
  } catch (error) {
    snackbar.value = { show: true, message: error.message, color: 'error' }
  } finally {
    sending.value = false
  }
}
```

**Estimation** : 30 min

#### 1.3 - Affichage Dynamique du Bouton

**États possibles** :

| État | Affichage |
|------|-----------|
| `none` | Bouton "Se connecter" cliquable |
| `pending` (je suis requester) | Bouton "Demande envoyée" désactivé |
| `pending` (je suis addressee) | Bouton "Accepter la demande" |
| `connected` | Badge "Connecté" avec icône check |
| `declined` | Bouton "Renvoyer une demande" |
| `self` | Pas de bouton (c'est mon profil) |

**Estimation** : 20 min

---

### PHASE 2 : Fonctionnalité "ENVOYER UN MESSAGE"

#### 2.1 - Utiliser le Service Existant

**Service existant** : `messagesService.getOrCreateDirectConversation(otherUserId)`

**⚠️ Prérequis** : Vérifier que la RPC `create_direct_conversation` existe dans Supabase.

**Code** :
```javascript
const sendMessage = async () => {
  try {
    const result = await messagesService.getOrCreateDirectConversation(route.params.id)
    if (result.success) {
      router.push(`/messages/${result.data.id}`)
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    snackbar.value = { show: true, message: 'Erreur: ' + error.message, color: 'error' }
  }
}
```

**Estimation** : 15 min

#### 2.2 - Vérification RPC Supabase

**Vérifier** : Exécuter une requête pour voir si `create_direct_conversation` existe.

**Si absent** : Créer la fonction SQL :
```sql
CREATE OR REPLACE FUNCTION create_direct_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  existing_conv_id UUID;
  new_conv_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Vérifier si une conversation directe existe déjà
  SELECT c.id INTO existing_conv_id
  FROM pev_conversations c
  JOIN pev_conversation_participants p1 ON p1.conversation_id = c.id AND p1.user_id = current_user_id
  JOIN pev_conversation_participants p2 ON p2.conversation_id = c.id AND p2.user_id = other_user_id
  WHERE c.type = 'direct'
  LIMIT 1;
  
  IF existing_conv_id IS NOT NULL THEN
    RETURN existing_conv_id;
  END IF;
  
  -- Créer une nouvelle conversation
  INSERT INTO pev_conversations (type, created_by)
  VALUES ('direct', current_user_id)
  RETURNING id INTO new_conv_id;
  
  -- Ajouter les participants
  INSERT INTO pev_conversation_participants (conversation_id, user_id, role)
  VALUES 
    (new_conv_id, current_user_id, 'member'),
    (new_conv_id, other_user_id, 'member');
  
  RETURN new_conv_id;
END;
$$;
```

**Estimation** : 30 min (si RPC absente)

---

### PHASE 3 : Fonctionnalité "AJOUTER AUX FAVORIS"

#### 3.1 - Étendre `pev_favorites` pour les Utilisateurs

**Option A** : Utiliser `entity_type = 'user'`

**Vérification** : La table `pev_favorites` accepte-t-elle n'importe quel `entity_type` ou est-ce un ENUM ?

**Code service à ajouter** dans `connectionService.js` ou nouveau fichier :
```javascript
async addUserToFavorites(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  
  const { data, error } = await supabase
    .from('pev_favorites')
    .insert({
      entity_type: 'user',
      entity_id: targetUserId,
      user_id: user.id
    })
    .select()
    .single()
  
  if (error) throw error
  return { success: true, data }
}

async removeUserFromFavorites(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  
  const { error } = await supabase
    .from('pev_favorites')
    .delete()
    .eq('entity_type', 'user')
    .eq('entity_id', targetUserId)
    .eq('user_id', user.id)
  
  if (error) throw error
  return { success: true }
}

async isUserFavorite(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data } = await supabase
    .from('pev_favorites')
    .select('id')
    .eq('entity_type', 'user')
    .eq('entity_id', targetUserId)
    .eq('user_id', user.id)
    .single()
  
  return !!data
}
```

**Estimation** : 30 min

#### 3.2 - UI Toggle Favoris

**Code** :
```javascript
const isFavorite = ref(false)

const loadFavoriteStatus = async () => {
  isFavorite.value = await connectionService.isUserFavorite(route.params.id)
}

const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await connectionService.removeUserFromFavorites(route.params.id)
      isFavorite.value = false
      snackbar.value = { show: true, message: 'Retiré des favoris', color: 'info' }
    } else {
      await connectionService.addUserToFavorites(route.params.id)
      isFavorite.value = true
      snackbar.value = { show: true, message: 'Ajouté aux favoris', color: 'success' }
    }
  } catch (error) {
    snackbar.value = { show: true, message: error.message, color: 'error' }
  }
}
```

**Template** :
```vue
<v-btn 
  :color="isFavorite ? 'red' : 'white'" 
  :variant="isFavorite ? 'flat' : 'outlined'"
  @click="toggleFavorite"
>
  <v-icon class="mr-2">{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
  {{ isFavorite ? 'Favori' : 'Ajouter aux favoris' }}
</v-btn>
```

**Estimation** : 20 min

---

## 📋 RÉCAPITULATIF DES ACTIONS

| Phase | Action | Fichier | Estimation |
|-------|--------|---------|------------|
| **0.1** | Créer `UserProfileView.vue` | `src/views/UserProfileView.vue` | 2h |
| **0.2** | Ajouter route `/user/:id` | `src/router/index.js` | 5 min |
| **0.3** | Nettoyer `ProfileView.vue` | `src/views/ProfileView.vue` | 15 min |
| **1.1** | Ajouter `getConnectionStatus()` | `src/services/connectionService.js` | 20 min |
| **1.2** | Dialog demande connexion | `UserProfileView.vue` | 30 min |
| **1.3** | Affichage dynamique bouton | `UserProfileView.vue` | 20 min |
| **2.1** | Intégrer envoi message | `UserProfileView.vue` | 15 min |
| **2.2** | Vérifier/créer RPC | Supabase migration | 30 min |
| **3.1** | Fonctions favoris utilisateurs | `connectionService.js` | 30 min |
| **3.2** | UI toggle favoris | `UserProfileView.vue` | 20 min |

**Total estimé** : ~4h30

---

## ⚠️ POINTS DE VALIDATION REQUIS

Avant de procéder, merci de confirmer :

### 1. Terminologie "SE CONNECTER" - Clarification UX

**Problème** : "Se connecter" peut être confondu avec "Se connecter à son compte" (login).

**Alternatives proposées** :

| Option | Libellé | Icône | Clarté |
|--------|---------|-------|--------|
| A | **Ajouter à mon réseau** | `mdi-account-plus` | ✅ Claire |
| B | **Demander une connexion** | `mdi-account-arrow-right` | ✅ Claire |
| C | **Se mettre en relation** | `mdi-handshake` | ✅ Claire |
| D | **Suivre** (style LinkedIn) | `mdi-account-plus` | ⚠️ Moins formel |

**Recommandation** : Option A "**Ajouter à mon réseau**" avec tooltip explicatif.

**Exemple UI** :
```vue
<v-btn color="green" @click="openConnectionDialog">
  <v-icon class="mr-2">mdi-account-plus</v-icon>
  Ajouter à mon réseau
</v-btn>
```

**Tooltip** : "Envoyez une demande de connexion pour échanger avec cet utilisateur"

---

### 2. Architecture des Vues

- [ ] **Option A** : Créer `UserProfileView.vue` séparée (recommandé)
- [ ] **Option B** : Modifier `ProfileView.vue` pour gérer les 2 cas (plus complexe)

### 2. Route Choisie

- [ ] `/user/:id` (recommandé - cohérent avec `/user/dashboard`)
- [ ] `/profile/:id` (alternative)

### 3. Fonctionnalité Favoris

- [ ] Confirmer que `pev_favorites.entity_type` accepte la valeur `'user'`
- [ ] Si ENUM, fournir la migration pour ajouter `'user'`

### 4. RPC Messages

- [ ] Vérifier si `create_direct_conversation` existe
- [ ] Si non, approuver la création de la fonction SQL

### 5. Ordre d'Implémentation

- [ ] Phase 0 → 1 → 2 → 3 (recommandé)
- [ ] Autre ordre : ___________

---

## 🚀 PRÊT À IMPLÉMENTER

Après validation de tous les points ci-dessus, l'implémentation sera réalisée dans l'ordre défini.

**Aucune erreur ne sera tolérée** - chaque étape sera vérifiée avant de passer à la suivante.
