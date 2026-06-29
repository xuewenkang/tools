export type FitMode = 'cover' | 'contain' | 'stretch' | 'center'
export type RemainderMode = 'blank' | 'repeat-last' | 'ignore'
export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'tile'
export type ExportFormat = 'png' | 'jpeg' | 'webp'
export type AspectRatioId = 'all' | '3:4' | '1:1' | '4:3' | '16:9' | '9:16'

export interface ImageAsset {
  id: string
  file: File
  name: string
  size: number
  width: number
  height: number
  url: string
  bitmap: ImageBitmap
}

export interface LayoutPreset {
  label: string
  rows: number
  columns: number
}

export interface AspectRatioPreset {
  id: AspectRatioId
  label: string
  width: number
  height: number
}

export interface CollageSettings {
  imagesPerCollage: number
  customImagesPerCollage: number
  aspectRatio: AspectRatioId
  layoutMode: 'auto' | 'custom'
  rows: number
  columns: number
  remainderMode: RemainderMode
  fitMode: FitMode
  gap: number
  radius: number
  background: string
  transparent: boolean
  shadow: boolean
  border: boolean
  textWatermarkEnabled: boolean
  watermarkText: string
  watermarkFont: string
  watermarkSize: number
  watermarkColor: string
  watermarkOpacity: number
  watermarkRotation: number
  watermarkSpacing: number
  watermarkPosition: WatermarkPosition
  exportFormat: ExportFormat
  exportQuality: number
  exportSize: number
}
