import type { ToolManifest } from '../types/tool'

const registry = new Map<string, ToolManifest>()

export function registerTool(tool: ToolManifest): void {
  registry.set(tool.id, tool)
}

export function getTools(): ToolManifest[] {
  return Array.from(registry.values())
}
