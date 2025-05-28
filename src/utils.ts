import path from "path";
import fs from "fs";
import sharp from "sharp";
import { ConversionResult } from "./types.js";

/**
 * Vérifie si un fichier est une image supportée
 * @param file Chemin du fichier à vérifier
 * @returns true si le fichier est une image supportée, false sinon
 */
export function isImage(file: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"];
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * Convertit une image en format WebP
 * @param inputPath Chemin de l'image à convertir
 * @param quality Qualité de compression (1-100)
 * @returns Résultat de la conversion
 */
export async function convertToWebP(
  inputPath: string,
  quality: number = 80
): Promise<ConversionResult> {
  try {
    const outputPath =
      inputPath.substring(0, inputPath.lastIndexOf(".")) + ".webp";

    // Vérifier si le fichier WebP existe déjà
    if (fs.existsSync(outputPath)) {
      console.log(`Le fichier ${outputPath} existe déjà, conversion ignorée.`);
      return { success: true, path: outputPath, skipped: true };
    }

    await sharp(inputPath)
      .webp({ quality: parseInt(quality.toString()) })
      .toFile(outputPath);

    console.log(`Conversion réussie: ${inputPath} -> ${outputPath}`);
    return { success: true, path: outputPath };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Erreur lors de la conversion de ${inputPath}:`, error);
    return { success: false, error: errorMessage, path: inputPath };
  }
}
