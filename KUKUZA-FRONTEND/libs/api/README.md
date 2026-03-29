# API Library - Point d'Entrée Centralisé

Cette bibliothèque est le **point d'entrée unique** pour tous les appels API backend depuis les microfronts.

## 📦 Structure

```
libs/api/
├── index.ts           → Point d'entrée principal (recommandé)
├── api.config.ts      → Configuration API (URLs, timeout, retries)
├── httpClient.ts      → HTTP Client avec interceptors
├── tokenService.ts    → Gestion des tokens JWT
├── AuthService.js     → Backward compatibility (legacy)
└── ApiService.js      → Generic API Service (legacy)
```

## 🎯 Utilisation

### Import Recommandé (TypeScript)

```typescript
import { httpClient, tokenService } from '@libs/api';

// HTTP Request avec interceptors auto
const response = await httpClient.post('/auth/login', credentials);

// Token management
tokenService.getToken();
tokenService.setToken(token);
tokenService.removeToken();
```

### Import Legacy (JavaScript)

```javascript
import { httpClient, tokenService } from '@libs/api/AuthService';
// Compatible avec ancien code
```

## ✨ Fonctionnalités

### HttpClient

Automatiquement fourni par `httpClient` :

✅ **Bearer Token Interceptor**
- Ajoute `Authorization: Bearer <token>` automatiquement
- Pas besoin de passer headers manuellement

✅ **Timeout Interceptor**
- 10 secondes par défaut (configurable)
- Utilise AbortController natif
- Lance erreur si timeout dépassé

✅ **Retry Logic**
- Réessaye 1 fois par défaut (configurable)
- Exponential backoff (100ms, 200ms, 400ms, etc.)
- Idéal pour erreurs réseau temporaires

✅ **Content-Type Header**
- Ajoute automatiquement pour POST/PUT/PATCH
- Pas d'erreur si déjà défini

### TokenService

```typescript
// Vérifier si authentifié
if (tokenService.isAuthenticated()) { ... }

// Valider token JWT (expiration)
if (tokenService.isTokenValid()) { ... }

// Récupérer payload du token
const payload = tokenService.getTokenPayload();
console.log(payload.sub, payload.exp);
```

## 📝 Exemples

### 1. Login

```typescript
import { httpClient, tokenService } from '@libs/api';

const response = await httpClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

if (response.ok) {
  tokenService.setToken(response.data.token);
}
```

### 2. GET avec Bearer Token

```typescript
// Bearer token ajouté automatiquement
const response = await httpClient.get('/users/me');

if (response.ok) {
  console.log(response.data.user);
}
```

### 3. Custom Timeout

```typescript
const response = await httpClient.post(
  '/long-operation',
  data,
  { timeout: 30000 } // 30 secondes
);
```

### 4. Skip Auth (pour endpoints publics)

```typescript
const response = await httpClient.get(
  '/public/info',
  { skipAuth: true }
);
```

## 🔧 Configuration

Variables d'environnement :

```bash
# .env
REACT_APP_API_BASE_URL=https://api.kukuza.com

# Dev local
REACT_APP_API_BASE_URL=http://localhost:3000
```

Configuration en code :

```typescript
import { API_BASE_URL, HTTP_CONFIG } from '@libs/api';

console.log(API_BASE_URL); // 'https://api.kukuza.com'
console.log(HTTP_CONFIG.timeout); // 10000
console.log(HTTP_CONFIG.retries); // 1
```

## 🚀 Intégration dans les Microfronts

### Auth Microfront

```typescript
import { httpClient, tokenService } from '@libs/api';

class AuthService {
  async login(credentials) {
    const response = await httpClient.post('/auth/login', credentials);
    if (response.ok) {
      tokenService.setToken(response.data.token);
    }
    return response;
  }
}
```

### Portal Microfront

```typescript
import { httpClient } from '@libs/api';

const products = await httpClient.get('/products');
```

### Boutique Microfront

```typescript
import { httpClient } from '@libs/api';

const sales = await httpClient.get('/sales');
```

## 📊 Impact Architecture

| Avant | Après |
|-------|-------|
| ❌ Chaque microfront implémente HTTP client | ✅ Une seule source de vérité |
| ❌ Bearer token = responsabilité dev | ✅ Bearer token automatique |
| ❌ Pas de timeout global | ✅ Timeout 10s par défaut |
| ❌ Pas de retry logic | ✅ Retry + exponential backoff |
| ❌ Erreurs non standardisées | ✅ Réponses uniformes `{ ok, status, data, error }` |

## 🔐 Sécurité

✅ Tokens en httpOnly cookies (protection XSS)
✅ sameSite=strict (protection CSRF)
✅ JWT expiration validée
✅ Bearer token pattern correct
✅ Timeout pour éviter requêtes gelées

## 📋 Checklist Migration

- [ ] Importer `httpClient` depuis `@libs/api`
- [ ] Remplacer appels `fetch()` manuels
- [ ] Vérifier Bearer token ajouté automatiquement
- [ ] Tester timeout (ne doit pas bloquer)
- [ ] Vérifier retry logic fonctionne
- [ ] Mettre à jour erreur handling avec `{ ok, error }` pattern
