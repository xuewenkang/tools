# AI ToolBox

专业级本地图片批处理工具。当前 MVP 已实现工具首页和批量拼图工具，所有图片处理都在浏览器本地完成。

## 产品与技术方案

1. 产品分析：以工具盒子作为入口，首个工具聚焦批量拼图，后续工具通过插件注册扩展。
2. 功能拆分：上传管理、自动分组、布局计算、图片参数、水印、实时预览、ZIP 导出。
3. 技术方案：Vue 3 + Vite + TypeScript + Pinia + Vue Router + Element Plus + Canvas API + JSZip + FileSaver。
4. 数据流：上传文件转换为 `ImageAsset`，Pinia 保存图片和参数，布局服务生成分页分组，Canvas 服务渲染预览与导出。
5. 状态管理：`useCollageStore` 管理图片列表、设置、分页和派生的生成数量。
6. Canvas 渲染：使用 `createImageBitmap` 解码，`drawImage` 绘制，`toBlob` 输出，按导出尺寸生成高清图片。
7. 组件拆分：首页、工具卡片、上传面板、参数面板、预览舞台分别独立。
8. 性能方案：图片解码和渲染逻辑抽离，预览只渲染当前页，导出逐页写入 ZIP，后续可接 Web Worker。
9. UI 结构：桌面端左侧参数栏、右侧实时预览；移动端上下布局。

## 运行

```bash
npm install
npm run dev
```

## 构建检查

```bash
npm run build
```
