# Frontend — Plateforme de gestion des stages

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

L'application démarre sur http://localhost:5173 et communique avec l'API Laravel sur http://localhost:8000/api
(voir `src/api/axios.js` pour changer l'URL de base).

## Build de production

```bash
npm run build
```

## Structure

```
src/
├── api/axios.js              # instance Axios + intercepteur de token
├── context/AuthContext.jsx   # authentification (login, register, logout)
├── components/
│   ├── Navbar.jsx            # navigation adaptée au rôle (étudiant / entreprise / admin)
│   └── Layout.jsx            # wrapper Navbar + contenu
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx         # statistiques + graphiques (recharts)
│   ├── Offers.jsx            # liste, création, candidature aux offres
│   ├── Companies.jsx
│   ├── Students.jsx
│   ├── Applications.jsx      # candidatures + validation entreprise
│   ├── Conventions.jsx       # dépôt + suivi des conventions
│   ├── Reports.jsx           # dépôt + suivi des rapports
│   └── AdminValidation.jsx   # validation admin (offres / conventions / rapports)
└── routes/AppRoutes.jsx      # routing + routes protégées
```

## Notes

- L'authentification utilise un token Bearer stocké dans `localStorage`.
- Les liens de fichiers (CV, conventions, rapports) pointent vers `http://localhost:8000/storage/...`
  — pense à exécuter `php artisan storage:link` côté backend.
- Pense à configurer CORS côté Laravel (`config/cors.php`) pour autoriser `http://localhost:5173`.
