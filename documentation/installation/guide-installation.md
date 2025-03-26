# Guide d'Installation et de Déploiement

Ce guide vous explique comment installer et déployer le système de billetterie pour concerts et événements.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :

- [Docker](https://docs.docker.com/get-docker/) (version 20.10.0 ou supérieure)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0.0 ou supérieure)
- [Git](https://git-scm.com/downloads) (pour cloner le dépôt)

Pour le développement local, vous aurez également besoin de :

- [Node.js](https://nodejs.org/) (version 20.x ou supérieure)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)

## Configuration de l'environnement

1. Clonez le dépôt Git :

```bash
git clone https://github.com/votre-organisation/projet-billetterie.git
cd projet-billetterie
```

2. Créez un fichier `.env` à la racine du projet en vous basant sur le fichier `.env.example` :

```bash
cp .env.example .env
```

3. Modifiez le fichier `.env` avec vos propres valeurs :

```
# MongoDB Atlas
MONGO_USER=votre_utilisateur
MONGO_PASSWORD=votre_mot_de_passe
MONGO_CLUSTER=cluster0.mongodb.net

# JWT (Authentification)
JWT_SECRET=votre_jwt_secret_tres_securise
REFRESH_TOKEN_SECRET=votre_refresh_token_secret_tres_securise

# RabbitMQ
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Email (pour les notifications)
EMAIL_USER=votre_email@example.com
EMAIL_PASSWORD=votre_mot_de_passe_email
```

## Configuration de MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un nouveau cluster (vous pouvez utiliser le tier gratuit pour commencer)
3. Créez un utilisateur de base de données avec les privilèges appropriés
4. Obtenez l'URI de connexion et mettez à jour les variables d'environnement dans le fichier `.env`
5. Configurez les règles de réseau pour autoriser les connexions depuis votre environnement

## Déploiement avec Docker Compose

Pour déployer l'ensemble du système en utilisant Docker Compose :

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Vérifier que tous les services sont en cours d'exécution
docker-compose ps
```

Le système sera accessible aux adresses suivantes :
- Frontend : http://localhost:80
- API Gateway : http://localhost:3000
- Interface d'administration RabbitMQ : http://localhost:15672 (utilisateur/mot de passe : guest/guest par défaut)

## Déploiement des services individuellement

Si vous souhaitez déployer les services individuellement :

### Backend (Microservices)

Pour chaque microservice (dans le dossier `backend/microservices/`) :

```bash
cd backend/microservices/[nom-du-service]

# Créer un fichier .env basé sur .env.example
cp .env.example .env

# Modifier le fichier .env avec vos propres valeurs

# Construire et démarrer le conteneur Docker
docker build -t billetterie-[nom-du-service] .
docker run -d -p [port]:[port] --env-file .env --name [nom-du-service] billetterie-[nom-du-service]
```

### Frontend

```bash
cd frontend

# Construire et démarrer le conteneur Docker
docker build -t billetterie-frontend .
docker run -d -p 80:3000 -e NEXT_PUBLIC_API_URL=http://localhost:3000 --name frontend billetterie-frontend
```

## Développement local

Pour le développement local sans Docker :

### Backend (Microservices)

Pour chaque microservice :

```bash
cd backend/microservices/[nom-du-service]

# Installer les dépendances
npm install

# Créer un fichier .env basé sur .env.example
cp .env.example .env

# Modifier le fichier .env avec vos propres valeurs

# Démarrer le service en mode développement
npm run start:dev
```

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible à l'adresse http://localhost:3000

## Vérification de l'installation

Pour vérifier que le système fonctionne correctement :

1. Accédez au frontend à l'adresse http://localhost:80
2. Créez un compte utilisateur
3. Connectez-vous avec vos identifiants
4. Naviguez dans l'application pour vérifier que toutes les fonctionnalités sont opérationnelles

## Dépannage

### Problèmes courants

1. **Les services ne démarrent pas** : Vérifiez les logs Docker avec `docker-compose logs [service]`
2. **Erreurs de connexion à MongoDB** : Vérifiez vos identifiants et les règles de réseau dans MongoDB Atlas
3. **Problèmes de communication entre services** : Vérifiez que RabbitMQ est en cours d'exécution et que les services sont correctement configurés

### Logs

Pour consulter les logs des services :

```bash
# Tous les services
docker-compose logs

# Un service spécifique
docker-compose logs [service]

# Suivre les logs en temps réel
docker-compose logs -f [service]
```

## Sauvegarde et restauration

### Sauvegarde de la base de données

MongoDB Atlas propose des sauvegardes automatiques. Vous pouvez également effectuer des sauvegardes manuelles :

1. Accédez à votre cluster dans MongoDB Atlas
2. Allez dans "Backup" > "Take Snapshot"
3. Suivez les instructions pour créer une sauvegarde

### Restauration de la base de données

Pour restaurer à partir d'une sauvegarde :

1. Accédez à votre cluster dans MongoDB Atlas
2. Allez dans "Backup" > "Restore"
3. Sélectionnez la sauvegarde à restaurer et suivez les instructions

## Mise à jour du système

Pour mettre à jour le système vers une nouvelle version :

```bash
# Arrêter les services
docker-compose down

# Récupérer les dernières modifications
git pull

# Reconstruire et redémarrer les services
docker-compose up -d --build
```
