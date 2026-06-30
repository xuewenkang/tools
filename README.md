# 工具集合 - uni-app x 微信小程序版

当前分支：`uniappx-wechat-miniapp`

这是从原 Vue/Vite Web 拼图工具迁移来的微信小程序版本。当前包含工具集合首页和批量拼图工具页，底部 tabBar 提供「工具 / 拼图」两个入口，并带有图标。拼图功能保持一致：批量选图、自动/自定义宫格、画布比例、图片填充方式、间距、圆角、边框、背景色、文字水印、分页预览、保存当前和批量保存。

## 标准结构

```text
src/
  App.uvue                 # uni-app x 应用入口
  main.uts                 # createSSRApp 入口
  manifest.json            # 小程序应用配置、权限配置
  pages.json               # 页面路由、导航栏、底部 tabBar 配置
  uni.scss                 # 全局主题变量
  pages/
    index/
      index.uvue           # 工具集合首页
    studio/
      index.uvue           # 批量拼图工作台，配置从底部抽屉弹出
  static/
    tabbar/                # 底部导航图标
```

原 Web 项目的 `src/components`、`src/services`、`src/stores` 等目录暂时保留为迁移参考。当前小程序构建入口走 `src/App.uvue`、`src/main.uts`、`src/pages/index/index.uvue`、`src/pages/studio/index.uvue`。

## 架构变化

1. 原来的 `File / Blob / createImageBitmap / DOM canvas / file-saver / JSZip` 已替换为小程序 API。
2. 图片选择使用 `uni.chooseImage`，图片尺寸读取使用 `uni.getImageInfo`。
3. 预览与导出使用页面内 `canvas`、`uni.createCanvasContext`、`uni.canvasToTempFilePath`。
4. 导出行为改为 `uni.saveImageToPhotosAlbum` 保存到相册。
5. 微信小程序不适合浏览器式 ZIP 下载，所以批量导出改为逐张保存到相册。
6. 拼图主界面聚焦预览和关键操作，布局、样式、水印、导出配置从底部抽屉弹出。
7. 小程序 canvas 预览使用 `getImageInfo` 返回的规范图片路径，并采用裁切区域 + 5 参数 `drawImage`，避免本地临时图片在旧 canvas 9 参数绘制时出现空白。

## 运行

```bash
npm install
npm run dev:mp-weixin
```

然后用微信开发者工具导入：

```text
dist/dev/mp-weixin
```

## 构建

```bash
npm run build:mp-weixin
```

构建产物：

```text
dist/build/mp-weixin
```

## 注意

- `src/manifest.json` 中的 `mp-weixin.appid` 需要替换为你的微信小程序 AppID。
- 保存图片需要用户授权相册权限。
- 建议使用较新的微信开发者工具和微信基础库运行。
