# Architecture Microservices pour le Système de Billetterie

## Vue d'ensemble de l'architecture

Notre système de billetterie sera composé de plusieurs microservices indépendants qui communiqueront entre eux via des API REST et des messages asynchrones (RabbitMQ). Cette architecture permettra une grande scalabilité et une maintenance facilitée.

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  API Gateway    │     │  Frontend       │
│  (Kong/Nginx)   │     │  (Next.js)      │
│                 │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐     ┌────────▼────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Auth Service   │     │  Event Service  │     │  User Service   │
│  (NestJS)       │◄────┼────►(NestJS)    │◄────┼────►(NestJS)    │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │               ┌───────┴───────┐               │
         │               │               │               │
┌────────▼────────┐     │ ┌─────────────▼─┐     ┌───────▼────────┐
│                 │     │ │               │     │                │
│  Payment        │◄────┼─┤  Ticket       │◄────┤  Notification  │
│  Service        │     │ │  Service      │     │  Service       │
│  (NestJS)       │     │ │  (NestJS)     │     │  (NestJS)      │
│                 │     │ │               │     │                │
└────────┬────────┘     │ └───────┬───────┘     └────────┬───────┘
         │              │         │                      │
         └──────────────┼─────────┼──────────────────────┘
                        │         │
                ┌───────▼─────────▼───────┐
                │                         │
                │  Message Broker         │
                │  (RabbitMQ)             │
                │                         │
                └─────────────────────────┘
```

## Microservices

### 1. API Gateway (Kong/Nginx)
- **Rôle**: Point d'entrée unique pour toutes les requêtes, routage vers les microservices appropriés
- **Fonctionnalités**:
  - Routage des requêtes
  - Load balancing
  - Rate limiting
  - Authentification (vérification des JWT)
  - SSL/TLS termination
  - Logging et monitoring

### 2. Auth Service
- **Rôle**: Gestion de l'authentification et de l'autorisation
- **Fonctionnalités**:
  - Inscription et connexion des utilisateurs
  - Génération et validation des JWT
  - Gestion des rôles et permissions
  - Intégration avec Keycloak/Auth0
- **Base de données**: Collection MongoDB pour les utilisateurs et leurs rôles

### 3. User Service
- **Rôle**: Gestion des informations utilisateurs
- **Fonctionnalités**:
  - CRUD complet pour les profils utilisateurs
  - Gestion des préférences
  - Historique des achats
- **Base de données**: Collection MongoDB pour les profils utilisateurs

### 4. Event Service
- **Rôle**: Gestion des événements et des concerts
- **Fonctionnalités**:
  - CRUD complet pour les événements
  - Gestion des catégories d'événements
  - Gestion des lieux
  - Gestion des disponibilités (nombre de places)
- **Base de données**: Collections MongoDB pour les événements, lieux et catégories

### 5. Ticket Service
- **Rôle**: Gestion des billets et des réservations
- **Fonctionnalités**:
  - Réservation de billets
  - Génération de billets numérotés
  - Vérification de disponibilité
  - Annulation et remboursement
- **Base de données**: Collection MongoDB pour les billets
- **Communication**: Publie des événements sur RabbitMQ pour les notifications et les paiements

### 6. Payment Service
- **Rôle**: Gestion des paiements
- **Fonctionnalités**:
  - Traitement des paiements par carte bancaire
  - Gestion des remboursements
  - Historique des transactions
- **Base de données**: Collection MongoDB pour les transactions (avec backup régulier)
- **Communication**: Consomme des événements de RabbitMQ pour les demandes de paiement

### 7. Notification Service
- **Rôle**: Envoi de notifications aux utilisateurs
- **Fonctionnalités**:
  - Envoi d'emails de confirmation
  - Envoi de SMS (simulé)
  - Notifications pour les changements d'événements
- **Communication**: Consomme des événements de RabbitMQ pour les notifications à envoyer

## Communication entre microservices

### Communication synchrone (REST)
- Utilisée pour les opérations qui nécessitent une réponse immédiate
- Implémentée via des API REST avec NestJS
- Authentifiée via JWT

### Communication asynchrone (RabbitMQ)
- Utilisée pour les opérations qui peuvent être traitées de manière asynchrone
- Implémentée via RabbitMQ
- Types d'événements:
  - `ticket.created`: Déclenché lorsqu'un billet est créé
  - `payment.completed`: Déclenché lorsqu'un paiement est complété
  - `event.updated`: Déclenché lorsqu'un événement est mis à jour
  - `notification.send`: Déclenché lorsqu'une notification doit être envoyée

## Sécurité

### Authentification
- JWT pour l'authentification des utilisateurs
- Keycloak/Auth0 pour la gestion des identités

### Autorisation
- Basée sur les rôles: Admin, EventCreator/Operator, User
- Vérification des permissions au niveau de l'API Gateway et des microservices

### Sécurité des données
- Hachage des mots de passe avec bcrypt
- HTTPS pour toutes les communications
- Validation des entrées utilisateur

## Scalabilité

### Horizontale
- Chaque microservice peut être mis à l'échelle indépendamment
- Load balancing via l'API Gateway
- Stateless pour permettre la réplication

### Verticale
- Optimisation des ressources par microservice
- Monitoring pour identifier les goulots d'étranglement

## Résilience

### Circuit Breaker
- Implémentation de circuit breakers pour éviter la propagation des défaillances

### Retry Mechanism
- Mécanisme de réessai pour les opérations qui peuvent échouer temporairement

### Dead Letter Queue
- Utilisation de DLQ dans RabbitMQ pour gérer les messages qui ne peuvent pas être traités

## Monitoring et Logging

### Centralized Logging
- Agrégation des logs de tous les microservices

### Health Checks
- Endpoints de santé pour chaque microservice

### Metrics
- Collecte de métriques pour le monitoring des performances
