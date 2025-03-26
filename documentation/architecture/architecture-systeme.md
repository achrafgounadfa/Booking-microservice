# Architecture du Système de Billetterie

Ce document détaille l'architecture microservices de notre système de billetterie pour concerts et événements.

## Vue d'ensemble

Notre système est basé sur une architecture microservices moderne, conçue pour offrir une haute disponibilité, une excellente scalabilité et une maintenance facilitée. Chaque microservice est responsable d'une fonctionnalité spécifique et peut être développé, déployé et mis à l'échelle indépendamment.

## Diagramme d'architecture

```
┌─────────────┐     ┌─────────────┐
│             │     │             │
│   Client    │────▶│ API Gateway │
│  (Browser)  │     │  (Kong/Nginx)│
│             │◀────│             │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │             │  │             │  │             │  │         │ │
│  │ Auth Service│  │ User Service│  │Event Service│  │  ...    │ │
│  │             │  │             │  │             │  │         │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │
│         │                │                │              │      │
│         └────────────────┼────────────────┼──────────────┘      │
│                          │                │                     │
│                          ▼                ▼                     │
│                    ┌─────────────┐  ┌─────────────┐             │
│                    │             │  │             │             │
│                    │  RabbitMQ   │  │  MongoDB    │             │
│                    │             │  │  Atlas      │             │
│                    └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Composants principaux

### 1. API Gateway (Kong/Nginx)

Point d'entrée unique pour toutes les requêtes client. Responsable de :
- Routage des requêtes vers les microservices appropriés
- Load balancing
- Rate limiting
- Authentification et autorisation de premier niveau
- Logging et monitoring

### 2. Microservices

#### Auth Service
- Gestion de l'authentification et des autorisations
- Inscription et connexion des utilisateurs
- Génération et validation des tokens JWT
- Gestion des rôles (Admin, EventCreator/Operator, User)

#### User Service
- Gestion des profils utilisateurs
- Stockage des informations personnelles
- Historique des achats
- Préférences utilisateur

#### Event Service
- Gestion des événements et concerts
- Catégorisation des événements
- Gestion des lieux (venues)
- Recherche et filtrage des événements

#### Ticket Service
- Gestion des billets disponibles
- Réservation de billets
- Vérification de la disponibilité
- Génération de billets numérotés

#### Payment Service
- Traitement des paiements par carte bancaire
- Sécurisation des transactions
- Sauvegarde régulière des données de paiement
- Gestion des remboursements

#### Notification Service
- Envoi des confirmations par email/SMS
- Gestion des templates de notification
- File d'attente pour les notifications
- Suivi de l'état des notifications

### 3. Communication entre services

#### Communication synchrone (REST)
- Utilisée pour les opérations nécessitant une réponse immédiate
- Implémentée via HTTP/REST
- Gestion des erreurs avec codes HTTP appropriés

#### Communication asynchrone (RabbitMQ)
- Utilisée pour les opérations qui peuvent être traitées de manière asynchrone
- Implémentée via RabbitMQ
- Patterns utilisés : Publish/Subscribe, Work Queues
- Exemples d'utilisation :
  - Envoi de notifications après un achat
  - Mise à jour des statistiques d'événements
  - Sauvegarde des données de paiement

### 4. Persistance des données

#### MongoDB Atlas
- Base de données NoSQL distribuée
- Chaque microservice a sa propre base de données
- Schémas optimisés pour les requêtes spécifiques à chaque service
- Indexation pour les performances
- Sécurité renforcée (pas de mots de passe en clair)

## Considérations de conception

### Scalabilité
- Architecture horizontalement scalable
- Stateless pour faciliter la réplication
- Utilisation de MongoDB Atlas pour la scalabilité de la base de données

### Haute disponibilité
- Redondance des services critiques
- Gestion des pannes avec circuit breakers
- Persistance des messages avec RabbitMQ

### Sécurité
- JWT pour l'authentification
- Chiffrement des données sensibles
- Validation des entrées utilisateur
- Protection contre les attaques courantes (CSRF, XSS, etc.)

### Observabilité
- Logging centralisé
- Monitoring des services
- Traçabilité des requêtes entre services

## Flux d'exécution typiques

### Achat de billet
1. L'utilisateur s'authentifie via l'Auth Service
2. L'utilisateur recherche un événement via l'Event Service
3. L'utilisateur sélectionne des billets via le Ticket Service
4. Le Ticket Service vérifie la disponibilité et réserve temporairement les billets
5. L'utilisateur procède au paiement via le Payment Service
6. Le Payment Service confirme la transaction
7. Le Ticket Service confirme la réservation et génère les billets
8. Le Notification Service envoie une confirmation par email
9. Le User Service met à jour l'historique d'achat de l'utilisateur

### Création d'événement
1. L'organisateur s'authentifie via l'Auth Service
2. L'Auth Service vérifie les droits d'organisateur
3. L'organisateur crée un événement via l'Event Service
4. L'Event Service enregistre l'événement
5. Le Ticket Service crée les billets disponibles pour l'événement
6. Le Notification Service peut envoyer des notifications aux utilisateurs intéressés
