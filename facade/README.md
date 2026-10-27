# Kukuza Facade

Client HTTP partagé par toutes les fonctionnalités. Il gère le JSON et le multipart, les cookies de session, l'éventuel Bearer token, l'annulation, un délai couvrant aussi la lecture du corps, les corrélations et les redirections internes.

- `200–299` : JSON, ou `204 No Content`.
- `401` : redirection vers `/auth/login?returnUrl=...`, sauf les appels de session et de formulaires qui affichent leurs erreurs localement.
- `403` : redirection interne vers `/forbidden`.
- `429` et erreurs transitoires : au maximum une nouvelle tentative pour `GET`, `HEAD`, `OPTIONS`, avec prise en compte de `Retry-After`.
- Les écritures ne sont pas rejouées automatiquement.
- `X-Correlation-ID` accompagne chaque requête.
- `X-Facade-Redirect` accepte uniquement un chemin interne.

Configuration navigateur : `VITE_API_BASE_URL` (défaut `/api`) et `VITE_API_TIMEOUT` (défaut 15000 ms). Les options du constructeur permettent de remplacer ces valeurs. Les variables historiques `KUKUZA_FACADE_*` restent lisibles dans un environnement Node, mais Vite ne les expose pas au navigateur.

Le [contrat backend](docs/backend-contract.md) décrit les endpoints et les responsabilités ASP.NET Core. Le [middleware C# de référence](docs/KukuzaFacadeRedirectMiddleware.cs) illustre les en-têtes de navigation ; ce n'est pas une implémentation du backend.
