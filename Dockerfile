FROM node:20-alpine

# Ajout des dépendances nécessaires pour sharp
RUN apk add --no-cache \
    build-base \
    libc6-compat \
    vips-dev \
    cairo-dev \
    libjpeg-turbo-dev \
    pango-dev \
    giflib-dev

# Crée le dossier de l'application
WORKDIR /app

# Copie les fichiers package
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances (inclut les devDependencies pour le build)
RUN npm install --legacy-peer-deps

# Copie le reste des fichiers
COPY . .

# Compilation TypeScript
RUN npm run build

# Nettoyage des devDependencies pour alléger l'image finale
RUN npm prune --production

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
