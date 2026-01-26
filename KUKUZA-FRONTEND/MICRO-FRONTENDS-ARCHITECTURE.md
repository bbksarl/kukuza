# 🏗️ Architecture Micro-Frontends Kukuza - Documentation Technique

## 📋 Vue d'ensemble

Cette documentation détaille l'utilisation du **dossier `libs/`** (cœur de l'application) et la stratégie de déploiement multi-repositories pour l'architecture micro-frontends Kukuza.

---

## 🎯 Rôle Central du Dossier `libs/`

### 📦 Structure des Bibliothèques Partagées

```
libs/
├── api/           # 💎 CŒUR - Services API et authentification
│   ├── tokenService.js    # Gestion des tokens (cookies)
│   ├── ApiService.js      # Client HTTP centralisé
│   └── api.config.js      # Configuration API
├── config/        # ⚙️ Configuration globale
│   ├── settings.js        # Paramètres applicatifs
│   └── env.example        # Variables d'environnement
├── store/         # 🗄️ État global de l'application
│   └── index.js           # Store Redux/Zustand
└── ui/            # 🎨 Composants UI réutilisables
    └── Button.js          # Composants de base
```

### 🔥 Pourquoi `libs/` est le Cœur ?

1. **🔄 Logique Métier Centralisée**
   - Authentification unique
   - Gestion d'état globale
   - Configuration partagée

2. **♻️ Réutilisabilité Maximale**
   - Composants UI dans tous les micro-frontends
   - Services API partagés
   - Configuration cohérente

3. **🛡️ Sécurité Centralisée**
   - Gestion des tokens dans `tokenService`
   - Validation JWT unifiée
   - Configuration sécurité (CORS, etc.)

---

## 📦 Stratégie Multi-Repositories

### 🏛️ Architecture des Repositories

```
🏢 kukuza-shared-libs (MONOREPO)
├── 📦 @kukuza/api       → Services & Auth
├── 📦 @kukuza/config    → Configuration
├── 📦 @kukuza/store     → État global
└── 📦 @kukuza/ui       → Composants UI

🏢 kukuza-portal (CONTAINER)
└── 🔗 Orchestration des micro-frontends

🏢 kukuza-auth (MICRO-FRONTEND)
🏢 kukuza-admin (MICRO-FRONTEND)
🏢 kukuza-user (MICRO-FRONTEND)
🏢 kukuza-analytics (MICRO-FRONTEND)
```

### ✅ Chaque Application DOIT avoir son propre repository

**Raison : Indépendance et scalabilité**

#### 🎯 Avantages du Multi-Repo

1. **👥 Équipes Indépendantes**
   ```bash
   # Chaque équipe travaille sur son repo
   git clone kukuza-auth     # Équipe Auth
   git clone kukuza-admin    # Équipe Admin
   git clone kukuza-user     # Équipe User
   ```

2. **🚀 Déploiement Indépendant**
   ```bash
   # Déploiement séparé possible
   # Auth en prod, Admin en staging
   npm run build --workspace=kukuza-auth
   npm run deploy --env=production
   ```

3. **🛠️ Technologies Flexibles**
   ```javascript
   // Auth peut utiliser React + TypeScript
   // Admin peut utiliser Vue.js
   // Analytics peut utiliser Svelte
   ```

4. **📈 Scaling Horizontal**
   ```
   Aujourd'hui: 1 dev full-stack
   Demain: 5 devs spécialisés
   Chaque repo = domaine d'expertise
   ```

---

## 🔧 Utilisation des `libs/` Partagées

### 📚 Consommation des Bibliothèques

#### 1. Installation dans un Micro-Frontend

```json
// package.json d'un micro-frontend (ex: kukuza-auth)
{
  "dependencies": {
    "@kukuza/api": "^1.0.0",
    "@kukuza/ui": "^1.0.0",
    "@kukuza/config": "^1.0.0"
  }
}
```

#### 2. Utilisation dans le Code

```javascript
// 🔐 Utilisation du tokenService (CŒUR)
import { tokenService } from '@kukuza/api';

const login = async (credentials) => {
  // Authentification centralisée
  const response = await apiService.login(credentials);
  tokenService.setToken(response.token); // ✅ Cookie sécurisé
};

// 🎨 Utilisation des composants UI
import { Button } from '@kukuza/ui';

const AuthForm = () => (
  <Button variant="primary">Se connecter</Button>
);

// ⚙️ Utilisation de la configuration
import { API_BASE_URL } from '@kukuza/config';

const apiCall = () => fetch(`${API_BASE_URL}/users`);
```

### 🔄 Workflow de Développement avec les Libs

#### Phase 1: Développement Local

```bash
# 1. Cloner tous les repos
git clone kukuza-shared-libs
git clone kukuza-auth
git clone kukuza-portal

# 2. Lier les libs localement (développement)
cd kukuza-auth
npm link ../kukuza-shared-libs/packages/api
npm link ../kukuza-shared-libs/packages/ui

# 3. Développement avec hot-reload
npm run dev  # Auth sur http://localhost:3001
```

