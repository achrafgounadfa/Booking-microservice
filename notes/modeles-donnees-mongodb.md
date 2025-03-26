# Modèles de Données MongoDB pour le Système de Billetterie

Ce document définit les schémas MongoDB pour chaque microservice de notre système de billetterie.

## Auth Service

### User Schema
```typescript
interface User {
  _id: ObjectId;
  email: string;          // Email unique de l'utilisateur
  password: string;       // Mot de passe hashé avec bcrypt
  role: 'admin' | 'event-creator' | 'user';  // Rôle de l'utilisateur
  isActive: boolean;      // Statut du compte
  lastLogin: Date;        // Dernière connexion
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

### RefreshToken Schema
```typescript
interface RefreshToken {
  _id: ObjectId;
  userId: ObjectId;       // Référence à l'utilisateur
  token: string;          // Token de rafraîchissement
  expiresAt: Date;        // Date d'expiration
  createdAt: Date;        // Date de création
}
```

## User Service

### UserProfile Schema
```typescript
interface UserProfile {
  _id: ObjectId;
  userId: ObjectId;       // Référence à l'utilisateur dans Auth Service
  firstName: string;      // Prénom
  lastName: string;       // Nom
  email: string;          // Email (dupliqué pour performance)
  phoneNumber: string;    // Numéro de téléphone
  language: 'fr' | 'en';  // Préférence de langue
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    eventTypes: string[]; // Types d'événements préférés
    notifications: {
      email: boolean;
      sms: boolean;
    }
  };
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

