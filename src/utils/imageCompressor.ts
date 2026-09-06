/**
 * Client-side Image Compression Utility
 * Resizes and compresses image files or base64 strings to ensure fast loading
 * and prevents Firestore documents from exceeding the 1MB (1,048,576 bytes) limit.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

export async function compressImage(
  input: File | string,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1400,
    quality = 0.72,
    maxSizeBytes = 250 * 1024, // 250 KB target max size
  } = options;

  // If string and already an SVG or external URL, return as is
  if (typeof input === 'string') {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return input;
    }
    if (input.startsWith('data:image/svg+xml')) {
      return input;
    }
  }

  // Convert File to data URL if needed
  let dataUrl: string;
  if (input instanceof File) {
    // If it's an SVG file, keep as SVG data URL
    if (input.type === 'image/svg+xml') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(input);
      });
    }

    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(input);
    });
  } else {
    dataUrl = input;
  }

  // Load into Image element
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(new Error('Failed to load image for compression: ' + err));
    image.src = dataUrl;
  });

  let { width, height } = img;
  if (width <= 0 || height <= 0) {
    return dataUrl;
  }

  // Calculate target dimensions
  let scale = 1;
  if (width > maxWidth || height > maxHeight) {
    const scaleW = maxWidth / width;
    const scaleH = maxHeight / height;
    scale = Math.min(scaleW, scaleH);
  }

  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return dataUrl;
  }

  // Fill white background in case of transparent PNG/WebP being saved as JPEG
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Try WebP first, fallback to JPEG
  let result = canvas.toDataURL('image/jpeg', quality);

  // If still exceeds max size, perform progressive reduction
  if (result.length > maxSizeBytes && scale > 0.4) {
    const secondCanvas = document.createElement('canvas');
    const secondW = Math.round(targetWidth * 0.75);
    const secondH = Math.round(targetHeight * 0.75);
    secondCanvas.width = secondW;
    secondCanvas.height = secondH;

    const secondCtx = secondCanvas.getContext('2d');
    if (secondCtx) {
      secondCtx.fillStyle = '#FFFFFF';
      secondCtx.fillRect(0, 0, secondW, secondH);
      secondCtx.imageSmoothingEnabled = true;
      secondCtx.imageSmoothingQuality = 'high';
      secondCtx.drawImage(canvas, 0, 0, secondW, secondH);
      result = secondCanvas.toDataURL('image/jpeg', 0.65);
    }
  }

  return result;
}

/**
 * Optimizes an AboutUsSettings object by ensuring all images (certificates & activities)
 * are compressed and safe for Firestore and LocalStorage limits.
 */
export async function sanitizeAboutSettingsImages(
  settings: Record<string, any>
): Promise<Record<string, any>> {
  const sanitized = { ...settings };

  // Compress doc1_image if base64 and > 100KB
  if (sanitized.doc1_image && typeof sanitized.doc1_image === 'string' && sanitized.doc1_image.startsWith('data:image/') && !sanitized.doc1_image.startsWith('data:image/svg+xml')) {
    if (sanitized.doc1_image.length > 80 * 1024) {
      try {
        sanitized.doc1_image = await compressImage(sanitized.doc1_image, {
          maxWidth: 900,
          maxHeight: 1280,
          quality: 0.70,
          maxSizeBytes: 180 * 1024,
        });
      } catch (err) {
        console.warn('Could not compress doc1_image:', err);
      }
    }
  }

  // Compress doc2_image if base64 and > 100KB
  if (sanitized.doc2_image && typeof sanitized.doc2_image === 'string' && sanitized.doc2_image.startsWith('data:image/') && !sanitized.doc2_image.startsWith('data:image/svg+xml')) {
    if (sanitized.doc2_image.length > 80 * 1024) {
      try {
        sanitized.doc2_image = await compressImage(sanitized.doc2_image, {
          maxWidth: 900,
          maxHeight: 1280,
          quality: 0.70,
          maxSizeBytes: 180 * 1024,
        });
      } catch (err) {
        console.warn('Could not compress doc2_image:', err);
      }
    }
  }

  // Compress activity images if base64 and > 100KB
  if (Array.isArray(sanitized.activity_images)) {
    sanitized.activity_images = await Promise.all(
      sanitized.activity_images.map(async (act: any) => {
        if (act && act.url && typeof act.url === 'string' && act.url.startsWith('data:image/') && !act.url.startsWith('data:image/svg+xml')) {
          if (act.url.length > 80 * 1024) {
            try {
              const compressedUrl = await compressImage(act.url, {
                maxWidth: 1000,
                maxHeight: 650,
                quality: 0.70,
                maxSizeBytes: 120 * 1024,
              });
              return { ...act, url: compressedUrl };
            } catch (err) {
              console.warn('Could not compress activity image:', err);
              return act;
            }
          }
        }
        return act;
      })
    );
  }

  return sanitized;
}