#### Phase 2: Publication des Libs

```bash
# Dans kukuza-shared-libs
npm run build          # Builder tous les packages
npm run publish        # Publier sur npm privé

# Versioning sémantique
npm version patch      # 1.0.0 → 1.0.1
npm version minor      # 1.0.1 → 1.1.0
npm version major      # 1.1.0 → 2.0.0
```

#### Phase 3: Mise à Jour dans les Micro-Frontends

```bash
# Dans chaque micro-frontend
npm update @kukuza/api @kukuza/ui @kukuza/config

# Vérifier les breaking changes
npm run build
npm run test
```

---

## 🚀 Stratégie de Déploiement

### 🎯 Déploiement par Repository

#### Architecture de Déploiement

```
🌐 PRODUCTION
├── 🔗 Portal (kukuza-portal)     → https://app.kukuza.com
├── 🔐 Auth (kukuza-auth)        → Module fédéré
├── 👑 Admin (kukuza-admin)      → Module fédéré
├── 👤 User (kukuza-user)        → Module fédéré
└── 📊 Analytics (kukuza-analytics) → Module fédéré

📦 SHARED LIBS
└── 📚 NPM Private Registry     → @kukuza/*
```

#### Pipeline CI/CD par Repository

```yaml
# .gitlab-ci.yml dans chaque repo
stages:
  - build
  - test
  - security
  - deploy

build:
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

security:
  script:
    - npm audit
    - npm run lint

deploy_staging:
  script:
    - deploy-to-staging.sh
  environment: staging

deploy_production:
  script:
    - deploy-to-production.sh
  environment: production
  when: manual
```

### 🔄 Stratégies de Déploiement

#### 1. **Déploiement Indépendant** (Recommandé)

```bash
# Chaque micro-frontend se déploie seul
# ✅ Zero downtime pour les autres services
# ✅ Rollback individuel possible

# Exemple: Mise à jour Auth seulement
cd kukuza-auth
git tag v2.1.0
git push origin v2.1.0  # → Déclenche CI/CD Auth
```

#### 2. **Déploiement Coordonné** (Breaking Changes)

```bash
# Pour les changements dans libs/
# 1. Publier les libs
cd kukuza-shared-libs
npm version minor
npm run publish

# 2. Mettre à jour tous les micro-frontends
for repo in auth admin user analytics; do
  cd kukuza-$repo
  npm update @kukuza/*
  npm run build
  npm run test
  git commit -m "Update shared libs to v1.1.0"
  git push
done
```

#### 3. **Blue-Green Deployment**

```
🔵 VERSION ACTUELLE (v1.0.0)
├── Portal → Auth v1.0.0
└── Portal → Admin v1.0.0

🟢 NOUVELLE VERSION (v2.0.0)
├── Portal → Auth v2.0.0 ⬅️ Test en //
└── Portal → Admin v1.0.0

✅ VALIDATION → Bascule complète
```

---

## 🛡️ Gestion des Versions et Compatibilité

### 📋 Versioning des Libs Partagées

#### Sémantique de Version

```bash
# PATCH: 1.0.0 → 1.0.1 (bug fixes)
npm version patch

# MINOR: 1.0.1 → 1.1.0 (nouvelles fonctionnalités)
npm version minor

# MAJOR: 1.1.0 → 2.0.0 (breaking changes)
npm version major
```

#### Matrice de Compatibilité

| Version Libs | Auth | Admin | User | Analytics | Portal |
|-------------|------|-------|------|-----------|--------|
| 1.0.x       | ✅   | ✅    | ✅   | ✅        | ✅     |
| 1.1.x       | ✅   | ✅    | ✅   | ✅        | ✅     |
| 2.0.x       | ❌   | ❌    | ❌   | ❌        | ❌     |

### 🔒 Gestion des Breaking Changes

#### Processus pour les Changements Majeurs

```bash
# 1. Créer une branche de migration
git checkout -b migration-v2.0.0

# 2. Mettre à jour les libs
npm version major  # 1.1.0 → 2.0.0

# 3. Créer des branches de migration dans chaque micro-frontend
for repo in auth admin user analytics portal; do
  cd kukuza-$repo
  git checkout -b migrate-libs-v2.0.0
  # Adapter le code aux nouvelles APIs
  npm install @kukuza/api@2.0.0
  # Modifier le code si nécessaire
  npm run build
  npm run test
done

# 4. Merge coordonné
# Merge libs v2.0.0 en premier
# Puis merge de chaque micro-frontend
```

---

## 🔄 Workflows de Développement

### 👤 Workflow pour un Nouveau Développeur

```bash
# 1. Cloner tous les repos
git clone kukuza-shared-libs
git clone kukuza-auth  # Selon son domaine
git clone kukuza-portal

# 2. Installation des dépendances
cd kukuza-shared-libs && npm install
cd ../kukuza-auth && npm install

# 3. Lier les libs en développement
cd kukuza-auth
npm link ../kukuza-shared-libs/packages/api
npm link ../kukuza-shared-libs/packages/ui

# 4. Démarrer le développement
npm run dev
```

