# 📦 Guide de Publication NPM - Libs Partagées "diallo"

## 🎯 Objectif

Publier vos libs partagées sur NPM sous votre nom `diallo` pour pouvoir les utiliser dans n'importe quel projet avec :

```bash
npm install microfront-libs-diallo-api
npm install microfront-libs-diallo-ui
npm install microfront-libs-diallo-config
npm install microfront-libs-diallo-store
```

## 📋 Prérequis

1. **Compte NPM** : [npmjs.com](https://www.npmjs.com)
2. **Node.js** ≥ 16
3. **Git** configuré

## 🚀 Configuration des Packages

### 1. Structure des Packages

Créez cette structure dans votre dossier `libs/` :

```
libs/
├── api/
│   ├── package.json     ← À créer
│   ├── src/            ← Vos fichiers actuels
│   └── dist/           ← Généré par build
├── ui/
│   ├── package.json     ← À créer
│   └── src/
├── config/
│   ├── package.json     ← À créer
│   └── src/
└── store/
    ├── package.json     ← À créer
    └── src/
```

### 2. Configuration `package.json` pour chaque lib

#### 📦 `libs/api/package.json`
```json
{
  "name": "microfront-libs-diallo-api",
  "version": "1.0.0",
  "description": "API services and authentication library for micro-frontends",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "build": "babel src -d dist --presets=@babel/preset-env",
    "dev": "babel src -d dist --watch --presets=@babel/preset-env",
    "prepublishOnly": "npm run build",
    "test": "jest"
  },
  "keywords": [
    "microfrontends",
    "api",
    "authentication",
    "react"
  ],
  "author": "diallo <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/diallo/microfront-libs-api.git"
  },
  "dependencies": {
    "js-cookie": "^3.0.5",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.23.0",
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "jest": "^29.7.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

#### 🎨 `libs/ui/package.json`
```json
{
  "name": "microfront-libs-diallo-ui",
  "version": "1.0.0",
  "description": "Reusable UI components for micro-frontends",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "build": "babel src -d dist --presets=@babel/preset-env,@babel/preset-react",
    "dev": "babel src -d dist --watch --presets=@babel/preset-env,@babel/preset-react",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "microfrontends",
    "ui",
    "components",
    "react"
  ],
  "author": "diallo <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/diallo/microfront-libs-ui.git"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "styled-components": "^6.1.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.23.0",
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.23.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

#### ⚙️ `libs/config/package.json`
```json
{
  "name": "microfront-libs-diallo-config",
  "version": "1.0.0",
  "description": "Configuration management for micro-frontends",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "build": "babel src -d dist --presets=@babel/preset-env",
    "dev": "babel src -d dist --watch --presets=@babel/preset-env",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "microfrontends",
    "config",
    "settings"
  ],
  "author": "diallo <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/diallo/microfront-libs-config.git"
  },
  "devDependencies": {
    "@babel/cli": "^7.23.0",
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0"
  }
}
```

#### 🗄️ `libs/store/package.json`
```json
{
  "name": "microfront-libs-diallo-store",
  "version": "1.0.0",
  "description": "Global state management for micro-frontends",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "build": "babel src -d dist --presets=@babel/preset-env",
    "dev": "babel src -d dist --watch --presets=@babel/preset-env",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "microfrontends",
    "state",
    "redux",
    "store"
  ],
  "author": "diallo <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/diallo/microfront-libs-store.git"
  },
  "dependencies": {
    "redux": "^4.2.1",
    "react-redux": "^8.1.3"
  },
  "devDependencies": {
    "@babel/cli": "^7.23.0",
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
```

## 🔧 Fichiers d'Index pour chaque Package

### 📦 `libs/api/src/index.js`
```javascript
// Export de tous les services API
export { tokenService } from './tokenService';
export { ApiService } from './ApiService';
export { default as apiConfig } from './api.config';

// Types pour TypeScript (optionnel)
export type { TokenService, ApiResponse } from './types';
```

### 🎨 `libs/ui/src/index.js`
```javascript
// Export de tous les composants UI
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';

// Thème et styles
export { theme } from './theme';
export { GlobalStyles } from './GlobalStyles';
```

### ⚙️ `libs/config/src/index.js`
```javascript
// Export de la configuration
export { default as settings } from './settings';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY || 'diallo_token';
```

### 🗄️ `libs/store/src/index.js`
```javascript
// Export du store Redux
export { store } from './store';
export { rootReducer } from './reducers';
export * from './actions';
export * from './selectors';
```

## 🚀 Publication sur NPM

### 1. Configuration NPM

```bash
# Se connecter à npm (une seule fois)
npm login

# Vérifier la connexion
npm whoami
# Devrait afficher: diallo
```

### 2. Build et Publication

```bash
# Pour chaque lib, dans l'ordre :

# 1. API
cd libs/api
npm install
npm run build
npm publish
# ✅ Published: microfront-libs-diallo-api@1.0.0

# 2. Config (pas de dépendances)
cd ../config
npm install
npm run build
npm publish
# ✅ Published: microfront-libs-diallo-config@1.0.0

# 3. Store
cd ../store
npm install
npm run build
npm publish
# ✅ Published: microfront-libs-diallo-store@1.0.0

# 4. UI (dépend de React)
cd ../ui
npm install
npm run build
npm publish
# ✅ Published: microfront-libs-diallo-ui@1.0.0
```

## 📚 Utilisation dans un Nouveau Projet

### Installation

```bash
# Créer un nouveau projet React
npx create-react-app my-new-project
cd my-new-project

# Installer vos libs
npm install microfront-libs-diallo-api
npm install microfront-libs-diallo-ui
npm install microfront-libs-diallo-config
npm install microfront-libs-diallo-store

# Ou en une commande
npm install microfront-libs-diallo-api microfront-libs-diallo-ui microfront-libs-diallo-config microfront-libs-diallo-store
```

### Utilisation dans le Code

```javascript
// src/App.js
import React from 'react';
import { tokenService } from 'microfront-libs-diallo-api';
import { Button } from 'microfront-libs-diallo-ui';
import { API_BASE_URL } from 'microfront-libs-diallo-config';
import { store } from 'microfront-libs-diallo-store';

function App() {
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      tokenService.setToken(data.token); // ✅ Utilise vos libs !
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="App">
      <Button onClick={handleLogin}>
        Se connecter avec mes libs !
      </Button>
    </div>
  );
}

export default App;
```

## 🔄 Mise à Jour des Versions

### Versioning Sémantique

```bash
# Patch: 1.0.0 → 1.0.1 (bug fixes)
npm version patch
npm publish

# Minor: 1.0.1 → 1.1.0 (nouvelles fonctionnalités)
npm version minor
npm publish

# Major: 1.1.0 → 2.0.0 (breaking changes)
npm version major
npm publish
```

### Mise à Jour dans les Projets

```bash
# Mettre à jour toutes les libs
npm update microfront-libs-diallo-api microfront-libs-diallo-ui microfront-libs-diallo-config microfront-libs-diallo-store

# Ou spécifier une version
npm install microfront-libs-diallo-api@1.1.0
```

## 🛠️ Maintenance et Développement

### Développement Local

```bash
# Pour développer une lib localement
cd libs/api
npm run dev  # Watch mode pour le développement

# Dans un autre terminal, tester dans un projet
cd my-test-project
npm link ../libs/api  # Lier la version locale
```

### Tests

```bash
# Ajouter des tests à chaque package
npm test

# Exemple de test pour tokenService
describe('tokenService', () => {
  it('should set and get token', () => {
    tokenService.setToken('test-token');
    expect(tokenService.getToken()).toBe('test-token');
  });
});
```

### CI/CD pour l'Automatisation

```yaml
# .github/workflows/publish.yml
name: Publish to NPM
on:
  push:
    branches: [ main ]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📊 Avantages de cette Approche

### ✅ **Réutilisabilité**
- Utilisez vos libs dans **n'importe quel projet**
- **Un seul nom** : `diallo`
- **Versioning centralisé**

### ✅ **Maintenance Simplifiée**
- **Une seule source** de vérité
- **Tests centralisés**
- **Documentation unifiée**

### ✅ **Évolutivité**
- Ajoutez de nouvelles libs facilement
- **Scoped packages** : `microfront-libs-diallo-*`
- **Compatible** avec tous les frameworks

### ✅ **Professionnel**
- **Votre marque** : `diallo`
- **Portfolio NPM** visible
- **Références** pour futurs employeurs

## 🎉 Résultat Final

Vous pourrez maintenant créer n'importe quel projet et utiliser :

```bash
npm install microfront-libs-diallo-api microfront-libs-diallo-ui
```

Et importer dans votre code :

```javascript
import { tokenService } from 'microfront-libs-diallo-api';
import { Button } from 'microfront-libs-diallo-ui';
```

**Vos libs sont maintenant prêtes à être réutilisées dans tous vos projets ! 🚀**