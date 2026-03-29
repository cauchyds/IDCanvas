# 🪪 IDCanvas — 证件画布

将 ScanSnap 等扫描仪扫描的证件正反面照片（身份证、驾照等），以**原始尺寸**排版到 A4 或 Letter 纸张上，导出为 PDF 文件。

🔒 **所有数据处理均在浏览器本地完成，不会上传任何隐私信息。**

---

## ✨ 功能特点

- 📁 **拖拽上传** — 支持批量拖入或选择扫描图片
- 🔄 **自动配对** — 按上传顺序自动配对正反面（支持手动调整）
- 📄 **实时预览** — Canvas 渲染排版效果，所见即所得
- ⚙️ **灵活配置** — 纸张大小、排列方式、DPI、圆角、边距等均可调
- 🔲 **圆角处理** — 自动将直角扫描图裁剪为圆角（模拟真实证件）
- 📥 **PDF 导出** — 支持选择保存位置（Chrome）或直接下载
- 🔒 **隐私安全** — 纯前端处理，无后端服务器，数据不离开浏览器

## 📐 支持的证件

| 证件类型 | 尺寸 | 标准 |
|---------|------|------|
| 身份证 | 85.6 × 54.0 mm | ISO/IEC 7810 ID-1 |
| 驾照 | 85.6 × 54.0 mm | ISO/IEC 7810 ID-1 |

## 🛠 技术栈

- **Vite + React** — 前端框架
- **pdf-lib** — 客户端 PDF 生成
- **exifreader** — EXIF 元数据解析（自动检测 DPI）
- **Canvas API** — 圆角裁剪与排版预览
- **File System Access API** — 保存到本地指定位置（Chrome/Edge）

## 🚀 本地开发

```bash
# 安装 Node.js (https://nodejs.org)

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📦 部署

本项目通过 GitHub Actions 自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建并部署
3. 访问 `https://<你的用户名>.github.io/idcanvas/`

### 首次部署步骤

1. 在 GitHub 创建仓库 `idcanvas`
2. 进入仓库 **Settings → Pages → Build and deployment**
3. Source 选择 **GitHub Actions**
4. 推送代码，等待部署完成

## 🤝 协作开发

### 邀请协作者

1. 仓库页面 → **Settings → Collaborators → Add people**
2. 输入协作者的 GitHub 用户名
3. 对方接受邀请后即可推送代码

### 开发流程

```bash
# Clone 仓库
git clone https://github.com/<用户名>/idcanvas.git
cd idcanvas

# 安装依赖
npm install

# 开发
npm run dev

# 提交改动
git add .
git commit -m "描述你的改动"
git push
```

## 📋 使用说明

1. **上传图片** — 将扫描的证件图片拖入上传区，或点击选择文件
   - 按顺序上传：正面 → 反面 → 正面 → 反面...
2. **确认配对** — 检查正反面是否正确，可点击 ⇄ 交换
3. **调整设置** — 选择纸张大小、排列方式、是否启用圆角等
4. **导出 PDF** — 输入文件名，点击「保存 PDF」
   - Chrome/Edge：可选择保存位置
   - 其他浏览器：自动下载到默认下载文件夹

## 📄 License

MIT
