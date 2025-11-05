import convertToWebp from '@/lib/convertToWebp'
import { uploadImagesMetadata } from "@/lib/databaseOperations"
import uploadImage from "@/lib/uploadImage"
import type {
  ImageDataType,
  UploadFileData,
  UploadStateType,
  UrlDataType,
} from "@/types/general"
import { format } from "date-fns"
import { useCallback, useState } from "react"

function useUploadImages() {
  const [uploadState, setUploadState] = useState<
    Record<number, UploadStateType>
  >({})
  const [loading, setLoading] = useState(false)

  const handleImagePipeline = useCallback(
    async (
      { file, name, date }: ImageDataType,
      uploadMetaData: UrlDataType,
      trackIndex: number
    ) => {
      try {
        // Compress the file to a maximum of 1MB
        const fullSize = await convertToWebp(file);
        const thumb = await convertToWebp(file, { maxWidth: 100, suffix: 'thumb' });

        console.log(fullSize)
        console.log(thumb)

        // Upload to storage
        await uploadImage(
          {
            fullSize,
            thumb,
          },
          uploadMetaData
        )

        // Save metadata on database
        const monthId = format(date, "MMyyyy")
        const urls = {
          fullSize: `${import.meta.env.VITE_CDN_URL}${
            uploadMetaData.keys.fullSize
          }`,
          thumb: `${import.meta.env.VITE_CDN_URL}${uploadMetaData.keys.thumb}`,
        }
        await uploadImagesMetadata(monthId, { name, date, urls })

        setUploadState((prev) => ({ ...prev, [trackIndex]: "fulfilled" }))
      } catch (error) {
        setUploadState((prev) => ({ ...prev, [trackIndex]: "rejected" }))
        if (error instanceof Error) {
          throw new Error(`Error on image pipeline: ${error.message}`)
        } else {
          throw new Error(`Error on image pipeline: ${String(error)}`)
        }
      }
    },
    []
  )

  const uploadImages = useCallback(
    async (files: UploadFileData[]) => {
      setLoading(true)
      setUploadState({})
      try {
        const pipelines = files.map(
          ({ imageData, uploadMetaData, trackIndex }) => {
            setUploadState((prev) => ({ ...prev, [trackIndex]: "pending" }))

            return handleImagePipeline(imageData, uploadMetaData, trackIndex)
          }
        )

        return await Promise.allSettled(pipelines)
      } catch (error) {
        console.error(error)
        throw new Error("Error uploading images")
      } finally {
        setLoading(false)
      }
    },
    [handleImagePipeline]
  )

  const clearUploadState = () => {
    setUploadState({})
  }

  return {
    uploadImages,
    clearUploadState,
    uploadState,
    loading,
  }
}

export default useUploadImages
