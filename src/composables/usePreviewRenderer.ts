import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { renderCollageToBlob } from '../services/canvasRenderer'
import type { CollageSettings, ImageAsset } from '../types/collage'

export function usePreviewRenderer(group: () => Array<ImageAsset | null>, settings: () => CollageSettings) {
  const previewUrl = ref('')
  const isRendering = ref(false)
  const size = computed(() => Math.min(settings().exportSize, 1440))

  watch(
    [group, settings],
    async () => {
      if (group().length === 0) {
        revokePreview()
        return
      }

      isRendering.value = true
      const blob = await renderCollageToBlob({ images: group(), settings: settings(), size: size.value })
      revokePreview()
      previewUrl.value = URL.createObjectURL(blob)
      isRendering.value = false
    },
    { deep: true, immediate: true },
  )

  function revokePreview(): void {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }

  onBeforeUnmount(revokePreview)

  return { previewUrl, isRendering }
}
