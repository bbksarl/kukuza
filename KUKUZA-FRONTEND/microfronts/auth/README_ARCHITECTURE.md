# Microfrontend Auth - Architecture Documentation

## Vue d'ensemble

Le microfrontend `auth` implémente un système d'authentification et d'autorisation basé sur une architecture **Domain-Driven Design (DDD)** avec séparation claire des responsabilités. Les données fluent depuis l'API backend à travers des couches d'abstraction bien définies jusqu'aux composants React.

---

## Structure des dossiers et fichiers

### 📦 **Dossier racine**

- **`App.tsx`** : Point d'entrée principal du microfrontend auth. Configure le contexte d'application et les routes d'authentification (Login, Register, BoutiqueRegister).

- **`index.tsx`** : Fichier d'initialisation qui monte le composant App dans le DOM et configure la connexion avec le portail principal.

- **`types.d.ts`** : Déclarations de types TypeScript globales pour le microfrontend, incluant les types de module Webpack et les définitions d'interface globales.

---

### 🎨 **Dossier `components/`** - Composants réutilisables

- **`common/Button.tsx`** : Composant bouton générique avec support des variantes (primary, secondary, danger), états (disabled, loading) et intégration Tailwind CSS pour tous les styles.

- **`common/Input.tsx`** : Champ d'entrée réutilisable avec validation en temps réel, affichage des erreurs, placeholder personnalisé et support des différents types (text, email, password).

- **`common/KukuzaLogo.tsx`** : Logo de la marque Kukuza affichable dans le header et les formulaires, supports des variantes de taille et de couleur.

- **`common/SocialButton.tsx`** : Bouton pour l'authentification sociale (Google, Apple) avec icône intégrée et logique de redirection vers les providers OAuth.

- **`icons/GoogleIcon.tsx`, `AppleIcon.tsx`, `HomeIcon.tsx`** : Composants SVG réutilisables pour les icônes, optimisés pour l'accès aux composants et intégration facile avec les boutons.

- **`layout/AuthLayout.tsx`** : Layout wrapper qui fournit la structure visuelle commune à toutes les pages d'authentification (sidebar, header, footer) avec responsive design.

---

### ⚙️ **Dossier `config/`** - Configuration

- **`authConfig.ts`** : Configuration centralisée des paramètres d'authentification comme le nombre maximum de tentatives de connexion (5), la durée du verrou (15 minutes), les itérations PBKDF2 (100 000) et les secrets JWT.

- **`environment.ts`** : Gère les variables d'environnement (API_BASE_URL, JWT_SECRET, NODE_ENV) chargées depuis les fichiers `.env` ou les variables système, avec fallback sécurisé.

---

### 🏗️ **Dossier `domain/auth/`** - Logique métier (DDD)

#### Entités (`entities/`)

- **`User.ts`** : Entité représentant un utilisateur authentifié avec propriétés immutables (id, username, email, role, createdAt). Inclut des méthodes pour vérifier les rôles (isAdmin, isCreator) et générer des identifiants uniques.

- **`Credentials.ts`** : Entité encapsulant les identifiants d'authentification (email, password) avec validation et sanitization intégrée pour prévenir les injections XSS.

- **`Creator.ts`** : Entité pour les créateurs de contenu héritant de User avec propriétés supplémentaires comme boutique, nombre de followers, et statistiques de vente.

#### Value Objects (`value-objects/`)

- **`Password.ts`** : Value object immuable qui encapsule la logique de hachage PBKDF2 avec 100 000 itérations, génération de salt aléatoire, et comparaison sécurisée via crypto.subtle. Jamais stocké en clair.

- **`Hash.ts`** : Value object pour les valeurs hachées, fournissant conversion base64, comparaison constante et validation d'intégrité pour les hashes et les salts.

- **`Email.ts`** : Value object validant le format email via regex, normalisant en minuscules et fournissant des méthodes pour extraire le domaine et le nom d'utilisateur.

- **`PhoneNumber.ts`** : Value object validant les numéros de téléphone selon différents formats régionaux, avec normalisation et support des codes pays.

#### Services (`services/`)

- **`AuthService.ts`** : Orchestrateur principal pour login, register, logout et getCurrentUser. Délègue aux repositories pour l'API, à RateLimiter pour throttle, à InputSanitizer pour validation, et à TokenService pour gestion des tokens.

- **`TokenService.ts`** : Gère les tokens JWT (access/refresh) via secure cookies avec httpOnly, sameSite. Valide les tokens, extrait les claims, gère l'expiration. Inclut optimisations : caching des clés de signature JWT (1h TTL) pour 50-100x rapidité, auto-refresh, et émission d'événements pour UI.

- **`RateLimiter.ts`** : Service de throttling qui limite à 5 tentatives de login par email avec verrou de 15 minutes. Inclut optimisations : LRU cache limitée à 50 000 entrées max avec éviction automatique, cleanup tous les 15 minutes, getStats() pour monitoring mémoire.

- **`InputSanitizer.ts`** : Service de sanitization centralisé qui nettoie les entrées utilisateur contre XSS en supprimant balises HTML, scripts, event handlers et encodant les caractères spéciaux.

