import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { padNumber } from '../utils/file'
import { renderCollageToBlob } from './canvasRenderer'
import type { CollageSettings, ImageAsset } from '../types/collage'

/** 导出单张拼图图片 */
export async function exportCollageImage(
  images: Array<ImageAsset | null>,
  settings: CollageSettings,
  fileName?: string,
): Promise<void> {
  const extension = settings.exportFormat === 'jpeg' ? 'jpg' : settings.exportFormat
  const name = fileName ?? `collage.${extension}`
  const blob = await renderCollageToBlob({ images, settings, size: settings.exportSize })
  saveAs(blob, name)
}

/** 批量导出多张拼图图片（逐张下载） */
export async function exportCollageImages(
  groups: Array<Array<ImageAsset | null>>,
  settings: CollageSettings,
): Promise<void> {
  const extension = settings.exportFormat === 'jpeg' ? 'jpg' : settings.exportFormat

  for (const [index, group] of groups.entries()) {
    const blob = await renderCollageToBlob({ images: group, settings, size: settings.exportSize })
    saveAs(blob, `collage_${padNumber(index + 1)}.${extension}`)
  }
}

/** 导出为 ZIP 压缩包 */
export async function exportCollageZip(groups: Array<Array<ImageAsset | null>>, settings: CollageSettings): Promise<void> {
  const zip = new JSZip()
  const extension = settings.exportFormat === 'jpeg' ? 'jpg' : settings.exportFormat

  for (const [index, group] of groups.entries()) {
    const blob = await renderCollageToBlob({ images: group, settings, size: settings.exportSize })
    zip.file(`collage_${padNumber(index + 1)}.${extension}`, blob)
  }

  const archive = await zip.generateAsync({ type: 'blob' })
  saveAs(archive, 'batch-collage.zip')
}
