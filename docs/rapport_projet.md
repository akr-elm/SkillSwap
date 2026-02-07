# Rapport de Projet - SkillSwap

Ce rapport contient les instructions d'utilisation, la description des fonctionnalités et la liste des points d'entrée (endpoints) de l'API.

## 1. Instructions d'Installation et d'Exécution

### Prérequis
- Node.js (v18+)
- PostgreSQL
- Un compte Netlify et Render (pour le déploiement)

### Backend (Serveur)
1. Installez les dépendances :
   ```bash
   cd server
   npm install
   ```
2. Configurez les variables d'environnement (`.env`) :
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/skillswap"
   JWT_SECRET="votre_secret"
   PORT=5000
   ```
3. Initialisez la base de données :
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```
4. Lancez le serveur :
   ```bash
   npm run dev
   ```

### Frontend (Client)
1. Installez les dépendances :
   ```bash
   cd client
   npm install
   ```
2. Lancez l'application :
   ```bash
   npm run dev
   ```

## 2. Captures d'Écran Recommandées

*Note : Pour un rapport complet, veuillez inclure des captures des sections suivantes :*
1. **Page d'Accueil** : Affichage des compétences disponibles avec filtres.
2. **Dashboard Utilisateur** : Vue d'ensemble des crédits et des échanges en cours.
3. **Formulaire de Création de Compétence** : Interface permettant d'ajouter une nouvelle offre.
4. **Interface d'Administration** : Liste des utilisateurs et gestion des contenus.

## 3. Liste des Endpoints API

| Méthode | Endpoint | Description | Authentification |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Créer un nouveau compte utilisateur | Non |
| **POST** | `/auth/login` | Authentification et réception du token JWT | Non |
| **GET** | `/skills` | Récupérer la liste des compétences (paginée) | Optionnel |
| **POST** | `/skills` | Ajouter une nouvelle compétence | Oui |
| **POST** | `/exchanges` | Demander un échange de compétences | Oui |
| **PATCH** | `/exchanges/:id/status`| Accepter/Refuser un échange | Oui |
| **GET** | `/users/dashboard` | Récupérer les statistiques de l'utilisateur | Oui |
| **GET** | `/admin/users` | Liste complète des utilisateurs (Admin) | Admin |

## 4. Système de Crédits
- Chaque nouvel utilisateur reçoit **10 crédits**.
- Un échange **ACCEPTÉ** transfère automatiquement les crédits de l'apprenant vers l'enseignant.
- Le solde est mis à jour en temps réel dans la base de données via Prisma.
