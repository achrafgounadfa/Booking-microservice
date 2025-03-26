# Documentation API

Ce document détaille les API REST exposées par les différents microservices du système de billetterie.

## Vue d'ensemble

Notre système expose plusieurs API REST pour permettre l'interaction avec les différentes fonctionnalités. Chaque microservice expose sa propre API, mais toutes les requêtes passent par l'API Gateway qui se charge du routage, de l'authentification et de l'autorisation.

## Base URL

```
http://api-gateway:3000/api/v1
```

## Authentification

La plupart des endpoints nécessitent une authentification. Pour vous authentifier, vous devez inclure un token JWT dans l'en-tête `Authorization` de vos requêtes :

```
Authorization: Bearer <votre_token_jwt>
```

Vous pouvez obtenir un token JWT en vous connectant via l'endpoint `/auth/login`.

## Formats de réponse

Toutes les réponses sont au format JSON et suivent la structure suivante :

### Succès

```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

### Erreur

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur"
  }
}
```

## Endpoints

### Auth Service

#### Inscription

```
POST /auth/register
```

Crée un nouveau compte utilisateur.

**Corps de la requête :**

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123!",
  "role": "user"
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "role": "user"
  },
  "message": "Utilisateur créé avec succès"
}
```

#### Connexion

```
POST /auth/login
```

Authentifie un utilisateur et retourne un token JWT.

**Corps de la requête :**

```json
{
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com",
      "role": "user"
    }
  },
  "message": "Connexion réussie"
}
```

#### Rafraîchir le token

```
POST /auth/refresh-token
```

Génère un nouveau token JWT à partir d'un refresh token.

**Corps de la requête :**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token rafraîchi avec succès"
}
```

### User Service

#### Obtenir le profil utilisateur

```
GET /users/profile
```

Retourne le profil de l'utilisateur connecté.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "0612345678",
    "address": "123 Rue de Paris, 75001 Paris",
    "role": "user"
  },
  "message": "Profil récupéré avec succès"
}
```

#### Mettre à jour le profil utilisateur

```
PUT /users/profile
```

Met à jour le profil de l'utilisateur connecté.

**Corps de la requête :**

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0612345678",
  "address": "456 Avenue des Champs-Élysées, 75008 Paris"
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "0612345678",
    "address": "456 Avenue des Champs-Élysées, 75008 Paris",
    "role": "user"
  },
  "message": "Profil mis à jour avec succès"
}
```

#### Obtenir l'historique des achats

```
GET /users/purchase-history
```

Retourne l'historique des achats de l'utilisateur connecté.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "purchases": [
      {
        "id": "60d21b4667d0d8992e610c86",
        "eventId": "60d21b4667d0d8992e610c87",
        "eventTitle": "Coldplay - Music Of The Spheres World Tour",
        "ticketCount": 2,
        "totalAmount": 151.00,
        "purchaseDate": "2025-03-15T14:30:00.000Z",
        "status": "completed"
      },
      {
        "id": "60d21b4667d0d8992e610c88",
        "eventId": "60d21b4667d0d8992e610c89",
        "eventTitle": "Festival Solidays 2025",
        "ticketCount": 1,
        "totalAmount": 49.00,
        "purchaseDate": "2025-02-20T10:15:00.000Z",
        "status": "completed"
      }
    ]
  },
  "message": "Historique des achats récupéré avec succès"
}
```

### Event Service

#### Obtenir tous les événements

```
GET /events
```

Retourne la liste des événements disponibles.

**Paramètres de requête :**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'événements par page (défaut: 10)
- `category` (optionnel) : Filtrer par catégorie
- `search` (optionnel) : Rechercher par titre ou lieu
- `startDate` (optionnel) : Date de début (format: YYYY-MM-DD)
- `endDate` (optionnel) : Date de fin (format: YYYY-MM-DD)

**Réponse :**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "60d21b4667d0d8992e610c87",
        "title": "Coldplay - Music Of The Spheres World Tour",
        "description": "Coldplay revient en France pour leur tournée mondiale...",
        "category": "Concert",
        "date": "2025-06-15T20:00:00.000Z",
        "location": "Stade de France, Saint-Denis",
        "price": 75.50,
        "availableTickets": 1500,
        "image": "https://media.ticketmaster.com/tm/en-us/dam/a/1f6/0e4fe8ee-488a-46ba-9d2e-e42e47981f6.jpg"
      },
      {
        "id": "60d21b4667d0d8992e610c89",
        "title": "Festival Solidays 2025",
        "description": "Le festival Solidays revient pour sa 27ème édition...",
        "category": "Festival",
        "date": "2025-06-26T10:00:00.000Z",
        "location": "Hippodrome de Longchamp, Paris",
        "price": 49.00,
        "availableTickets": 5000,
        "image": "https://www.sortiraparis.com/images/80/66131/908390-solidays-2023-a-paris-dates-programmation-billetterie.jpg"
      }
    ],
    "pagination": {
      "totalEvents": 20,
      "totalPages": 2,
      "currentPage": 1,
      "limit": 10
    }
  },
  "message": "Événements récupérés avec succès"
}
```

