# Portail

## Vue d'ensemble

Le Portail est le point d'entrée principal de l'application frontend KUKUZA, construit avec React et Vite. Il sert de conteneur pour les microfrontends et affiche l'interface principale de la marketplace.

## Configuration

Lancer le serveur de développement :

```bash
npm install
npm run dev
```

## Variables d'environnement

Copiez `.env.example` vers `.env.local` et configurez :

- `VITE_API_URL` : URL de base pour l'API backend

## Architecture

- **Microfrontends** : Charge dynamiquement les modules auth, user, admin et analytics.
- **Composants** : Composants React modulaires pour les sections UI.
- **Hooks** : Hooks personnalisés pour la récupération de données et la logique.
- **Services** : Clients API et registre des microfrontends.

## Évaluation de la sécurité

### État actuel
- Les appels API sont publics (pas d'en-têtes d'authentification).
- Les scripts des microfrontends sont chargés dynamiquement depuis des URLs configurées.
- Aucune validation d'entrée côté client visible.
- HTTPS doit être appliqué en production.

### Recommandations
- Implémenter l'authentification pour les points de terminaison API protégés.
- Valider et assainir toutes les entrées utilisateur.
- S'assurer que les URLs des microfrontends proviennent uniquement de sources fiables.
- Ajouter des en-têtes de Content Security Policy (CSP).
- Utiliser HTTPS en production.
- Auditer régulièrement les dépendances pour les vulnérabilités (`npm audit`).

## Évaluation de l'évolutivité

### État actuel
- L'architecture des microfrontends permet un déploiement indépendant.
- Les composants sont modulaires et réutilisables.
- Les hooks séparent la logique métier de l'UI.
- Pas de gestion d'état global (utilise l'état React).

### Recommandations
- Rendre le registre des microfrontends configurable via des variables d'environnement.
- Considérer l'ajout d'une bibliothèque de gestion d'état (e.g., Redux Toolkit, Zustand) pour un état complexe.
- Implémenter le chargement paresseux pour les composants afin d'améliorer le temps de chargement initial.
- Ajouter des limites d'erreur pour une meilleure gestion des erreurs.
- Considérer le rendu côté serveur (SSR) avec Vite pour de meilleures performances SEO.

## Évaluation de la maintenabilité

### État actuel
- Structure de dossiers bien organisée.
- React moderne avec hooks.
- Style cohérent avec Tailwind CSS.
- Repli sur des données mock pour le développement.
- Commentaires et documentation minimaux.

### Recommandations
- Ajouter des tests complets (unitaires, d'intégration) avec Jest et React Testing Library.
- Extraire les longues chaînes de classes Tailwind dans des classes CSS réutilisables ou des composants.
- Ajouter des commentaires JSDoc aux fonctions et composants.
- Implémenter le linting et le formatage (ESLint, Prettier).
- Ajouter TypeScript pour une meilleure sécurité de type.
- Documenter les props des composants et leur utilisation.
- Implémenter un pipeline CI/CD pour les tests automatisés et le déploiement.
- Ajouter la surveillance des performances et le suivi des erreurs (e.g., Sentry).

## Dépannage

- Si vous voyez une erreur concernant "@vitejs/plugin-react resolved to an ESM file", assurez-vous que votre Node est >= 16 et relancez `npm install`. Nous avons ajouté `vite.config.mjs` et `type: module` dans package.json pour assurer le chargement correct des plugins ESM par Vite.
- Pour les problèmes de chargement des microfrontends, vérifiez que les URLs du registre sont accessibles et que CORS est configuré.
