import { AUTO_LAYOUTS } from '../constants/collage'
import type { CollageSettings, ImageAsset, LayoutPreset } from '../types/collage'

export function getImagesPerCollage(settings: CollageSettings): number {
  return settings.imagesPerCollage === 0 ? settings.customImagesPerCollage : settings.imagesPerCollage
}

export function getActiveLayout(settings: CollageSettings): LayoutPreset {
  if (settings.layoutMode === 'custom') {
    return { label: `${settings.rows} x ${settings.columns}`, rows: settings.rows, columns: settings.columns }
  }

  const count = getImagesPerCollage(settings)
  return AUTO_LAYOUTS[count]?.[0] ?? { label: `${settings.rows} x ${settings.columns}`, rows: settings.rows, columns: settings.columns }
}

export function splitIntoGroups(images: ImageAsset[], settings: CollageSettings): Array<Array<ImageAsset | null>> {
  const groupSize = getImagesPerCollage(settings)
  const groups: Array<Array<ImageAsset | null>> = []

  for (let index = 0; index < images.length; index += groupSize) {
    const group = images.slice(index, index + groupSize)
    if (group.length < groupSize) {
      if (settings.remainderMode === 'ignore') continue
      if (settings.remainderMode === 'repeat-last' && group.length > 0) {
        const last = group[group.length - 1]
        while (group.length < groupSize) group.push(last)
      }
    }
    groups.push([...group, ...Array(Math.max(0, groupSize - group.length)).fill(null)])
  }

  return groups
}
