# Cap Talents – Plateforme de recrutement (React + Vite)

## Lancer le projet
```
npm install
npm run dev
```
Ouvrir http://localhost:5173

## Comptes de démonstration
- Admin : admin@captalents.fr / admin123
- Candidat : awa@exemple.fr / awa123

## Structure
- src/shared.jsx : données de départ, niveaux de validation, composants communs
- src/App.jsx : navigation (routage par hash) et état global
- src/pages/ : Offres, Candidater, Connexion, Profil, Suivi, Admin

## Limites actuelles
Données stockées dans le localStorage du navigateur (pas de serveur) ; le CV n’est pas téléversé.
Prochaine étape : brancher une API (Node/Express + base de données) et un vrai hachage des mots de passe.
