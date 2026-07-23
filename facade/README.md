# Kukuza Facade

La façade frontend est l’unique frontière réseau de l’application. Elle attend un BFF/microservice C# exposé sur `/api` par défaut.

## Contrat attendu du microservice C#

- `200–299` : réponse JSON ou `204 No Content`;
- `401` : session absente ou expirée ; la façade redirige vers `/auth/login?returnUrl=...`;
- `403` : session valide mais autorisation insuffisante ; la façade redirige vers `/forbidden`;
- `429` : `Retry-After` recommandé ; uniquement les requêtes idempotentes sont rejouées;
- `X-Correlation-ID` : accepté et renvoyé dans les logs côté BFF;
- `X-Facade-Redirect` : chemin interne uniquement, jamais une URL externe.

Le BFF doit créer et renouveler la session dans un cookie `HttpOnly`, `Secure`, `SameSite`, et appliquer l’autorisation sur chaque endpoint.

Variables : `KUKUZA_FACADE_API_URL`, `KUKUZA_FACADE_TIMEOUT_MS`, `KUKUZA_AUTH_PATH`, `KUKUZA_FORBIDDEN_PATH`.

Un exemple de middleware ASP.NET Core est fourni dans `docs/KukuzaFacadeRedirectMiddleware.cs`.
Il s’insère après le routage du BFF et ajoute uniquement des en-têtes de navigation internes :

```csharp
app.UseKukuzaFacadeRedirects();
```
