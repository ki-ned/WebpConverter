# Image WebP Converter

Ce microservice permet de convertir automatiquement toutes les images d'un dossier et de ses sous-dossiers en format WebP.

## Fonctionnalités

- Conversion d'images (JPG, JPEG, PNG, GIF, BMP, TIFF) en format WebP
- Traitement récursif des sous-dossiers
- Contrôle de la qualité de compression
- Option pour supprimer les fichiers originaux après conversion
- API REST simple pour déclencher les conversions
- Développé en TypeScript pour une meilleure maintenabilité
- Utilise pnpm comme gestionnaire de paquets

## Prérequis

- Node.js (v18 ou supérieur)
- pnpm (v7 ou supérieur)

## Installation

1. Clonez ce dépôt ou téléchargez les fichiers
2. Installez les dépendances :

```bash
pnpm install
```

3. Compilez le projet TypeScript :

```bash
pnpm build
```

## Configuration

Vous pouvez configurer le service en modifiant le fichier `.env` :

```
# Configuration du serveur
PORT=3000

# Configuration par défaut pour la conversion
DEFAULT_QUALITY=80
DELETE_ORIGINAL=false
```

## Utilisation

### Démarrer le service

```bash
pnpm start
```

Pour le développement avec rechargement automatique :

```bash
pnpm dev
```

Le service sera accessible à l'adresse : http://localhost:3000

### API Endpoints

#### Convertir des images

```
POST /convert
```

Corps de la requête (JSON) :

```json
{
  "folderPath": "C:\\chemin\\vers\\dossier\\images",
  "quality": 80,
  "deleteOriginal": false
}
```

Paramètres :
- `folderPath` (obligatoire) : Chemin absolu vers le dossier contenant les images à convertir
- `quality` (optionnel) : Qualité de compression WebP (1-100, par défaut: 80)
- `deleteOriginal` (optionnel) : Supprimer les fichiers originaux après conversion (par défaut: false)

Réponse :

```json
{
  "success": true,
  "totalImages": 10,
  "converted": 8,
  "skipped": 1,
  "failed": 1,
  "results": [
    {
      "originalPath": "C:\\chemin\\vers\\image.jpg",
      "webpPath": "C:\\chemin\\vers\\image.webp",
      "success": true,
      "skipped": false
    },
    ...
  ]
}
```

#### Vérifier l'état du service

```
GET /health
```

Réponse :

```json
{
  "status": "ok"
}
```

### Utilisation en ligne de commande

```bash
pnpm convert -- [OPTIONS] CHEMIN_DOSSIER
```

Ou après installation globale :

```bash
pnpm install -g .
webp-converter [OPTIONS] CHEMIN_DOSSIER
```

Options :
- `-h, --help` : Afficher l'aide
- `-q, --quality QUALITÉ` : Définir la qualité de compression (1-100, par défaut: 80)
- `-d, --delete` : Supprimer les fichiers originaux après conversion

## Exemples d'utilisation

### Avec cURL

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d "{\"folderPath\":\"C:\\\\Users\\\\Photos\\\\",\"quality\":85}"
```

### Avec JavaScript (fetch)

```javascript
fetch('http://localhost:3000/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    folderPath: 'C:\\Users\\Photos\\',
    quality: 85,
    deleteOriginal: false
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));
```

### Avec cli

pnpm convert -- [OPTIONS] CHEMIN_DOSSIER
pnpm convert -- -q 85 -d "C:\Users\Photos"

## Développement

### Scripts disponibles

- `pnpm build` : Compile le projet TypeScript
- `pnpm start` : Démarre le serveur
- `pnpm dev` : Démarre le serveur en mode développement avec rechargement automatique
- `pnpm convert` : Exécute l'outil en ligne de commande
- `pnpm lint` : Vérifie le code avec ESLint

Avec npm :

- `npm run build` : Compile le projet TypeScript
- `npm run start` : Démarre le serveur
- `npm run dev` : Démarre le serveur en mode développement avec rechargement automatique
- `npm run convert` : Exécute l'outil en ligne de commande
- `npm run lint` : Vérifie le code avec ESLint

## 🐳 Utilisation avec Docker

### Construction de l'image

```bash
docker build -t webp-converter .
```

### Lancement du conteneur

```bash
docker run -d \
  -p 3000:3000 \
  -v C:\chemin\vers\images:/app/images \
  --name webp-converter \
  webp-converter
```

### Utilisation de l'API

L'API est accessible à l'adresse : http://localhost:3000

Utilisez les mêmes endpoints que décrits dans la section API ci-dessus.

### Utilisation en ligne de commande dans le conteneur

```bash
docker exec webp-converter pnpm convert -- "/app/images" -q 80
```

> ⚠️ Note : Dans le conteneur, utilisez des chemins Unix (avec des slashes /) et assurez-vous que le dossier est monté correctement avec l'option `-v`.

## Licence

ISC
