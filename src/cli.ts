#!/usr/bin/env node

import path from "path";
import fs from "fs";
import recursiveReaddir from "recursive-readdir";
import dotenv from "dotenv";
import { convertToWebP, isImage } from "./utils.js";
import { CliOptions } from "./types.js";

// Charger les variables d'environnement
dotenv.config();

/**
 * Fonction principale pour convertir toutes les images d'un dossier
 * @param folderPath Chemin du dossier contenant les images
 * @param quality Qualité de compression (1-100)
 * @param deleteOriginal Supprimer les fichiers originaux après conversion
 */
async function convertImagesInFolder(
  folderPath: string,
  quality: number = 80,
  deleteOriginal: boolean = false
): Promise<void> {
  try {
    if (!fs.existsSync(folderPath)) {
      console.error(`Le dossier spécifié n'existe pas: ${folderPath}`);
      process.exit(1);
    }

    console.log(`Recherche d'images dans: ${folderPath}`);

    // Récupérer tous les fichiers du dossier et ses sous-dossiers
    const files = await recursiveReaddir(folderPath);

    // Filtrer pour ne garder que les images
    const imageFiles = files.filter(isImage);

    if (imageFiles.length === 0) {
      console.log("Aucune image trouvée dans le dossier spécifié");
      return;
    }

    console.log(
      `${imageFiles.length} images trouvées. Début de la conversion...`
    );

    // Convertir toutes les images en WebP
    let converted = 0;
    let skipped = 0;
    let failed = 0;

    for (const file of imageFiles) {
      const result = await convertToWebP(file, quality);

      if (result.success) {
        if (result.skipped) {
          skipped++;
        } else {
          converted++;

          // Supprimer l'original si demandé et si la conversion a réussi
          if (deleteOriginal) {
            try {
              fs.unlinkSync(file);
              console.log(`Fichier original supprimé: ${file}`);
            } catch (error) {
              console.error(`Erreur lors de la suppression de ${file}:`, error);
            }
          }
        }
      } else {
        failed++;
      }
    }

    console.log("\nRésumé de la conversion:");
    console.log(`Total d'images: ${imageFiles.length}`);
    console.log(`Converties: ${converted}`);
    console.log(`Ignorées (déjà existantes): ${skipped}`);
    console.log(`Échecs: ${failed}`);
  } catch (error) {
    console.error("Erreur lors de la conversion des images:", error);
    process.exit(1);
  }
}

/**
 * Traitement des arguments de ligne de commande
 * @returns Options de ligne de commande
 */
function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    folderPath: null,
    quality: parseInt(process.env.DEFAULT_QUALITY || "80"),
    deleteOriginal: process.env.DELETE_ORIGINAL === "true" || false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      showHelp();
      process.exit(0);
    } else if (arg === "--quality" || arg === "-q") {
      const qualityValue = parseInt(args[++i]);
      options.quality = isNaN(qualityValue) ? options.quality : qualityValue;
    } else if (arg === "--delete" || arg === "-d") {
      options.deleteOriginal = true;
    } else if (!options.folderPath) {
      options.folderPath = arg;
    }
  }

  if (!options.folderPath) {
    console.error("Erreur: Veuillez spécifier un chemin de dossier");
    showHelp();
    process.exit(1);
  }

  return options;
}

/**
 * Afficher l'aide
 */
function showHelp(): void {
  console.log(`
Utilisation: webp-converter [OPTIONS] CHEMIN_DOSSIER

Options:
  -h, --help              Afficher cette aide
  -q, --quality QUALITÉ   Définir la qualité de compression (1-100, par défaut: 80)
  -d, --delete            Supprimer les fichiers originaux après conversion

Exemple:
  webp-converter -q 85 -d "C:\Users\Photos"
`);
}

// Point d'entrée principal
if (require.main === module) {
  const options = parseArgs();
  console.log(`Démarrage de la conversion avec les options:`);
  console.log(`- Dossier: ${options.folderPath}`);
  console.log(`- Qualité: ${options.quality}`);
  console.log(
    `- Supprimer les originaux: ${options.deleteOriginal ? "Oui" : "Non"}`
  );
  console.log("\n");

  if (options.folderPath) {
    convertImagesInFolder(
      options.folderPath,
      options.quality,
      options.deleteOriginal
    );
  }
}

export { convertImagesInFolder };
