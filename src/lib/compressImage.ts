import imageCompression from 'browser-image-compression'

async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,
    useWebWorker: true,
  }

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.log(error);
  }
}

export default compressImage;