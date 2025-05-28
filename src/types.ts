// Types pour le projet de conversion d'images en WebP

// Type pour les résultats de conversion d'une image
export interface ConversionResult {
  success: boolean;
  path: string;
  skipped?: boolean;
  error?: string;
}

// Type pour les résultats de conversion d'une image avec des informations supplémentaires
export interface ConversionResultWithDetails extends ConversionResult {
  originalPath: string;
  webpPath: string;
}

// Type pour les options de conversion
export interface ConversionOptions {
  folderPath: string;
  quality?: number;
  deleteOriginal?: boolean;
}

// Type pour la réponse de l'API
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  totalImages?: number;
  converted?: number;
  skipped?: number;
  failed?: number;
  results?: ConversionResultWithDetails[];
}

// Type pour les options de ligne de commande
export interface CliOptions {
  folderPath: string | null;
  quality: number;
  deleteOriginal: boolean;
}
