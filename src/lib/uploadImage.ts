import type { UrlDataType } from '@/types/general';

interface Files {
  fullSize: File,
  thumb: File
}

async function uploadImage(files: Files, urlData: UrlDataType) {
  console.log({ urlData })
  try {
    return Promise.all([
      fetch(urlData.uploadUrls.fullSize, {
        method: 'PUT',
        body: files.fullSize,
        headers: {
          'Content-Type': urlData.contentType
        }
      }),
      fetch(urlData.uploadUrls.thumb, {
        method: 'PUT',
        body: files.thumb,
        headers: {
          'Content-Type': urlData.contentType
        }
      }),
    ])
  } catch (error) {
    console.error(error)
  }
}

export default uploadImage;