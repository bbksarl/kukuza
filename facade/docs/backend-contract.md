# Contrat cible du BFF ASP.NET Core

Ce document décrit ce que le frontend attend. Il ne prétend pas décrire une API C# déjà présente dans ce dépôt. Lors du raccordement, aligner les contrôleurs sur ce contrat ou adapter les schémas/mappers frontend, puis valider les parcours avec le backend réel.

## Conventions

- Préfixe `/api`, propriétés JSON en camelCase, identifiants numériques entiers positifs.
- Dates ISO 8601 avec fuseau, par exemple `2026-10-26T16:00:00Z`.
- Montants JSON numériques ; calculs et arrondis côté C# avec `decimal` et une devise explicite.
- Les erreurs utilisent `application/problem+json` (`title`, `detail`, `status`, éventuellement `errors`).
- Ne pas transformer les erreurs API en redirections HTML. Renvoyer `401` ou `403`.
- Les réponses sont validées dans `src/api/contracts/`. Les champs indispensables absents produisent une erreur visible plutôt que des identifiants/prix inventés.

## Session

Le BFF crée une session cookie `HttpOnly`, `Secure`, `SameSite` adapté au déploiement, avec un chemin couvrant `/api`. Le frontend envoie les credentials. Pour une autre origine, configurer CORS avec l'origine exacte et `AllowCredentials`, et autoriser les en-têtes `Content-Type`, `Authorization`, `X-Correlation-ID`, `Idempotency-Key`. Ne pas utiliser une origine joker avec les credentials.

Pour les mutations authentifiées par cookie, appliquer côté serveur une protection CSRF : validation stricte de l'origine et de l'en-tête personnalisé attendu, ou protocole antiforgery explicite à intégrer au client. Vérifier les autorisations sur chaque endpoint et déterminer l'utilisateur à partir de la session, jamais d'un rôle ou identifiant fourni par le navigateur.

### GET `/Auth/me`

`200` avec un utilisateur vérifié ; `401` si la session est absente, expirée ou révoquée :

```json
{
  "id": 12,
  "username": "amina",
  "email": "amina@example.com",
  "role": "brand",
  "createdAt": "2026-10-26T00:00:00Z",
  "brandId": 34
}
```

Rôles acceptés : `customer`, `brand`/`creator`, `admin`. `brand` devient `creator` dans l'interface. `brandId` est facultatif ou nul pour les clients. Le stockage local est un cache ; les gardes de routes attendent la vérification serveur.

### POST `/Auth/login`

JSON `{ "username": "amina", "password": "…" }`. Réponse `200` : `{ "user": <utilisateur ci-dessus> }`, plus le cookie de session. Un champ `token` facultatif reste accepté pour une API Bearer existante. Le BFF doit appliquer sa politique de connexion et sa limitation de tentatives.

### POST `/Auth/logout`

Invalider la session et expirer son cookie avec le même chemin/domaine. Répondre `204` (un `401` est également traité comme une session déjà fermée). Une erreur réseau n'est pas présentée comme une déconnexion réussie.

### POST `/Auth/register`

`multipart/form-data`, compatible avec un DTO `[FromForm]` ASP.NET Core :

| Champ | Type | Condition |
| --- | --- | --- |
| `username`, `name`, `email`, `password` | string | Toujours |
| `role` | `customer` ou `brand` | Toujours ; ne jamais accepter `admin` via l'inscription publique |
| `boutique.shopName`, `boutique.address`, `boutique.postalCode` | string | Compte boutique |
| `boutique.country`, `boutique.phoneNumber`, `boutique.description` | string | Compte boutique |
| `boutique.logo` | IFormFile | Facultatif |

Créer le compte et son profil boutique de manière cohérente, puis ouvrir la session. Réponse `201` ou `200` : `{ "user": <utilisateur> }`. Valider les fichiers côté serveur (taille, contenu et stockage). Le mot de passe n'est jamais haché ni validé comme preuve d'identité dans le navigateur.

## Catalogue

### GET `/Product?page=1&limit=12`

Réponse unique pour le portail et le catalogue :

```json
{
  "items": [{
    "id": 56,
    "name": "Robe",
    "price": 125,
    "description": "Robe en coton",
    "imageUrl": "/assets/robe.jpg",
    "categoryId": 3,
    "category": "vetements",
    "brandId": 34,
    "brand": { "id": 34, "name": "Atelier Amina" },
    "gender": "Femme",
    "ageRange": "Adulte",
    "sizes": ["S", "M", "L"]
  }],
  "total": 1234,
  "page": 1,
  "limit": 12
}
```

`page` commence à 1 ; `limit` est compris entre 1 et 100 et représente la taille réellement appliquée. `total` est le nombre total **après filtrage**, avant pagination. Appliquer un ordre stable avec départage par identifiant.

