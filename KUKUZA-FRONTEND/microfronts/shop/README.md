# Kukuza Boutique Microfront

Interface de gestion de boutique pour la plateforme Kukuza. Cette application permet aux propriétaires de boutiques de gérer leurs produits, ventes et statistiques.

## 🚀 Technologies

- **React 18** avec TypeScript
- **Tailwind CSS v4** pour le styling
- **Webpack 5** pour le bundling
- **Recharts** pour les graphiques
- **Lucide React** pour les icônes
- **React Router v6** pour la navigation

## 📁 Structure du projet

```
src/
├── components/
│   ├── common/          # Composants réutilisables (Card, StatCard, Tabs)
│   ├── dashboard/       # Composants spécifiques au dashboard
│   └── layout/          # Composants de layout (Sidebar, Header, DashboardLayout)
├── hooks/               # Hooks personnalisés (useDashboardData, useProducts)
├── pages/               # Pages de l'application
├── styles/              # Styles globaux et thème Tailwind
├── types.d.ts           # Définitions TypeScript
├── utils/               # Utilitaires et données mock
├── App.tsx              # Composant racine
└── index.tsx            # Point d'entrée
```

## 🎨 Design System

### Couleurs principales
- **Primary**: `#287460` (Vert Kukuza)
- **Primary Light**: `#90EE90` (Vert clair pour graphiques)
- **Background**: `#f8f9fa`
- **Surface**: `#ffffff`

### Composants réutilisables
- **Card**: Conteneur avec ombre et bordure
- **StatCard**: Carte de statistique avec icône et valeur
- **Tabs**: Système d'onglets
- **Button**: Boutons avec variantes (primary, secondary, ghost)
- **Badge**: Badges de statut (success, warning, error, info)

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour la production
npm run build
```

## 📊 Fonctionnalités

### Dashboard
- **Cartes analytiques**: Revenue total, Revenue du jour, Ventes, Utilisateurs actifs
- **Graphique des ventes**: Chart en ligne avec filtres (Jour, Semaine, Mois, Année)
- **Graphique des visites**: Chart en barres par jour de la semaine
- **Table des produits**: Avec filtres (Tous, En stock, Épuisés)

### Hooks personnalisés

#### `useDashboardData`
Récupère les données du dashboard (stats, graphiques)
```typescript
const { stats, salesData, visitsData, isLoading, error, refetch } = useDashboardData();
```

#### `useProducts`
Gère les produits avec filtrage
```typescript
const { products, filteredProducts, isLoading, filter, setFilter, refetch } = useProducts();
```

## 🔐 Sécurité

- Content Security Policy configurée
- Headers de sécurité (X-Frame-Options, X-XSS-Protection)
- TypeScript strict mode activé
- Validation des entrées utilisateur

## 🌐 Configuration

Le serveur de développement tourne sur le port **3002** par défaut.

Variables d'environnement supportées:
- `REACT_APP_API_URL`: URL de l'API backend (défaut: `http://localhost:3000/api`)
- `REACT_APP_TOKEN_KEY`: Clé de stockage du token (défaut: `kukuza_token`)

## 📝 Convention de code

- **TypeScript** pour la sécurité des types
- **Composants fonctionnels** avec hooks
- **Props typées** pour tous les composants
- **CSS modulaire** avec Tailwind v4
- **Nommage en PascalCase** pour les composants
- **Nommage en camelCase** pour les fonctions et variables

## 🔄 Intégration API

Les hooks sont prêts pour l'intégration avec une vraie API. Remplacez simplement les appels à `getMockData()` par des appels `fetch()` ou `axios`:

```typescript
// Exemple dans useDashboardData.ts
const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard`);
const data = await response.json();
setStats(data);
```

## 🎯 Prochaines étapes

- [ ] Intégration avec l'API backend
- [ ] Authentification et autorisation
- [ ] Gestion des produits (CRUD)
- [ ] Page de détail des ventes
- [ ] Système de notifications en temps réel
- [ ] Export des données (PDF, Excel)
- [ ] Mode sombre
- [ ] Responsive mobile optimisé

## 📄 License

Propriétaire - Kukuza Platform