#### Obtenir un événement par ID

```
GET /events/:id
```

Retourne les détails d'un événement spécifique.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "Coldplay - Music Of The Spheres World Tour",
    "description": "Coldplay revient en France pour leur tournée mondiale...",
    "category": "Concert",
    "date": "2025-06-15T20:00:00.000Z",
    "location": "Stade de France, Saint-Denis",
    "address": "93200 Saint-Denis",
    "price": 75.50,
    "availableTickets": 1500,
    "maxTicketsPerPerson": 8,
    "image": "https://media.ticketmaster.com/tm/en-us/dam/a/1f6/0e4fe8ee-488a-46ba-9d2e-e42e47981f6.jpg",
    "artist": {
      "name": "Coldplay",
      "description": "Coldplay est un groupe de rock britannique formé à Londres en 1996..."
    }
  },
  "message": "Événement récupéré avec succès"
}
```

#### Créer un événement (Admin/EventCreator uniquement)

```
POST /events
```

Crée un nouvel événement.

**Corps de la requête :**

```json
{
  "title": "Angèle - Nonante-Cinq Tour",
  "description": "Angèle revient avec sa tournée Nonante-Cinq...",
  "category": "Concert",
  "date": "2025-07-12T20:00:00.000Z",
  "location": "Accor Arena, Paris",
  "address": "8 Boulevard de Bercy, 75012 Paris",
  "price": 45.00,
  "totalTickets": 15000,
  "maxTicketsPerPerson": 6,
  "image": "https://www.gqmagazine.fr/uploads/images/thumbs/202201/28/angele_concert_paris_2022_6570.jpeg",
  "artist": {
    "name": "Angèle",
    "description": "Angèle Van Laeken, dite Angèle, est une auteure-compositrice-interprète belge..."
  }
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c90",
    "title": "Angèle - Nonante-Cinq Tour",
    "description": "Angèle revient avec sa tournée Nonante-Cinq...",
    "category": "Concert",
    "date": "2025-07-12T20:00:00.000Z",
    "location": "Accor Arena, Paris",
    "address": "8 Boulevard de Bercy, 75012 Paris",
    "price": 45.00,
    "availableTickets": 15000,
    "maxTicketsPerPerson": 6,
    "image": "https://www.gqmagazine.fr/uploads/images/thumbs/202201/28/angele_concert_paris_2022_6570.jpeg",
    "artist": {
      "name": "Angèle",
      "description": "Angèle Van Laeken, dite Angèle, est une auteure-compositrice-interprète belge..."
    }
  },
  "message": "Événement créé avec succès"
}
```

### Ticket Service

#### Vérifier la disponibilité des billets

```
GET /tickets/availability/:eventId
```

Vérifie la disponibilité des billets pour un événement.

**Paramètres de requête :**

- `quantity` (optionnel) : Nombre de billets souhaités (défaut: 1)

**Réponse :**

```json
{
  "success": true,
  "data": {
    "eventId": "60d21b4667d0d8992e610c87",
    "eventTitle": "Coldplay - Music Of The Spheres World Tour",
    "availableTickets": 1500,
    "requestedQuantity": 2,
    "isAvailable": true,
    "maxTicketsPerPerson": 8
  },
  "message": "Billets disponibles"
}
```

#### Réserver des billets

```
POST /tickets/reserve
```

Réserve temporairement des billets pour un événement.

**Corps de la requête :**

```json
{
  "eventId": "60d21b4667d0d8992e610c87",
  "quantity": 2
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "reservationId": "60d21b4667d0d8992e610c91",
    "eventId": "60d21b4667d0d8992e610c87",
    "eventTitle": "Coldplay - Music Of The Spheres World Tour",
    "quantity": 2,
    "unitPrice": 75.50,
    "serviceFee": 2.50,
    "totalAmount": 156.00,
    "expiresAt": "2025-03-26T12:10:00.000Z"
  },
  "message": "Billets réservés temporairement"
}
```

#### Obtenir les billets d'un utilisateur

```
GET /tickets/my-tickets
```

Retourne les billets de l'utilisateur connecté.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "60d21b4667d0d8992e610c92",
        "eventId": "60d21b4667d0d8992e610c87",
        "eventTitle": "Coldplay - Music Of The Spheres World Tour",
        "eventDate": "2025-06-15T20:00:00.000Z",
        "eventLocation": "Stade de France, Saint-Denis",
        "ticketNumber": "TIX-12345",
        "price": 75.50,
        "purchaseDate": "2025-03-15T14:30:00.000Z",
        "status": "valid"
      },
      {
        "id": "60d21b4667d0d8992e610c93",
        "eventId": "60d21b4667d0d8992e610c87",
        "eventTitle": "Coldplay - Music Of The Spheres World Tour",
        "eventDate": "2025-06-15T20:00:00.000Z",
        "eventLocation": "Stade de France, Saint-Denis",
        "ticketNumber": "TIX-12346",
        "price": 75.50,
        "purchaseDate": "2025-03-15T14:30:00.000Z",
        "status": "valid"
      }
    ]
  },
  "message": "Billets récupérés avec succès"
}
```

