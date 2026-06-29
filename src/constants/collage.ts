import type { AspectRatioPreset, CollageSettings, LayoutPreset } from '../types/collage'

export const IMAGE_COUNTS = [2, 3, 4, 6, 8, 9, 12, 16]

export const EXPORT_SIZES = [1080, 1440, 2160, 3000, 4000]

export const ASPECT_RATIOS: AspectRatioPreset[] = [
  { id: 'all', label: 'All', width: 1, height: 1 },
  { id: '3:4', label: '3:4', width: 3, height: 4 },
  { id: '1:1', label: '1:1', width: 1, height: 1 },
  { id: '4:3', label: '4:3', width: 4, height: 3 },
  { id: '16:9', label: '16:9', width: 16, height: 9 },
  { id: '9:16', label: 'FULL', width: 9, height: 16 },
]

export const DEFAULT_SETTINGS: CollageSettings = {
  imagesPerCollage: 4,
  customImagesPerCollage: 5,
  aspectRatio: '3:4',
  layoutMode: 'auto',
  rows: 2,
  columns: 2,
  remainderMode: 'blank',
  fitMode: 'cover',
  gap: 0,
  radius: 0,
  background: '#ffffff',
  transparent: false,
  shadow: false,
  border: false,
  textWatermarkEnabled: false,
  watermarkText: 'AI ToolBox',
  watermarkFont: 'Inter, Arial, sans-serif',
  watermarkSize: 36,
  watermarkColor: '#111827',
  watermarkOpacity: 0.35,
  watermarkRotation: -18,
  watermarkSpacing: 180,
  watermarkPosition: 'bottom-right',
  exportFormat: 'png',
  exportQuality: 0.95,
  exportSize: 1440,
}

export const AUTO_LAYOUTS: Record<number, LayoutPreset[]> = {
  2: [
    { label: '1 x 2', rows: 1, columns: 2 },
    { label: '2 x 1', rows: 2, columns: 1 },
  ],
  3: [{ label: '1 x 3', rows: 1, columns: 3 }],
  4: [{ label: '2 x 2', rows: 2, columns: 2 }],
  6: [
    { label: '2 x 3', rows: 2, columns: 3 },
    { label: '3 x 2', rows: 3, columns: 2 },
  ],
  8: [
    { label: '2 x 4', rows: 2, columns: 4 },
    { label: '4 x 2', rows: 4, columns: 2 },
  ],
  9: [{ label: '3 x 3', rows: 3, columns: 3 }],
  12: [
    { label: '3 x 4', rows: 3, columns: 4 },
    { label: '4 x 3', rows: 4, columns: 3 },
  ],
  16: [{ label: '4 x 4', rows: 4, columns: 4 }],
}
