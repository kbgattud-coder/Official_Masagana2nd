/**
 * Utility functions for image compression and client-side storage management
 */

export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Invalid image result'));
        return;
      }

      // If svg or gif, avoid canvas rasterization to keep vector/animation
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(reader.result);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw base64 if canvas context unavailable
          resolve(reader.result as string);
          return;
        }

        // Draw image smoothed
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with given compression quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getLocalStorageUsage(): {
  usedBytes: number;
  estimatedQuotaBytes: number;
  percentUsed: number;
  formattedUsed: string;
  formattedQuota: string;
  isHighUsage: boolean;
} {
  let totalBytes = 0;
  try {
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalBytes += (localStorage[key]?.length || 0) * 2; // UTF-16 characters = 2 bytes each
      }
    }
  } catch {
    // ignore
  }

  // Standard web browser localStorage quota is ~5MB
  const estimatedQuotaBytes = 5 * 1024 * 1024; // 5MB baseline
  const percentUsed = Math.min(100, Math.round((totalBytes / estimatedQuotaBytes) * 100));

  return {
    usedBytes: totalBytes,
    estimatedQuotaBytes,
    percentUsed,
    formattedUsed: formatBytes(totalBytes),
    formattedQuota: formatBytes(estimatedQuotaBytes),
    isHighUsage: percentUsed > 70,
  };
}

