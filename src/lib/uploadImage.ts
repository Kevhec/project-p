import type { UrlDataType } from '@/types/general';

async function uploadImage(file: File, urlData: UrlDataType) {
  try {
    return await fetch(urlData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': urlData.contentType
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export default uploadImage;