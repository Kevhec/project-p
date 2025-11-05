import type { UrlDataType } from '@/types/general';

interface Params {
  name: string
  type: string
}

async function getUrls(files: Params[]) {
  try {
    console.log(files)
    const response = await fetch(import.meta.env.VITE_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: files.map(file => ({
          filename: file.name,
          contentType: file.type
        }))
      })
    });

    const { urls } = await response.json()

    return urls as UrlDataType[] ;
  } catch (error) {
    console.error(error)
  }
}

export default getUrls