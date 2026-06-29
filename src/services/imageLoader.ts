import { markRaw } from 'vue'
import type { ImageAsset } from '../types/collage'

const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'])

export async function loadImageAsset(file: File): Promise<ImageAsset | null> {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
    return null
  }

  try {
    const bitmap = await createImageBitmap(file)
    return {
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      width: bitmap.width,
      height: bitmap.height,
      url: URL.createObjectURL(file),
      bitmap: markRaw(bitmap),
    }
  } catch {
    return null
  }
}
