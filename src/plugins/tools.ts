import { Crop, EditPen, Files, MagicStick, Picture, Stamp } from '@element-plus/icons-vue'
import { registerTool } from './toolRegistry'

registerTool({
  id: 'batch-collage',
  name: '批量拼图',
  subtitle: 'Batch Collage Studio',
  description: '本地批量上传、自动分组、实时拼图预览与 ZIP 导出。',
  routeName: 'batch-collage',
  status: 'ready',
  accent: '#2775ff',
  icon: Picture,
})

registerTool({
  id: 'batch-watermark',
  name: '批量水印',
  subtitle: 'Watermark Lab',
  description: '批量添加文字、Logo 与平铺水印。',
  status: 'soon',
  accent: '#17a673',
  icon: Stamp,
})

registerTool({
  id: 'compressor',
  name: '图片压缩',
  subtitle: 'Image Compressor',
  description: '在浏览器本地压缩并保持画面清晰。',
  status: 'soon',
  accent: '#f06a3d',
  icon: Files,
})

registerTool({
  id: 'cropper',
  name: '批量裁剪',
  subtitle: 'Batch Crop',
  description: '统一比例、尺寸与安全边界的批量裁剪。',
  status: 'soon',
  accent: '#7c5cff',
  icon: Crop,
})

registerTool({
  id: 'ai-image',
  name: 'AI 图片工具',
  subtitle: 'AI Image Tools',
  description: '预留智能修图、抠图与自动排版能力。',
  status: 'soon',
  accent: '#d946ef',
  icon: MagicStick,
})

registerTool({
  id: 'ai-copy',
  name: 'AI 文案',
  subtitle: 'AI Copy Studio',
  description: '预留批量生成标题、描述与营销文案能力。',
  status: 'soon',
  accent: '#111827',
  icon: EditPen,
})