### PurchaseHistory Schema
```typescript
interface PurchaseHistory {
  _id: ObjectId;
  userId: ObjectId;       // Référence à l'utilisateur
  tickets: {
    ticketId: ObjectId;   // Référence au billet
    eventId: ObjectId;    // Référence à l'événement
    eventName: string;    // Nom de l'événement (dupliqué pour performance)
    purchaseDate: Date;   // Date d'achat
    price: number;        // Prix payé
    status: 'active' | 'used' | 'cancelled' | 'refunded';
  }[];
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

## Event Service

### Event Schema
```typescript
interface Event {
  _id: ObjectId;
  name: string;           // Nom de l'événement
  description: string;    // Description
  organizerId: ObjectId;  // Référence à l'organisateur (User)
  category: string;       // Catégorie (concert, théâtre, sport, etc.)
  images: {
    thumbnail: string;    // URL de l'image miniature
    banner: string;       // URL de l'image bannière
    gallery: string[];    // URLs des images de la galerie
  };
  location: {
    venueId: ObjectId;    // Référence au lieu
    venueName: string;    // Nom du lieu (dupliqué pour performance)
    address: string;      // Adresse complète
    city: string;         // Ville
    postalCode: string;   // Code postal
    country: string;      // Pays
    coordinates: {
      latitude: number;
      longitude: number;
    }
  };
  dates: {
    start: Date;          // Date et heure de début
    end: Date;            // Date et heure de fin
    doorsOpen: Date;      // Heure d'ouverture des portes
  };
  ticketTypes: {
    _id: ObjectId;
    name: string;         // Nom du type de billet (VIP, Standard, etc.)
    description: string;  // Description
    price: number;        // Prix
    quantity: number;     // Nombre total de billets disponibles
    remaining: number;    // Nombre de billets restants
  }[];
  status: 'draft' | 'published' | 'cancelled' | 'sold-out' | 'completed';
  tags: string[];         // Tags pour la recherche
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

### Venue Schema
```typescript
interface Venue {
  _id: ObjectId;
  name: string;           // Nom du lieu
  description: string;    // Description
  address: {
    street: string;       // Rue
    city: string;         // Ville
    postalCode: string;   // Code postal
    country: string;      // Pays
    coordinates: {
      latitude: number;
      longitude: number;
    }
  };
  capacity: number;       // Capacité totale
  amenities: string[];    // Équipements disponibles
  images: {
    main: string;         // Image principale
    gallery: string[];    // Galerie d'images
  };
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

### Category Schema
```typescript
interface Category {
  _id: ObjectId;
  name: string;           // Nom de la catégorie
  description: string;    // Description
  icon: string;           // Icône (URL ou nom de classe CSS)
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

## Ticket Service

### Ticket Schema
```typescript
interface Ticket {
  _id: ObjectId;
  ticketNumber: string;   // Numéro unique du billet
  eventId: ObjectId;      // Référence à l'événement
  eventName: string;      // Nom de l'événement (dupliqué pour performance)
  ticketTypeId: ObjectId; // Référence au type de billet
  ticketTypeName: string; // Nom du type de billet (dupliqué pour performance)
  userId: ObjectId;       // Référence à l'utilisateur
  userName: string;       // Nom de l'utilisateur (dupliqué pour performance)
  purchaseId: ObjectId;   // Référence à la transaction d'achat
  price: number;          // Prix payé
  status: 'reserved' | 'paid' | 'cancelled' | 'used' | 'refunded';
  qrCode: string;         // Code QR encodé (URL ou données)
  barcode: string;        // Code-barres
  seat: {
    section: string;      // Section
    row: string;          // Rangée
    number: string;       // Numéro de siège
  };
  validationHistory: {
    timestamp: Date;      // Horodatage
    action: string;       // Action effectuée
    operatorId: ObjectId; // Référence à l'opérateur
  }[];
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

### Reservation Schema
```typescript
interface Reservation {
  _id: ObjectId;
  userId: ObjectId;       // Référence à l'utilisateur
  eventId: ObjectId;      // Référence à l'événement
  tickets: {
    ticketTypeId: ObjectId; // Référence au type de billet
    quantity: number;     // Nombre de billets
    unitPrice: number;    // Prix unitaire
  }[];
  totalAmount: number;    // Montant total
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  expiresAt: Date;        // Date d'expiration de la réservation
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

## Payment Service

### Transaction Schema
```typescript
interface Transaction {
  _id: ObjectId;
  userId: ObjectId;       // Référence à l'utilisateur
  reservationId: ObjectId; // Référence à la réservation
  amount: number;         // Montant
  currency: string;       // Devise (EUR, USD, etc.)
  paymentMethod: {
    type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
    lastFour: string;     // Derniers 4 chiffres de la carte (si applicable)
    cardType: string;     // Type de carte (si applicable)
  };
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  paymentIntentId: string; // ID de l'intention de paiement (externe)
  refunds: {
    amount: number;       // Montant remboursé
    reason: string;       // Raison du remboursement
    timestamp: Date;      // Horodatage
  }[];
  metadata: Record<string, any>; // Métadonnées supplémentaires
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

### PaymentBackup Schema
```typescript
// Schéma identique à Transaction, mais dans une collection séparée pour les backups
interface PaymentBackup {
  // Mêmes champs que Transaction
  backupDate: Date;       // Date du backup
}
```

## Notification Service

### Notification Schema
```typescript
interface Notification {
  _id: ObjectId;
  userId: ObjectId;       // Référence à l'utilisateur
  type: 'email' | 'sms';  // Type de notification
  template: string;       // Template utilisé
  content: {
    subject: string;      // Sujet (pour email)
    body: string;         // Corps du message
  };
  metadata: {
    eventId?: ObjectId;   // Référence à l'événement (si applicable)
    ticketId?: ObjectId;  // Référence au billet (si applicable)
    paymentId?: ObjectId; // Référence au paiement (si applicable)
  };
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  sentAt: Date;           // Date d'envoi
  deliveredAt: Date;      // Date de livraison
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

### NotificationTemplate Schema
```typescript
interface NotificationTemplate {
  _id: ObjectId;
  name: string;           // Nom du template
  type: 'email' | 'sms';  // Type de notification
  subject: string;        // Sujet (pour email)
  body: string;           // Corps du message avec placeholders
  variables: string[];    // Liste des variables utilisées dans le template
  language: 'fr' | 'en';  // Langue du template
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de mise à jour
}
```

## Relations entre les modèles

1. **User** (Auth Service) → **UserProfile** (User Service)
   - Relation 1:1 via userId

2. **User** (Auth Service) → **Event** (Event Service)
   - Relation 1:N via organizerId (un utilisateur peut organiser plusieurs événements)

3. **Event** (Event Service) → **Venue** (Event Service)
   - Relation N:1 via venueId (plusieurs événements peuvent avoir lieu au même endroit)

4. **Event** (Event Service) → **Ticket** (Ticket Service)
   - Relation 1:N via eventId (un événement peut avoir plusieurs billets)

5. **User** (Auth Service) → **Ticket** (Ticket Service)
   - Relation 1:N via userId (un utilisateur peut avoir plusieurs billets)

6. **Ticket** (Ticket Service) → **Transaction** (Payment Service)
   - Relation N:1 via purchaseId (plusieurs billets peuvent être achetés dans une seule transaction)

7. **User** (Auth Service) → **Notification** (Notification Service)
   - Relation 1:N via userId (un utilisateur peut recevoir plusieurs notifications)

## Indexation

Pour optimiser les performances, les index suivants seront créés:

### Auth Service
- `User`: { email: 1 } (unique)
- `RefreshToken`: { userId: 1 }, { token: 1 } (unique)

### User Service
- `UserProfile`: { userId: 1 } (unique)
- `PurchaseHistory`: { userId: 1 }

### Event Service
- `Event`: { organizerId: 1 }, { category: 1 }, { "location.city": 1 }, { "dates.start": 1 }
- `Venue`: { "address.city": 1 }
- `Category`: { name: 1 } (unique)

### Ticket Service
- `Ticket`: { ticketNumber: 1 } (unique), { eventId: 1 }, { userId: 1 }, { status: 1 }
- `Reservation`: { userId: 1 }, { eventId: 1 }, { status: 1 }, { expiresAt: 1 }

### Payment Service
- `Transaction`: { userId: 1 }, { reservationId: 1 }, { status: 1 }, { createdAt: 1 }

### Notification Service
- `Notification`: { userId: 1 }, { status: 1 }, { type: 1 }
- `NotificationTemplate`: { name: 1, language: 1 } (unique)
