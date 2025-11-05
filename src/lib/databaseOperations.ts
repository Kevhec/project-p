import { db } from '@/config/firebase'
import type { DocumentDataType } from '@/types/general';
import { doc, collection, addDoc, Timestamp, getDocs  } from 'firebase/firestore'

async function uploadImagesMetadata(monthId: string, imageData: Omit<DocumentDataType, 'id' | 'monthId'>) {
  try {
    const monthReference = doc(db, 'images', monthId);
    const itemsReference = collection(db, monthReference.path, 'items')

    return await addDoc(itemsReference, {
      name: imageData.name,
      urls: {
        fullSize: imageData.urls.fullSize,
        thumb: imageData.urls.thumb
      },
      date: Timestamp.fromDate(imageData.date)
    })
  } catch {
    throw new Error('Error while uploading image metadata')
  }
}

async function queryMonth(monthId: string) {
  try {
    const monthReference = doc(db, 'images', monthId);
    const itemsReference = collection(db, monthReference.path, 'items')

    const querySnap = await getDocs(itemsReference)

    if (querySnap.size < 0) return []

    const docsData = querySnap.docs.map((docSnap) => {
      const data = docSnap.data()

      return { ...data, monthId, id: docSnap.id, date: data.date.toDate() } as DocumentDataType;
    })

    return docsData
  } catch {
    throw new Error(`Error getting data for ${monthId}`)
  }
}

export {
  uploadImagesMetadata,
  queryMonth
}
