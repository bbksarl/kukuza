# KUKUZA

Le dépôt contient une seule application React/TypeScript à la racine.

Il n’y a plus de déploiement microfrontend. Le pipeline installe, teste et compile un seul projet, puis Docker/Nginx sert un seul `dist` avec fallback SPA sur `index.html`.

```bash
npm install
npm run dev
```

La frontière réseau unique est [`facade/`](facade/), conçue pour attendre le BFF/microservice C#.

## Configuration locale

Les comptes de démonstration sont chargés depuis des variables d’environnement locales. Copiez `.env.example` vers `.env.local`, puis renseignez vos propres valeurs. `.env.local` est ignoré par Git et ne doit jamais être publié.
