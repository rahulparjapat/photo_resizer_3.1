import { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

export type ImageProcessOptions = {
  width: number;
  height: number;
  maxKb: number;
  format: 'image/jpeg' | 'image/png';
};

export type ImageProcessResult = {
  blob: Blob;
  url: string;
  kb: number;
};

export function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

/**
 * Crops and compresses an image according to specified targets.
 * Runs on a canvas and executes a binary search / iterative reduction for target KB.
 */
export function processAndCompressImage(
  image: HTMLImageElement,
  completedCrop: { x: number; y: number; width: number; height: number },
  options: ImageProcessOptions
): Promise<ImageProcessResult> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to create canvas 2D context'));
      return;
    }

    // Set canvas dimensions to the target width/height
    canvas.width = options.width;
    canvas.height = options.height;

    // ReactCrop displays image resized to fit UI, so calculate scale relative to natural size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      options.width,
      options.height
    );

    if (options.format === 'image/png') {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            kb: parseFloat((blob.size / 1024).toFixed(2)),
          });
        } else {
          reject(new Error('PNG conversion failed'));
        }
      }, 'image/png');
      return;
    }

    // JPEG iterative compression loop
    let quality = 1.0;
    let iteration = 0;
    const maxIterations = 20;
    const targetBytes = options.maxKb * 1024;

    const attempt = () => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('JPEG conversion failed'));
            return;
          }

          if (blob.size <= targetBytes || iteration >= maxIterations || quality <= 0.1) {
            resolve({
              blob,
              url: URL.createObjectURL(blob),
              kb: parseFloat((blob.size / 1024).toFixed(2)),
            });
          } else {
            // Reduce quality more aggressively if we are far away
            let reduction = 0.05;
            if (blob.size > targetBytes * 2) reduction = 0.12;
            if (blob.size > targetBytes * 4) reduction = 0.25;

            quality -= reduction;
            iteration++;
            attempt();
          }
        },
        'image/jpeg',
        quality
      );
    };

    attempt();
  });
}
