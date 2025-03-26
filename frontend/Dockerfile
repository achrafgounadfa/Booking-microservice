FROM node:20-alpine AS base

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers du projet
COPY . .

# Construction de l'application Next.js
RUN npm run build

# Exposition du port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
