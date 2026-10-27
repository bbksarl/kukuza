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

## Organisation du catalogue

`ProductsList.tsx` gère les filtres dans l'URL et compose les composants de `components/catalog/` : recherche, carte produit et chargement. La sélection des suggestions est isolée dans `utils/productSuggestions.ts` ; les suggestions utilisent uniquement les produits déjà chargés. La recherche complète est envoyée à l'API lors de la validation.

`Header.tsx` compose les éléments de `components/header/`. Le hook `useHeaderNavigation` centralise la navigation et le panneau ouvert (menu, filtres, recherche ou langue), ainsi que sa fermeture au clavier ou lors d'un changement de route.

`data/catalog.ts` conserve les exports publics ; les implémentations sont réparties dans `data/catalog/` : types, navigation, libellés, filtres, conversion des produits et données locales/de démonstration. Les conversions exigent un identifiant, un nom et un prix valides.

Les appels réseau restent dans les services et la façade HTTP. `usePaginatedProducts` gère l'annulation des anciennes recherches, conserve les produits pendant le chargement suivant et permet de réessayer la page en échec.

## Organisation de la boutique

`AddProduct.tsx` compose le formulaire et l'aperçu. `useProductForm` gère les champs, la validation, le chargement des catégories et la soumission ; les composants de `components/products/` gèrent l'affichage. Une soumission en cours verrouille les champs et empêche une seconde création simultanée. Une erreur conserve les saisies ; une réponse valide réinitialise le formulaire. Les aperçus libèrent leurs URL temporaires.

Les schémas de `src/api/contracts/shop.ts` valident les produits, ventes et métriques après conversion des alias connus. Les identifiants, dates, montants et statuts essentiels ne sont plus inventés. Une réponse invalide provoque une erreur, y compris en mode démo. Les statistiques facultatives absentes restent `null` : elles s'affichent avec un tiret ou sans pourcentage de variation. Le [contrat proposé](facade/docs/backend-contract.md) détaille les champs attendus.

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

La CI GitLab crée des pipelines de vérification sur les merge requests et sur `main`. Les jobs d'installation, de test et de build participent aux deux. La publication Docker reste réservée à `main`, avec un déploiement manuel ; les merge requests n'exécutent aucun de ces deux jobs. Les [règles GitLab](https://docs.gitlab.com/ci/jobs/job_rules/) sont déclarées explicitement sur chaque groupe de jobs.

Les tests de la boutique couvrent aussi les réponses incomplètes, les statistiques absentes, les reprises du formulaire après erreur et les soumissions simultanées.

Les parcours de `ProductsList.test.tsx` simulent les réponses de `fetch` en conservant la vraie façade HTTP, les services et les validations Zod. Ils couvrent la recherche et le retour navigateur, les suggestions au clavier, la pagination avec reprise après erreur, les réponses invalides et les résultats vides. Les exemples de réponses sont dans `tests/fixtures/catalog.ts`. Aucun serveur C# ni mode de démonstration n'est nécessaire pour les exécuter :

```bash
npm test -- src/features/portal/pages/ProductsList.test.tsx src/features/portal/components/portal/Header.test.tsx
```

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