#### Repository (`repositories/`)

- **`AuthRepository.ts`** : Abstraction pour l'accès aux données d'authentification. Appelle les endpoints backend `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me` et gère les réponses, erreurs et transformation en entités domaine.

#### Types (`types/`)

- **`AuthTypes.ts`** : Interfaces TypeScript pour login (email, password), register (name, email, password, isBoutique), et responses avec validation Zod associée pour runtime safety.

#### Schémas (`schemas.ts`)

- **`schemas.ts`** : Défintions Zod pour validation runtime de tous les types auth : LoginData, RegisterData, User, Password avec règles spécifiques (min 8 chars, 1 upper, 1 lower, 1 number, 1 special).

---

### 🪝 **Dossier `hooks/`** - Custom React Hooks

- **`useAuth.ts`** : Hook principal pour accéder au contexte d'authentification, retourne user courant, loading state, fonctions login/register/logout, et state d'erreur pour affichage messages.

- **`useForm.ts`** : Hook pour gestion d'un formulaire générique avec state des champs, erreurs, validation, reset et submit, réutilisable pour Login, Register et BoutiqueRegister.

---

### 📄 **Dossier `views/`** - Pages/Vues

- **`Login.tsx`** : Page de connexion avec formulaire email/password, lien "Oublié mon mot de passe", boutons OAuth Google/Apple, et lien vers Register. Affiche erreurs et loading states.

- **`Register.tsx`** : Page d'inscription générale avec formulaire name/email/password, validation force du mot de passe, terms of service, captcha optionnel, et lien vers Login.

- **`BoutiqueRegister.tsx`** : Page spécialisée pour enregistrement des créateurs/boutiques avec champs supplémentaires : nom boutique, catégories, images, bio, et validation métier spécifique.

---

### 🛠️ **Dossier `utils/`** - Utilitaires

- **`logger.ts`** : Logger centralisé qui enregistre info, warn, error avec timestamp, contexte (component, action) et persistance locale pour debugging en production.

- **`LoggerAsync.ts`** : Version asynchrone non-bloquante du logger utilisant setImmediate pour queuer les logs par batch (100 logs) afin de ne pas bloquer l'event loop React.

- **`errorMonitor.ts`** : Service de monitoring d'erreurs qui capture et stocke les erreurs en mémoire (max 100), génère des métriques (par type, par component), et crée des rapports pour sentry/datadog.

- **`passwordSecurity.ts`** : Utilitaires pour évaluation de force de mot de passe (faible/moyen/fort), feedback utilisateur personnalisé, et vérification contre 100 000 mots de passe compromis via Have I Been Pwned.

- **`validation.ts`** : Fonctions de validation réutilisables pour email (RFC compliant), password (OWASP), phone, name avec messages d'erreur multilingues et support i18n.

- **`messages.ts`** : Dictionnaire des messages d'erreur, succès et info traduits (FR/EN) utilisés par les composants et services pour affichage cohérent.

---

### 🎨 **Dossier `styles/`**

- **`index.css`** : Feuille de style principale importée globalement, contient les variables CSS Tailwind personnalisées (couleurs Kukuza, spacing, typography) et quelques règles custom non-Tailwind.

---

### 📦 **Dossier `assets/`**

Dossier pour les images, logos, icons statiques utilisés dans les composants (logo Kukuza, social icons, background images).

---

## 🔄 Flux de données - Authentification

1. **User saisit credentials** → `Login.tsx` appelle `useAuth().login(email, password)`
2. **Hook appelle** → `AuthService.login()` qui valide et assainit les inputs
3. **Service appelle** → `AuthRepository.login()` qui fait POST `/auth/login` au backend
4. **Repository retourne** → `User` + `accessToken` + `refreshToken`
5. **TokenService stocke** → tokens dans secure cookies httpOnly
6. **UI met à jour** → via contexte, redirect vers dashboard

---

## 🔐 Sécurité

- Passwords hachés PBKDF2 100K iterations, jamais stockés en clair
- Tokens JWT en secure httpOnly cookies (CSRF protégé)
- Sanitization XSS sur tous les inputs utilisateur
- Rate limiting 5 tentatives/15 min par email
- CORS restrictif, SameSite=Strict sur cookies
- Validation Zod runtime pour toutes les données reçues

---

## 📊 Performance

- TokenService cache les clés JWT (50-100x plus rapide) avec auto-refresh timer
- LoggerAsync traite logs async en batch sans bloquer UI
- RateLimiter LRU cache limité 50K entrées avec éviction automatique
- Code splitting par route, lazy loading des vues
- Memoization des composants et hooks avec useMemo/useCallback

---

## 🚀 Intégration backend

Remplacer les URLs endpoints dans `AuthRepository.ts` :
- `POST /auth/login` → retourne `{ user, token, refreshToken }`
- `POST /auth/register` → retourne `{ user, token, refreshToken }`
- `POST /auth/logout` → révoque tokens
- `GET /auth/me` → retourne user courant avec authorization header

