# KUKUZA

Application Angular et TypeScript de la marketplace KUKUZA.

## Démarrage

Node.js 20.19 ou plus récent est requis.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Le serveur Angular écoute sur `http://127.0.0.1:3000`. Il transmet `/api` au backend défini par `KUKUZA_API_PROXY_TARGET` (par défaut `https://localhost:7200`). Pour un certificat local autosigné, configurer sa confiance ou activer `KUKUZA_API_PROXY_INSECURE=true` pour le serveur de développement.

`npm run build` produit le navigateur et le serveur SSR dans `dist/browser` et `dist/server`; il lit `.env.production*` sans reprendre `.env.local`. Les pages catalogue sont pré-rendues, les fiches produits sont rendues à la requête par Node, et les pages privées restent côté client. Le serveur Node appelle l'API via `KUKUZA_API_UPSTREAM` et relaie `/api` pour le navigateur. `npm run build:demo` produit une version statique simulée pour Vercel. Les comptes démo sont publics et ne doivent jamais être réutilisés sur un vrai service. Les paramètres injectés dans le navigateur sont filtrés par `scripts/environment.mjs`; ne jamais y placer de secret.

## Architecture

- `src/main.ts` démarre l'application Angular.
- `src/app/` contient les composants standalone, routes et services Angular, répartis entre `auth`, `storefront`, `studio`, `admin`, `core` et `shared`.
- `src/app/core/` contient les services transverses Angular et le client HTTP, dont les réponses restent `unknown` jusqu'à validation par leurs schémas.
- `src/api/` contient les contrats Zod et l'adaptateur des données de démonstration.
- `src/features/` contient les modèles, règles métier, mappers et données réutilisés par l'interface Angular.
- `src/features/auth/data/` contient l'adaptateur HTTP d'authentification ; les entités et types de domaine restent dans `src/features/auth/domain/`.
- `public/` contient les fichiers statiques.

L'interface, les routes et les formulaires sont en Angular. Les modules applicatifs React, leurs composants, hooks et points d'entrée ont été retirés. Vitest teste les contrats, règles métier, stockage du panier et politique de génération de configuration.

## Configuration et contrôles

Les paramètres locaux sont listés dans `.env.example`. Le script de préparation lit les fichiers `.env*` et génère `src/config/environment.generated.ts` avec une liste blanche de valeurs publiques. Le proxy généré (`proxy.generated.json`) et l'environnement généré sont ignorés par Git.

```bash
npm run format:check
npm run lint
npm audit --audit-level=moderate
npm run typecheck
npm test
npm run test:coverage
npm run e2e
npm run build
```

Les tests E2E utilisent Chromium, le serveur Angular SSR et un faux backend local. Ils vérifient une fiche produit rendue côté serveur, la CSP sans script inline, et les statuts HTTP 404. En CI, Chromium est installé dans un job dédié après le build. `npm run test:coverage` produit un rapport HTML dans `coverage/`.

## Déploiement

Vercel publie volontairement la démo simulée; ses rewrites ne concernent que les routes Angular connues, les autres URL retournent 404. En production, la CI copie `dist/` vers `.ci-builds/` puis construit une image Node non privilégiée qui sert le rendu SSR et les fichiers navigateur sur le port `4000` du conteneur (port `3000` sur l’hôte). Le serveur transmet `/api/` à `KUKUZA_API_UPSTREAM` et renvoie `503` si le backend est indisponible. La CSP `script-src 'self'` est appliquée par le serveur Node; l'hydratation n'injecte pas le script inline d'Event Replay. La liste `SSR_ALLOWED_HOSTS` doit contenir les noms de domaine réels, sans joker.

Sur `main`, le déploiement GitLab reste manuel après réussite des contrôles et tests navigateur. Le groupe de ressources sérialise les déploiements et les rend non interruptibles. Le job requiert une variable `SSH_KNOWN_HOSTS` contenant la clé d'hôte vérifiée hors pipeline ; il échoue si cette valeur manque. Le script attend que le nouveau conteneur passe son contrôle de santé avant de supprimer l'ancien et tente de le restaurer en cas d'échec. Le backend de production doit authentifier via un cookie `HttpOnly`, `Secure` et `SameSite`, émettre et valider le jeton CSRF attendu par Angular, appliquer les autorisations sur chaque endpoint, attribuer l'auteur des avis depuis la session et recalculer les prix du panier depuis son catalogue. Les gardes Angular ne remplacent pas ces contrôles serveur.
