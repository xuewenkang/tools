import type { Component } from 'vue'

export type ToolStatus = 'ready' | 'soon'

export interface ToolManifest {
  id: string
  name: string
  subtitle: string
  description: string
  routeName?: string
  status: ToolStatus
  accent: string
  icon: Component
}