### Payment Service

#### Traiter un paiement

```
POST /payments/process
```

Traite un paiement pour une réservation de billets.

**Corps de la requête :**

```json
{
  "reservationId": "60d21b4667d0d8992e610c91",
  "paymentMethod": "card",
  "cardDetails": {
    "number": "4242424242424242",
    "expiryMonth": 12,
    "expiryYear": 25,
    "cvc": "123",
    "name": "Jean Dupont"
  }
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "paymentId": "60d21b4667d0d8992e610c94",
    "reservationId": "60d21b4667d0d8992e610c91",
    "amount": 156.00,
    "status": "completed",
    "transactionDate": "2025-03-26T11:45:00.000Z",
    "tickets": [
      {
        "id": "60d21b4667d0d8992e610c92",
        "ticketNumber": "TIX-12345"
      },
      {
        "id": "60d21b4667d0d8992e610c93",
        "ticketNumber": "TIX-12346"
      }
    ]
  },
  "message": "Paiement traité avec succès"
}
```

### Notification Service

#### Envoyer une notification de test (Admin uniquement)

```
POST /notifications/test
```

Envoie une notification de test.

**Corps de la requête :**

```json
{
  "email": "jean.dupont@example.com",
  "type": "test"
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "notificationId": "60d21b4667d0d8992e610c95",
    "recipient": "jean.dupont@example.com",
    "type": "test",
    "status": "sent",
    "sentAt": "2025-03-26T11:50:00.000Z"
  },
  "message": "Notification envoyée avec succès"
}
```

## Codes d'erreur

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Identifiants invalides |
| `AUTH_TOKEN_EXPIRED` | Token expiré |
| `AUTH_TOKEN_INVALID` | Token invalide |
| `AUTH_UNAUTHORIZED` | Non autorisé |
| `RESOURCE_NOT_FOUND` | Ressource non trouvée |
| `VALIDATION_ERROR` | Erreur de validation des données |
| `EVENT_SOLD_OUT` | Événement complet |
| `TICKET_RESERVATION_EXPIRED` | Réservation de billets expirée |
| `PAYMENT_FAILED` | Échec du paiement |
| `SERVER_ERROR` | Erreur serveur |

## Limites de taux

Pour éviter les abus, notre API impose des limites de taux :

- 100 requêtes par minute pour les endpoints publics
- 300 requêtes par minute pour les endpoints authentifiés
- 1000 requêtes par minute pour les endpoints admin

Si vous dépassez ces limites, vous recevrez une réponse avec le code d'état HTTP 429 (Too Many Requests).
