FROM node:20-alpine AS base

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers du projet
COPY . .

# Exposition du port
EXPOSE 3001

# Commande pour démarrer le service
CMD ["npm", "run", "start:prod"]
