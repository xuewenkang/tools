import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { padNumber } from '../utils/file'
import { renderCollageToBlob } from './canvasRenderer'
import type { CollageSettings, ImageAsset } from '../types/collage'

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
