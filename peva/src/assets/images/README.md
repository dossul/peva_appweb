# Répertoire Images PEVA

Ce répertoire contient toutes les images utilisées dans l'application PEVA.

## Structure des dossiers

### 📁 `avatars/`
- **Usage** : Avatars d'utilisateurs et photos de profil
- **Formats** : JPG, PNG, WebP
- **Tailles recommandées** : 
  - Miniature : 32x32px, 48x48px
  - Standard : 128x128px, 256x256px
  - Haute résolution : 512x512px

### 📁 `logos/`
- **Usage** : Logos d'entreprises, organisations et partenaires
- **Formats** : SVG (préféré), PNG avec fond transparent
- **Tailles recommandées** :
  - Petit : 64x64px
  - Moyen : 128x128px
  - Grand : 256x256px

### 📁 `banners/`
- **Usage** : Bannières, images de fond et headers
- **Formats** : JPG, PNG, WebP
- **Tailles recommandées** :
  - Mobile : 375x200px
  - Desktop : 1200x400px
  - Full HD : 1920x600px

### 📁 `icons/`
- **Usage** : Icônes d'interface, pictogrammes et symboles
- **Formats** : SVG (préféré), PNG
- **Tailles** : 16x16px, 24x24px, 32x32px, 48x48px

### 📁 `illustrations/`
- **Usage** : Illustrations, graphiques et éléments décoratifs
- **Formats** : SVG, PNG, JPG
- **Tailles** : Variables selon le contexte

## Conventions de nommage

### Format général
```
[categorie]-[nom-descriptif]-[taille].[extension]
```

### Exemples
```
logo-peva-128.svg
avatar-john-doe-256.jpg
banner-homepage-1920.jpg
icon-energy-24.svg
illustration-africa-map.svg
```

## Optimisation

### Images Web
- **Compression** : Utilisez des outils comme TinyPNG ou ImageOptim
- **Formats modernes** : WebP pour les navigateurs compatibles
- **Responsive** : Fournissez plusieurs tailles pour différents écrans

### SVG
- **Optimisation** : Utilisez SVGO pour réduire la taille
- **Accessibilité** : Ajoutez des attributs `title` et `desc`
- **Couleurs** : Utilisez des variables CSS pour les thèmes

## Utilisation dans Vue.js

### Import statique
```javascript
import logo from '@/assets/images/logos/peva-logo.svg'
```

### Import dynamique
```javascript
const getImage = (name) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href
}
```

### Dans les templates
```vue
<template>
  <img :src="logoUrl" alt="Logo PEVA" />
</template>
```

## Droits et licences

- Assurez-vous d'avoir les droits d'utilisation pour toutes les images
- Documentez les sources et licences dans ce fichier si nécessaire
- Respectez les conditions d'attribution des images libres de droits

## Maintenance

- Supprimez les images inutilisées régulièrement
- Vérifiez la compression et l'optimisation
- Mettez à jour ce README lors d'ajouts de nouvelles catégories
