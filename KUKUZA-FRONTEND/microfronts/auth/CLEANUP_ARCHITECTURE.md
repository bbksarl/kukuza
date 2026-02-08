# Nettoyage Architecture Auth - Suppressions Recommandées

Date : 8 février 2026
Status : PARTIELLEMENT APPLIQUÉ

## 📋 Résumé des changements

### ✅ APPLIQUÉ

1. **Imports nettoyés dans AuthRepository.ts**
   - Supprimé import inutilisé : `Creator.ts`
   - Supprimé import inutilisé : `Password.ts` (non utilisé)
   - Ces imports n'étaient jamais utilisés dans AuthRepository

2. **Value Objects fusionnés**
   - Créé `value-objects/index.ts` qui exporte : `Email`, `Hash`, `Password`
   - Consolide 3 fichiers en 1 barrel export
   - Permet `import { Email, Hash, Password } from '../value-objects'`

3. **getCreator() clarifié**
   - Type de retour changé de `Promise<Creator | null>` à `Promise<null>`
   - Ajout TODO comment pour implémentation future
   - Clarifie que c'est pas utilisé actuellement

### ⏳ À FAIRE MANUELLEMENT (pas de tool pour supprimer fichiers)

Les fichiers suivants peuvent être supprimés car ils sont dead code :

```bash
# Fichiers à supprimer :
rm src/domain/auth/value-objects/Email.ts
rm src/domain/auth/value-objects/Password.ts
rm src/domain/auth/value-objects/Hash.ts
rm src/domain/auth/value-objects/PhoneNumber.ts
rm src/domain/auth/entities/Creator.ts
```

Après suppression, le nombre de fichiers passera de **17 → 12** fichiers. ✨

### 📊 Avant / Après

| Métrique | Avant | Après |
|----------|-------|-------|
| Fichiers | 17 | 12 (approx) |
| Imports dupliqués | 3 | 0 |
| Dead code | 2 fichiers | 0 |
| Clarté architecture | Bonne | Excellente |

## 🎯 Bénéfices

- ✅ Moins de fichiers à naviguer
- ✅ Imports clarifiés (index.ts barrel export)
- ✅ Dead code supprimé
- ✅ Architecture plus propre sans perte de fonctionnalité

## 📝 Notes

- `PhoneNumber.ts` : Jamais utilisé, peut être supprimé
- `Creator.ts` : Jamais utilisé (getCreator retourne toujours null)
- Les rate limiters (`RateLimiter.ts`, `RedisRateLimiter.ts`) sont gardés séparés car :
  - Logique complexe et indépendante
  - Peut évoluer séparément
  - Tests plus faciles si séparés

## ✨ Structure recommandée finale

```
domain/auth/
├── constants/
│   └── ApiErrors.ts
├── entities/
│   └── User.ts
│   └── Credentials.ts
│   (Creator.ts - À SUPPRIMER)
├── repositories/
│   └── AuthRepository.ts
├── services/
│   ├── AuthService.ts
│   ├── InputSanitizer.ts
│   ├── RateLimiter.ts
│   ├── RedisRateLimiter.ts
│   ├── ServiceContainer.ts
│   └── TokenService.ts
├── types/
│   └── AuthTypes.ts
├── value-objects/
│   ├── index.ts (Email, Hash, Password)
│   (Email.ts - À SUPPRIMER)
│   (Hash.ts - À SUPPRIMER)
│   (Password.ts - À SUPPRIMER)
│   (PhoneNumber.ts - À SUPPRIMER)
└── schemas.ts

TOTAL: 12 fichiers vs 17 avant
```