Filtres facultatifs : `search`, `categoryId`, `gender`, `nav`, `filter`. Appliquer tous les filtres côté serveur avant pagination. Les valeurs de navigation et de filtres actuellement proposées par l'interface sont décrites dans `src/features/portal/data/catalog.ts` (`NAV_ITEMS`, `FILTERS_BY_TYPE`, `applyProductFilters`). Ce dernier constitue la sémantique de référence pour les démonstrations locales.

### GET `/Product/{id}`

Un objet produit avec les mêmes champs ; `404` si absent. Les fiches ne téléchargent pas le catalogue entier.

### GET `/Category` et GET `/Brand`

Tableaux d'objets `{ "id": 3, "name": "…" }`. Les marques peuvent inclure `profileImageUrl`. Pour la résolution des boutiques du vendeur, la réponse `/Brand` doit fournir `userId` et être limitée aux données qu'il peut consulter.

### POST `/brands/{brandId}/products`

Multipart : `name`, `price`, `stock`, `categoryId`, `gender`, `ageRange`, et plusieurs fichiers `images`. Répondre avec le produit créé. Vérifier l'appartenance de la boutique, la catégorie, les quantités et les images côté serveur. `GET /brands/{brandId}/categories` retourne les catégories disponibles, `GET /brands/{brandId}/products` les produits de la boutique. Les chemins sont configurables via `VITE_BRAND_*`.

Les avis utilisent actuellement `GET /ProductReview/product/{id}` et `POST /Review`. Ce dernier reçoit `productId`, `rating`, `comment` et un `userId` historique ; le backend doit déduire l'auteur de la session et ignorer/refuser toute usurpation de cet identifiant.

## Commande transactionnelle

### POST `/Order/checkout`

En-tête obligatoire `Idempotency-Key: <UUID>`. Corps :

```json
{ "items": [{ "productId": 56, "quantity": 2, "size": "M", "color": "Bleu" }] }
```

`size` et `color` sont facultatifs. Aucun prix, total, statut, date ou identifiant de client n'est envoyé. Réponse `201` ou réponse rejouée `200` :

```json
{ "id": 78, "totalAmount": 250, "currency": "EUR" }
```

Dans une transaction serveur : identifier le client authentifié, charger les produits et variantes, vérifier le stock, recalculer les prix/remises/taxes, créer la commande et ses lignes, mettre à jour les stocks. L'opération doit réussir ou échouer en totalité.

Stocker la clé d'idempotence par utilisateur avec l'empreinte du corps et la réponse. Même clé et même corps : même résultat, même en cas d'appels concurrents. Même clé et corps différent : `409`. Conserver la clé suffisamment longtemps pour couvrir les reprises après coupure réseau. La création de commande n'est pas une confirmation de paiement.

Le frontend conserve la tentative en `sessionStorage` jusqu'à une réponse valide ; il réutilise sa clé après timeout/rechargement et génère une nouvelle clé si le panier ou le compte change. Si le stockage est bloqué, cette protection survit uniquement dans l'onglet tant qu'il n'est pas rechargé.

## Administration et métriques

### GET `/admin/overview` — administrateur uniquement

```json
{
  "totals": { "revenue": 250, "boutiques": 1, "users": 2, "products": 1 },
  "sales": [{ "label": "10-26", "value": 250 }],
  "boutiques": [{ "id": 34, "name": "Atelier Amina", "owner": "amina", "image": "/assets/logo.png", "status": "active", "products": 1, "revenue": 250 }],
  "topProducts": [{ "id": 56, "name": "Robe", "brand": "Atelier Amina", "image": "/assets/robe.jpg", "unitsSold": 2, "revenue": 250, "stock": 8 }],
  "recentUsers": [{ "id": 12, "name": "Amina", "email": "amina@example.com", "role": "brand", "joinedAt": "2026-10-26T00:00:00Z", "status": "active" }]
}
```

Les totaux sont calculés sur l'ensemble du périmètre autorisé, indépendamment des listes limitées affichées. Le chiffre d'affaires doit suivre la règle métier choisie pour les commandes payées/terminées. Les listes `topProducts` et `recentUsers` sont des sélections ; elles ne constituent pas des endpoints paginés de gestion exhaustive.

`GET /brands/{brandId}/metrics?period=month&year=2026&month=10` reste utilisé pour le dashboard vendeur. Voir `AnalyticsCacheService.ts` pour les périodes jour/mois/année et `shopMappers.ts` pour la réponse consommée.

## Validation avec le backend réel

Vérifier login, restauration/expiration/révocation de session, logout, rôles, inscription avec logo, catalogue dépassant 1000 articles, recherche/filtrage, création de produit et commande. Simuler une coupure après validation serveur du checkout puis rejouer la même clé. Vérifier que CORS/cookies et le proxy fonctionnent avec les véritables domaines et certificats.

Lorsque l'API existe, publier son OpenAPI et l'utiliser pour générer/contrôler les types TypeScript ; les schémas actuels définissent le contrat cible en attendant.
