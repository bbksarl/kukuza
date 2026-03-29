Integration Backend — Guide rapide
================================

But: pour l'instant l'interface utilise des données fictives dans `Products.jsx` pour permettre au front-end de fonctionner sans back-end.

Configurer la connexion
-----------------------
- Créez un fichier `.env.local` à la racine du dossier `portal` et définissez `VITE_API_URL` :

```env
VITE_API_URL=http://localhost:4000/api
```

- Redémarrez le serveur de dev (`npm run dev`) après avoir ajouté la variable d'environnement.

Comportement du code
---------------------
- Le helper `src/services/api.js` exporte `getProducts()` et `getCategories()` qui tentent d'appeler les endpoints `GET /products` et `GET /categories`.
- Si `VITE_API_URL` n'est pas défini, ou si le réseau répond en erreur, les composants front-end utiliseront automatiquement les données fictives (fallback) afin de ne pas bloquer le développement.

Conseils pour l'intégration avec le back-end
-------------------------------------------
- Assurez-vous que les endpoints renvoient JSON compatible avec le shape attendu par `Products.jsx` (id, title, brand, price, oldPrice, image, discount).
- Pour le développement local, vous pouvez aussi utiliser MSW (Mock Service Worker) afin de simuler le back-end sans modifier votre code.
- N'oubliez pas les en-têtes CORS côté backend si le front et le back sont sur des origines différentes.
