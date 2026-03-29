# Catalog Microfront

Microfront pour l'affichage et la gestion des produits, catégories et avis.

## Structure

```
src/
├── pages/
│   ├── ProductBrowser.tsx  - Affichage liste produits
│   ├── ProductDetail.tsx   - Détail d'un produit
│   └── Search.tsx          - Recherche produits
├── components/
│   └── catalog/
│       ├── ProductCard.tsx  - Carte produit
│       ├── ReviewsList.tsx  - Liste avis
│       └── RatingStars.tsx  - Étoiles notation
├── hooks/
│   ├── useProducts.ts      - Hook gestion produits
│   └── useReviews.ts       - Hook gestion avis
├── services/
│   └── CatalogService.ts   - API client catalog-service
└── styles/
    └── index.css           - Styles globaux
```

## Utilisation

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build
```

## API Endpoints (catalog-service)

- `GET /products` - Liste produits
- `GET /products/:id` - Détail produit
- `GET /categories` - Liste catégories
- `GET /products/:id/reviews` - Avis produit
- `POST /products/:id/reviews` - Créer avis (authentifié)
- `GET /products/search?q=...` - Rechercher produits
