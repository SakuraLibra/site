# Songqi Zhao — 个人作品集（Dashboard 版）

React + Vite。仪表盘式首页 + 整屏页面切换 + 底部控制坞。字体 Fraunces（衬线）+ Hanken Grotesk，配色蓝 + 金，支持深色模式。无重型依赖。

## 运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

> Node 18+。声音用浏览器 Web Audio 合成（首次需点击后出声）。

## 结构与交互

- **首页 = Dashboard**：左侧 Fraunces 大标题 + CTA，右侧深色「横向琴键条」面板（每条 = 一个栏目，点击发声 + 跳转，背后是实时音频波形），底部一排数据卡。
- **底部控制坞（dock）**：栏目快捷键 + 分页 `0X / 06` + 上一页/下一页 + **自动轮播（▶/⏸，每 5 秒自动跳转）** + **深色模式**切换。
- **页面切换**：点栏目或翻页会整屏淡入切换到新页面（不是弹层）。
- **Playground**：之前的卡通风单独成一个 part（`pages/Studio.jsx` 里的 SVG 卡通插画），后续可往里加更多卡通/3D 内容。

## 目录

```
src/
├─ App.jsx                    # 外壳：视图状态 / dock / 明暗 / 自动轮播 / 切换动画
├─ index.css                  # 设计系统（:root 浅色 + .app.dark 深色；蓝金变量）
├─ lib/audio.js               # Web Audio 合成 + 分析器
├─ components/
│  ├─ KeyboardBars.jsx        # 首页横向琴键条（栏目 + 发声）
│  └─ WaveBackground.jsx      # 深色面板里的示波器波形
├─ data/content.js            # 文案 / 数据 / 项目 / 技能
└─ pages/                     # About / Projects / Skills / Contact / Studio(卡通)
```

## 常见改动

- **配色（蓝/金深浅）/ 字体 / 圆角 / 深色模式**：`src/index.css` 顶部 `:root` 与 `.app.dark`（`--blue`、`--gold`、`--ink`、`--cream`…）。
- **首页琴键条**：`components/KeyboardBars.jsx` 的 `BARS`（颜色、文字、音高、对应栏目）。
- **栏目顺序 / 分页 / 自动轮播间隔**：`App.jsx` 的 `VIEWS`、`setInterval(..., 5000)`。
- **卡通页**：`pages/Studio.jsx`。
- **文案 / 项目 / 技能**：`src/data/content.js`。

## 设计说明

- 字体：Fraunces（图 3 那种优雅高对比衬线）做标题，Hanken Grotesk 做正文/UI。
- 配色：蓝（`#3568e0` / 深蓝 `#1c3f96`）+ 金（`#e6a52c`），浅色奶油底 / 深色海军底，参考图 1、图 2 的仪表盘与控制坞语言。
- 借用元素：图 1 的横向琴键条与分栏、图 2 的底部控制坞 + 分页 + 深色切换、图 3 的衬线字体。

## 本次更新

- **波形居中**：示波器每帧去除均值偏移，固定在面板竖直中线（`components/WaveBackground.jsx`）。
- **黑键排布**：1 个在 About/Work 之间，2 个在 Skills→Playground 之间（`components/KeyboardBars.jsx` 的 `BLACKS`）。
- **站内邮件表单**：Contact 页内嵌表单，提交不跳转。**需要先填后端地址**：打开 `src/pages/Contact.jsx`，把 `FORM_ENDPOINT` 设成你的表单服务地址（最简单：到 https://formspree.io 免费建一个，粘贴 `https://formspree.io/f/xxxx`）。未填时点击会提示。
- **背景音乐**：点左上角的音乐徽标即可播放/暂停 `public/bgm.mp3`（由 副歌.wav 转码而来），并接入分析器——波形会随歌曲起伏。换歌只需替换 `public/bgm.mp3`。

## 本次更新 (2)

- 首页右侧大图换成图一抠图（透明 PNG，`public/hero-art.png`），位置/大小在 `index.css` 的 `.hero-art`。
- 背景波形改为淡蓝 + 白交映（`components/WaveBackground.jsx`）。
- Contact 的 Details 只保留 Email / LinkedIn（去掉 Phone、Location）。
- Playground 预留了小游戏区域：把游戏挂到 `pages/Studio.jsx` 的 `<div className="game-mount">` 里即可。
- 底部导航栏新增背景音乐播放键，与左上角徽标同步控制同一首歌。

## 本次更新 (3)

