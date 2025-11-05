export interface UrlDataType {
  filename: string
  uploadUrls: {
    fullSize: string
    thumb: string
  }
  keys: {
    fullSize: string
    thumb: string
  }
  contentType: string
}

export interface ImageDataType {
  file: File
  name: string
  date: Date
}

export type UploadStateType = "pending" | "rejected" | "fulfilled"

export interface UploadFileData {
  trackIndex: number
  imageData: ImageDataType
  uploadMetaData: UrlDataType
}

export interface DocumentDataType {
  id: string
  monthId: string
  name: string
  urls: {
    fullSize: string,
    thumb: string
  }
  date: Date
}