### 🔄 Workflow pour une Feature

```bash
# Exemple: Nouvelle feature dans Auth
cd kukuza-auth
git checkout -b feature/social-login

# Développement...
# Si besoin de modifier les libs
cd ../kukuza-shared-libs
git checkout -b feature/social-auth-api
# Modifier @kukuza/api

# Retour dans auth
cd ../kukuza-auth
npm link ../kukuza-shared-libs/packages/api  # Re-link

# Commit et PR
git add .
git commit -m "Add social login feature"
git push origin feature/social-login
```

### 🐛 Workflow pour un Bug Fix

```bash
# Bug dans tokenService
cd kukuza-shared-libs
git checkout -b bugfix/token-expiry

# Fix le bug dans packages/api/tokenService.js
npm run test

# Commit et merge
git commit -m "Fix token expiry validation"
git push origin bugfix/token-expiry

# Mise à jour dans tous les micro-frontends
for repo in auth admin user analytics; do
  cd kukuza-$repo
  npm update @kukuza/api
  npm run build  # Vérifier que ça compile
  git commit -m "Update @kukuza/api for token fix"
  git push
done
```

---

## 📊 Monitoring et Observabilité

### 🔍 Métriques par Repository

#### Health Checks

```javascript
// Dans chaque micro-frontend
// health.js
export const healthCheck = () => ({
  status: 'healthy',
  version: process.env.npm_package_version,
  libs: {
    api: require('@kukuza/api/package.json').version,
    ui: require('@kukuza/ui/package.json').version
  },
  timestamp: new Date().toISOString()
});
```

#### Logs Centralisés

```javascript
// Utilisation du logger partagé
import { logger } from '@kukuza/api';

const MyComponent = () => {
  const handleClick = () => {
    logger.info('User clicked button', { userId, action: 'click' });
  };
};
```

### 📈 Dashboard de Monitoring

```
🏥 HEALTH DASHBOARD
├── 🔗 Portal: ✅ UP (v1.2.0)
├── 🔐 Auth: ✅ UP (v1.1.5)
├── 👑 Admin: ✅ UP (v1.1.5)
├── 👤 User: ✅ UP (v1.1.5)
└── 📊 Analytics: ✅ UP (v1.1.5)

📦 SHARED LIBS
├── @kukuza/api: v1.1.5
├── @kukuza/ui: v1.0.8
├── @kukuza/config: v1.0.3
└── @kukuza/store: v1.0.5
```

---

## 🎯 Bonnes Pratiques

### 📝 Règles pour les Libs Partagées

1. **🔒 API Stable** : Pas de breaking changes sans migration planifiée
2. **📚 Documentation** : Chaque fonction exportée doit être documentée
3. **🧪 Tests** : 100% coverage pour les libs critiques (api, store)
4. **🏷️ Versioning** : Respect strict du semver

### 🚀 Règles pour les Micro-Frontends

1. **🔗 Dépendances Minimales** : Seulement les libs nécessaires
2. **📦 Bundle Optimisé** : Code-splitting et lazy loading
3. **🔄 Communication** : Events pour la communication inter-micro-frontends
4. **🧪 Tests Indépendants** : Tests unitaires sans dépendre des autres MF

### 👥 Règles d'Équipe

1. **📋 Code Review** : PR obligatoire pour les libs partagées
2. **🔄 Sync Régulière** : Stand-up quotidien entre équipes
3. **📚 Documentation** : Mise à jour systématique
4. **🚨 Alertes** : Monitoring des déploiements

---

## 🚨 Scénarios d'Urgence

### 🔥 Rollback d'Urgence

```bash
# Rollback d'une lib
cd kukuza-shared-libs
git tag -d v1.2.0  # Supprimer le tag
git reset --hard HEAD~1
npm run publish    # Republier la version précédente

# Rollback d'un micro-frontend
cd kukuza-auth
git reset --hard v1.1.5
git push --force-with-lease
```

### 🛠️ Debug Inter-Micro-Frontends

```javascript
// Debug logger partagé
import { logger } from '@kukuza/api';

window.KUKUZA_DEBUG = {
  enableLogs: () => logger.level = 'debug',
  disableLogs: () => logger.level = 'error',
  showVersions: () => console.table({
    portal: window.KUKUZA_VERSIONS?.portal,
    auth: window.KUKUZA_VERSIONS?.auth,
    libs: window.KUKUZA_VERSIONS?.libs
  })
};
```

---

## 🎉 Conclusion

Cette architecture vous permet de :

- ✅ **Scaler** : Ajouter des devs et des technologies facilement
- ✅ **Maintenir** : Code organisé et réutilisable
- ✅ **Déployer** : Indépendamment et de façon sécurisée
- ✅ **Évoluer** : Architecture prête pour le futur

Le dossier `libs/` reste le **cœur battant** de votre application, centralisant la logique métier tout en permettant l'indépendance de chaque micro-frontend.

**Prochaine étape** : Migration physique vers les repositories séparés ! 🚀