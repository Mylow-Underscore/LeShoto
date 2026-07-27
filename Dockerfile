# Image de base (Node LTS, légère)
FROM node:22-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copier uniquement les fichiers de dépendances d’abord (meilleur cache)
COPY package*.json ./

# Installer les dépendances (prod uniquement en production)
RUN npm ci --omit=dev
RUN npm i baseline-browser-mapping@latest -D

# Copier le reste du code
COPY . .

# Variable d'environnement
ENV PORT=3103

#création du dossier uploads
RUN npm run build

EXPOSE 3103

# Commande de démarrage
CMD ["npm", "run", "start"]