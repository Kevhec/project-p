interface Options {
  quality?: number
  maxWidth?: number
  suffix?: string
}

function convertToWebp(file: File, options: Options = { quality: 0.8 }): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    const { maxWidth, quality, suffix } = options;

    img.onload = () => {
      URL.revokeObjectURL(url)

      const canvas = document.createElement('canvas');

      if (!maxWidth || img.width <= maxWidth) {
        canvas.width = img.width;
        canvas.height = img.height;
      } else {
        const factor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * factor;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, `_${suffix ? suffix : ''}.webp`),
              { type: 'image/webp' }
            );

            resolve(webpFile)
          } else {
            reject(new Error('File conversion failed'));
          }
        },
        'image/webp',
        quality
      )
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  })
}

export default convertToWebp;