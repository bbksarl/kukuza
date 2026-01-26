#KUKUZA-FRONTEND (Architecture de microfrontends)

## Vue d'ensemble

Ce projet met en œuvre une **architecture de microfrontends polyglotte** utilisant la fédération de modules. Il permet à différentes équipes de développer, déployer et maintenir des applications frontend de manière indépendante, tout en les intégrant dans une application unifiée.

## Architecture

### Composants principaux

- **Portail (Shell)** : Application conteneur principale orchestrant les microfrontends

- **Microfrontends** : Applications indépendantes (authentification, utilisateur, administration, analyse, partage)

- **Bibliothèques** : Bibliothèques partagées pour les fonctionnalités communes (composants d'interface utilisateur, services API, configuration, gestion d'état)

### Technologies utilisées

- **Portail** : React  

- **Microfrontends** :

- Authentification : React (exemple d'implémentation)

- Utilisateur : React (en cours de développement)

- Administration : Angular (en cours de développement)

- Analyse : Svelte (en cours de développement)

- Partagé : Composants communs (en cours de développement)

- **Outil de construction** : Fédération de modules Webpack

- **Bibliothèques partagées** : Modules JavaScript pour les fonctionnalités inter-applications

## Structure du projet

```
KUKUZA-FRONTEND/
├── portal/ # Application shell principale
│ ├── src/
│ │ ├── App.jsx # Composant principal du portail
│ │ ├── components/
│ │ │ └── MicrofrontLoader.jsx # Chargeur dynamique de microfrontends
│ │ └── services/
│ │ └── MicrofrontRegistry.js # Registre des microfrontends disponibles
│ ├── public/
│ └── package.json
├── microfronts/ # Applications de microfrontends indépendantes
│ ├── auth/ # Microfrontend d'authentification (React)
│ │ ├── src/

│ │ │ ├── components/ # Composants d'interface utilisateur
│ │ │ ├── hooks/ # Hooks React personnalisés
│ │ │ ├── routes/ # Configuration du routage
│ │ │ ├── utils/ # Fonctions utilitaires
│ │ │ ├── views/ # Composants de la page
│ │ │ └── index.js # Point d'entrée
│ │ ├── public/
│ │ └── package.json
│ ├── user/ # Utilisateur Gestion des microfrontends

│ ├── admin/ # Microfrontend du panneau d'administration
│ ├── analytics/ # Microfrontend du tableau de bord analytique
│ └── shared/ # Bibliothèque de composants partagés
├── libs/ # Bibliothèques partagées
│ ├── api/ # Couche de service API
│ │ ├── ApiService.js # Client HTTP avec authentification
│ │ ├── AuthService.js # Utilitaires d'authentification
│ │ └── api.config.js # Configuration des points de terminaison API
│ ├── config/ # Gestion de la configuration
│ │ ├── settings.js # Application Paramètres
│ │ └── env.example # Modèle de variables d'environnement
│ ├── store/ # Gestion d'état
│ │ └── index.js # Implémentation simple du magasin d'état
│ └── ui/ # Bibliothèque de composants d'interface utilisateur
│ └── src/
│ └── Button.js # Exemple de composant d'interface utilisateur
└── README.md
```

## Fonctionnement

### Module de fédération

L'architecture utilise la **fédération de modules Webpack** pour permettre :

1. **Application hôte (portail)** : Charge et orchestre les microfrontends
2. **Applications distantes** : Exposent des modules utilisables par l'hôte
3. **Dépendances partagées** : Bibliothèques communes partagées entre Applications

### Registre des microfrontends

Le fichier `MicrofrontRegistry.js` définit les microfrontends disponibles :

```javascript
export const MicrofrontRegistry = [
{
name: 'auth',
url: 'http://localhost:8081/remoteEntry.js',
module: './AuthApp',
framework: 'react',
},
// ... autres microfrontends
];

```

### Chargement dynamique

Le composant `MicrofrontLoader` charge dynamiquement les microfrontends :

- Crée des balises script pour charger les points d'entrée distants
- Initialise les portées partagées pour le partage des dépendances
- Intègre le module distant dans le DOM

## Prise en main

### Prérequis

- Node.js (v16+)
- npm ou yarn

### Installation

1. **Cloner le dépôt**
```bash
git clone <url-du-dépôt>
cd KUKUZA-FRONTEND
```

2. **Installer les dépendances pour toutes les applications**
```bash
# Portail
cd portal && npm install

# Microfrontend d'authentification
cd ../microfronts/auth && npm install

# Répéter pour les autres microfrontends si nécessaire
```

3. **Configurer l'environnement**

```bash
cp libs/config/env.example libs/config/.env
# Modifiez le fichier .env avec votre configuration

```

### Développement

1. **Démarrage du portail (shell)**
```bash
cd portal
npm run dev
# Exécuté sur http://localhost:3000
```

2. **Démarrage des microfrontends**
```bash
# Microfrontend d'authentification
cd microfronts/auth
npm run dev
# Exécuté sur http://localhost:8081

# Démarrage des autres microfrontends sur leurs ports respectifs

```

3. **Accès à l'application**
- Ouvrez http://localhost:3000 dans votre navigateur
- Naviguez entre les microfrontends à l'aide du menu de navigation

### Compilation pour la production

```bash
# Compiler toutes les applications
cd portal && npm run build

CD ../microfronts/auth && npm run build
# Répéter pour les autres microfrontends

```

## Consignes de développement

### Ajout d'un nouveau microfrontend

1. **Créer la structure du microfrontend**
```bash
mkdir microfronts/new