- 首页立绘缩小，hero 改成「文字 / 图片」两栏布局，图片不再遮挡文字（`.dash-hero` / `.hero-art`）。
- 网页 logo（浏览器标签图标）换成首页小人头像 `public/favicon.png`；左上角音乐徽标不变。
- Contact 页去掉 Details，改成「渠道图标行 + Send a message 卡片」样式（沿用蓝/金/奶油主题）；渠道含 Email、LinkedIn、小红书、B 站、QQ 音乐、网易云。**各平台链接请到 `data/content.js` 的 `social` 里填**。
- About 页改成分栏：左侧个人简介，右侧 The Specs + Tech Stack；去掉了联系方式方框。内容在 `data/content.js`（`aboutIntro` / `specs` / `techStack`）。
- 背景音乐换成 `副歌26_6_17修改.wav`（转码为 `public/bgm.mp3`）。

## 本次更新 (4) — dashboard 外壳大改

- 整体改成「**左侧图标导航栏 + 浮在渐变背景上的圆角面板**」(参考图一):左侧细长侧栏含 logo(=音乐开关)、6 个分区图标、底部深色模式切换;主区顶部有标题 + 头像账户条;内容放在白色大圆角面板里。
- 背景换成柔和**渐变 + 彩色光斑**(珊瑚 / 绿 / 暖金),深色模式自动减弱。
- 移除了原来的底部 dock(导航已并入侧栏);音乐仍由侧栏顶部 logo 控制,深色切换在侧栏底部。
- About 页改成**宣言式排版**(参考图二):名字 + 角色 + 大标题「Sound should feel alive.」+ 地点/时区,下面是之前的音乐简介与数据;不再保留画像位置。

## 本次更新 (5)

- About 页改成**手帐 / 笔记本风格**(格纹纸 + 手写体,仅限 About 页):名字用手写体(Gochi Hand)、点睛词用 Caveat 手写体、红墨水点缀;数据做成手写小标签。
- 首页移除了数据卡(230K+ 等)。
- 网页图标(favicon)换成 🌸(`public/favicon.svg`)。
- 侧边栏改为**可伸缩**:默认细窄只显示图标,鼠标移到左侧边缘即展开显示文字标签;边缘更圆润(30px 圆角 + 柔和阴影/高光,更有质感)。恢复了**音乐播放/暂停键**(在侧栏底部,播放时高亮金色),深色切换也在底部。

## 本次更新 (6)

- 功能性标题（顶部板块标题）移到左上角。
- 底层大白框改为高透明度毛玻璃（半透明 + backdrop-blur），各页通用。
- 侧栏花朵图标去掉蓝色背景方块。
- 侧栏改为「边缘隐藏」：平时收在屏幕左缘（留一条细提示条），鼠标移到左缘即滑出完整图标栏。

## 本次更新 (7)

- 导航栏移回**顶部**（横向导航条：花朵 logo + Home/About/Work/Skills/Contact/Playground + 音乐/深色按钮）。
- 各页主标题（page-head）改为**左对齐、置于左上角**，内容整体靠左排版。
- Contact 渠道第一个改为 **GitHub**，所有渠道图标形状改为**方圆形**（圆角方块）。GitHub 链接请在 `data/content.js` 的 `social.github` 填。
- Playground 预留区收小，**整页适配在一屏内**（去掉重复标题，预留框自适应填满剩余高度）。
- Skills 增加第 5 项 **Experience**。
- 整体尺度缩小（正文 16px、标题/内边距相应减小）。

## 本次更新 (8)
- 首页 dashboard 取消最大宽度限制，铺满整个面板（宽屏不再右侧留白）。
- 顶部导航链接居中分布，填补中间空白。
- 正文进一步缩小（15px），首页大标题、各页主标题、About 宣言标题字号同步缩小。

## 本次更新 (9)
- 各内容模块（About / Skills / Contact / Work 等）改回水平居中（两侧留白均衡），主标题仍位于模块左上角。首页 dashboard 维持铺满。

## 本次更新 (10)
- Experience 改为**独立模块/页面**，采用时间线（Timeline）卡片 UI（日期 + 标题 + 机构 + 描述 + 标签），并从 Skills 移出。
- 首页 dashboard **隐藏顶部导航栏**（用键盘条导航）；进入其他页面才显示导航栏（含新增的 Experience）。
- 内容页改为更明显的**居中窄列**（列宽收窄、左右等距）。
- 全站字号与布局再缩小约两档。
