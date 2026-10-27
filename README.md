# KUKUZA

Application React/TypeScript unique, organisée par fonctionnalités : portail, catalogue, authentification, boutique et administration. La [façade HTTP](facade/) est la frontière réseau commune.

## Démarrage

Node.js 24 LTS recommandé (compatibilité déclarée dans `package.json`).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.local` est ignoré par Git. Si ce fichier existe déjà, conserver ses valeurs et adapter uniquement les paramètres nécessaires.

Par défaut, le navigateur appelle `/api`. Vite transmet ces requêtes au backend défini par `KUKUZA_API_PROXY_TARGET` (par défaut `https://localhost:7200`). Le préfixe `/api` est conservé. Le backend peut être absent : les écrans affichent alors une indisponibilité, sans inventer de données.

Pour un certificat ASP.NET local autosigné que Node ne reconnaît pas, configurer la confiance du certificat, ou activer explicitement `KUKUZA_API_PROXY_INSECURE=true` pour le proxy de développement uniquement.

`VITE_API_BASE_URL` peut aussi désigner une API sur une autre origine. Dans ce cas, le backend doit autoriser l'origine exacte du frontend et les credentials en CORS. Les cookies doivent être compatibles avec ce déploiement.

## Backend C# attendu

Le contrat cible est décrit dans [facade/docs/backend-contract.md](facade/docs/backend-contract.md). Les schémas Zod de `src/api/contracts/` valident les réponses utilisées par le frontend.

À implémenter ou aligner côté ASP.NET Core :

- `GET /api/Auth/me`, `POST /api/Auth/login`, `POST /api/Auth/logout` ;
- `POST /api/Auth/register` en multipart, incluant le profil et le logo de boutique ;
- `GET /api/Product` avec pagination et filtres serveur, `GET /api/Product/{id}` ;
- `POST /api/Order/checkout`, transactionnel et idempotent ;
- `GET /api/admin/overview`, avec les agrégats calculés côté serveur.

Le dépôt ne contient pas l'implémentation de ces endpoints C#. Les tests simulent leur contrat ; un test d'intégration avec le vrai backend reste nécessaire.

## Démonstration locale

Les données fictives nécessitent `VITE_ENABLE_API_MOCKS=true`. Les comptes administrateur et boutique configurés par les variables `VITE_DEFAULT_*` fonctionnent uniquement avec le serveur de développement. Utiliser des identifiants de démonstration, jamais ceux d'un compte réel : toute variable `VITE_*` est destinée au navigateur.

Les comptes de démonstration n'autorisent aucune opération sur le backend. Le backend reste responsable des rôles, des boutiques accessibles et des permissions.

## Contrôles

```bash
npm run lint
npm run typecheck
npm test
npm run build
# Ou tous les contrôles :
npm run check
```

ESLint vérifie notamment les règles des hooks et leurs dépendances. Les tests couvrent la session, les formulaires, les commandes, la pagination, les erreurs réseau et l'interface. La CI exécute le lint, TypeScript, les tests et le build.

## Docker / Nginx

La CI place le build dans `.ci-builds/`, utilisé par le Dockerfile. Pour construire localement :

```bash
npm run build
mkdir -p .ci-builds
cp -r dist/. .ci-builds/
docker build -t kukuza-frontend .
docker run --rm -p 3000:80 --add-host=host.docker.internal:host-gateway \
  -e KUKUZA_API_UPSTREAM=http://host.docker.internal:7200 kukuza-frontend
```

Adapter `KUKUZA_API_UPSTREAM` à l'origine HTTP(S) réelle du backend, sans chemin ni slash final. Le nom d'un service Docker peut remplacer `host.docker.internal` si les deux conteneurs partagent un réseau. La valeur est injectée dans le modèle Nginx au démarrage du conteneur.

Nginx transmet `/api/*` au backend et réserve le fallback `index.html` aux routes frontend. Un backend indisponible produit une réponse API `503`, sans retourner la page HTML. Le serveur `npm run preview` sert uniquement à inspecter le build ; il n'inclut pas ce proxy de production.
