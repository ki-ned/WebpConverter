import express, { Request, Response } from "express";
// import path from "path";
import fs from "fs";
import recursiveReaddir from "recursive-readdir";
import dotenv from "dotenv";
import { ApiResponse, ConversionOptions, ConversionResultWithDetails } from "./src/types.js";
import { convertToWebP, isImage } from "./src/utils.js";



// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route pour convertir toutes les images d'un dossier et ses sous-dossiers
app.post("/convert", async (req: Request, res: Response) => {
  try {
    const {
      folderPath,
      quality = 80,
      deleteOriginal = false,
    } = req.body as ConversionOptions;

    if (!folderPath) {
      return res.status(400).json({
        success: false,
        error: "Le chemin du dossier est requis",
      } as ApiResponse);
    }

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({
        success: false,
        error: "Le dossier spécifié n'existe pas",
      } as ApiResponse);
    }

    // Récupérer tous les fichiers du dossier et ses sous-dossiers
    const files = await recursiveReaddir(folderPath);

    // Filtrer pour ne garder que les images
    const imageFiles = files.filter(isImage);

    if (imageFiles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucune image trouvée dans le dossier spécifié",
      } as ApiResponse);
    }

    // Convertir toutes les images en WebP
    const conversionResults: ConversionResultWithDetails[] = [];
    for (const file of imageFiles) {
      const result = await convertToWebP(file, quality);
      conversionResults.push({
        originalPath: file,
        webpPath: result.path,
        success: result.success,
        skipped: result.skipped || false,
        error: result.error,
        path: result.path,
      });

      // Supprimer l'original si demandé et si la conversion a réussi
      if (deleteOriginal && result.success && !result.skipped) {
        try {
          fs.unlinkSync(file);
          console.log(`Fichier original supprimé: ${file}`);
        } catch (error) {
          console.error(`Erreur lors de la suppression de ${file}:`, error);
        }
      }
    }

    const successCount = conversionResults.filter((r) => r.success).length;
    const skippedCount = conversionResults.filter((r) => r.skipped).length;
    const errorCount = conversionResults.filter((r) => !r.success).length;

    res.json({
      success: true,
      totalImages: imageFiles.length,
      converted: successCount - skippedCount,
      skipped: skippedCount,
      failed: errorCount,
      results: conversionResults,
    } as ApiResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors de la conversion des images:", error);
    res.status(500).json({
      success: false,
      error: errorMessage,
    } as ApiResponse);
  }
});

// Route pour vérifier l'état du service
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Accédez à l'API via http://localhost:${PORT}`);
});
