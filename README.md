# Système de Billetterie pour Concerts et Événements

Bienvenue dans le projet de système de billetterie pour concerts et événements. Ce système complet, basé sur une architecture microservices, permet de gérer des événements de toutes tailles, de la vente de billets jusqu'à la gestion des utilisateurs et des paiements.

## Structure du projet

- **`/backend`** : Code source des microservices backend (NestJS)
- **`/frontend`** : Code source du frontend (Next.js + TailwindCSS)
- **`/documentation`** : Documentation complète du projet
- **`/presentation`** : Présentation du projet
- **`/docker-compose.yml`** : Configuration Docker pour le déploiement

## Fonctionnalités principales

- API complète pour la gestion des événements, utilisateurs, billets et paiements
- Authentification et autorisation avec différents rôles (Admin, EventCreator, User)
- Interface utilisateur intuitive inspirée de la Fnac Spectacles
- Processus d'achat de billets sécurisé
- Notifications par email pour les confirmations d'achat
- Déploiement facile avec Docker

## Technologies utilisées

- **Backend** : Node.js avec NestJS
- **Frontend** : React.js (Next.js) avec TailwindCSS
- **Base de données** : MongoDB (via Mongoose) hébergée sur MongoDB Atlas
- **Communication entre services** : RabbitMQ
- **Sécurité** : JWT, bcrypt
- **Déploiement** : Docker, Docker Compose

## Installation et déploiement

Pour installer et déployer le projet, veuillez consulter le [guide d'installation](/documentation/installation/guide-installation.md).

En résumé :

1. Clonez ce dépôt
2. Configurez les variables d'environnement en copiant `.env.example` vers `.env`
3. Lancez le système avec Docker Compose :
   ```bash
   docker-compose up -d
   ```

## Documentation

La documentation complète du projet est disponible dans le dossier `/documentation` :

- [Architecture du système](/documentation/architecture/architecture-systeme.md)
- [Guide d'installation](/documentation/installation/guide-installation.md)
- [Documentation API](/documentation/api/api-reference.md)
- [Guide d'utilisation](/documentation/utilisation/guide-utilisation.md)

## Présentation

Une présentation détaillée du projet est disponible dans le dossier `/presentation`.

## Auteurs

Développé par l'équipe de projet en Mars 2025.

## Licence

Ce projet est sous licence MIT.
