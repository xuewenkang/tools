import { getActiveLayout } from './layoutEngine'
import type { CollageSettings, FitMode, ImageAsset } from '../types/collage'

interface RenderOptions {
  images: Array<ImageAsset | null>
  settings: CollageSettings
  size: number
}

interface DrawRect {
  x: number
  y: number
  width: number
  height: number
}

export async function renderCollageToBlob({ images, settings, size }: RenderOptions): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available.')

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (!settings.transparent) {
    ctx.fillStyle = settings.background
    ctx.fillRect(0, 0, size, size)
  } else {
    ctx.clearRect(0, 0, size, size)
  }

  const layout = getActiveLayout(settings)
  const gap = settings.gap
  const cellWidth = (size - gap * (layout.columns + 1)) / layout.columns
  const cellHeight = (size - gap * (layout.rows + 1)) / layout.rows

  images.slice(0, layout.rows * layout.columns).forEach((image, index) => {
    const row = Math.floor(index / layout.columns)
    const column = index % layout.columns
    const rect = {
      x: gap + column * (cellWidth + gap),
      y: gap + row * (cellHeight + gap),
      width: cellWidth,
      height: cellHeight,
    }
    drawCell(ctx, image, rect, settings)
  })

  drawWatermark(ctx, settings, size)

  const type = `image/${settings.exportFormat}`
  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Export failed.'))), type, settings.exportQuality)
  })
}

function drawCell(ctx: CanvasRenderingContext2D, image: ImageAsset | null, rect: DrawRect, settings: CollageSettings): void {
  ctx.save()
  roundedRect(ctx, rect, settings.radius)
  ctx.clip()

  if (!image) {
    ctx.fillStyle = 'rgba(17, 24, 39, 0.04)'
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    ctx.restore()
    return
  }

  const target = getImageTargetRect(image.bitmap.width, image.bitmap.height, rect, settings.fitMode)
  ctx.drawImage(image.bitmap, target.sx, target.sy, target.sw, target.sh, target.dx, target.dy, target.dw, target.dh)
  ctx.restore()

  if (settings.border) {
    ctx.save()
    ctx.strokeStyle = 'rgba(17, 24, 39, 0.14)'
    ctx.lineWidth = 2
    roundedRect(ctx, rect, settings.radius)
    ctx.stroke()
    ctx.restore()
  }

  if (settings.shadow) {
    ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    ctx.shadowColor = 'rgba(17, 24, 39, 0.18)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 12
    roundedRect(ctx, rect, settings.radius)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'
    ctx.fill()
    ctx.restore()
  }
}

function getImageTargetRect(sourceWidth: number, sourceHeight: number, rect: DrawRect, mode: FitMode) {
  if (mode === 'stretch') {
    return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight, dx: rect.x, dy: rect.y, dw: rect.width, dh: rect.height }
  }

  const sourceRatio = sourceWidth / sourceHeight
  const rectRatio = rect.width / rect.height
  const useCover = mode === 'cover'

  if (mode === 'center') {
    const scale = Math.min(1, rect.width / sourceWidth, rect.height / sourceHeight)
    const dw = sourceWidth * scale
    const dh = sourceHeight * scale
    return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight, dx: rect.x + (rect.width - dw) / 2, dy: rect.y + (rect.height - dh) / 2, dw, dh }
  }

  const shouldCropWidth = useCover ? sourceRatio > rectRatio : sourceRatio < rectRatio
  if (shouldCropWidth) {
    const sw = useCover ? sourceHeight * rectRatio : sourceWidth
    const dw = useCover ? rect.width : rect.height * sourceRatio
    return { sx: (sourceWidth - sw) / 2, sy: 0, sw, sh: sourceHeight, dx: rect.x + (rect.width - dw) / 2, dy: rect.y, dw, dh: rect.height }
  }

  const sh = useCover ? sourceWidth / rectRatio : sourceHeight
  const dh = useCover ? rect.height : rect.width / sourceRatio
  return { sx: 0, sy: (sourceHeight - sh) / 2, sw: sourceWidth, sh, dx: rect.x, dy: rect.y + (rect.height - dh) / 2, dw: rect.width, dh }
}

function roundedRect(ctx: CanvasRenderingContext2D, rect: DrawRect, radius: number): void {
  const value = Math.min(radius, rect.width / 2, rect.height / 2)
  ctx.beginPath()
  ctx.moveTo(rect.x + value, rect.y)
  ctx.arcTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height, value)
  ctx.arcTo(rect.x + rect.width, rect.y + rect.height, rect.x, rect.y + rect.height, value)
  ctx.arcTo(rect.x, rect.y + rect.height, rect.x, rect.y, value)
  ctx.arcTo(rect.x, rect.y, rect.x + rect.width, rect.y, value)
  ctx.closePath()
}

function drawWatermark(ctx: CanvasRenderingContext2D, settings: CollageSettings, size: number): void {
  if (!settings.textWatermarkEnabled || !settings.watermarkText.trim()) return

  ctx.save()
  ctx.globalAlpha = settings.watermarkOpacity
  ctx.fillStyle = settings.watermarkColor
  ctx.font = `${settings.watermarkSize}px ${settings.watermarkFont}`
  ctx.textBaseline = 'middle'

  if (settings.watermarkPosition === 'tile') {
    for (let y = settings.watermarkSpacing / 2; y < size; y += settings.watermarkSpacing) {
      for (let x = settings.watermarkSpacing / 2; x < size; x += settings.watermarkSpacing) {
        drawTextAt(ctx, settings, x, y)
      }
    }
    ctx.restore()
    return
  }

  const margin = Math.max(32, settings.watermarkSize)
  const width = ctx.measureText(settings.watermarkText).width
  const positions = {
    'top-left': [margin, margin],
    'top-right': [size - margin - width, margin],
    'bottom-left': [margin, size - margin],
    'bottom-right': [size - margin - width, size - margin],
    center: [size / 2 - width / 2, size / 2],
  } as const
  const [x, y] = positions[settings.watermarkPosition]
  drawTextAt(ctx, settings, x, y)
  ctx.restore()
}

function drawTextAt(ctx: CanvasRenderingContext2D, settings: CollageSettings, x: number, y: number): void {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((settings.watermarkRotation * Math.PI) / 180)
  ctx.fillText(settings.watermarkText, 0, 0)
  ctx.restore()
}
