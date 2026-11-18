# 山医奶站

[![Deploy · Cloudflare Pages](https://github.com/axuanran/nailongsxmu/actions/workflows/deploy-cloudflare-pages.yml/badge.svg)](https://github.com/axuanran/nailongsxmu/actions/workflows/deploy-cloudflare-pages.yml)

给山西医科大学做的非官方「奶龙大学」小站：一对中文域名（`中国奶龙医科大学.com` / `山西奶蛙大学.com`）共用的落地页。

纯静态，零依赖、零构建，**把整个文件夹拖到 Cloudflare Pages 就能上线**；仓库里也带了 GitHub Actions，push 即部署。

> 页面、样式与文案由 DeepSeek 协助完成（页脚有标注）。

---

## 目录

```
nailongsxmu/
├─ index.html          主页：印章、GO、校区、奶力交卷、奶群
├─ terms.html          用户协议
├─ privacy.html        隐私政策
├─ 404.html            找不到页面
├─ robots.txt
├─ _headers            Cloudflare Pages 安全响应头（含 CSP）
├─ .github/workflows/
│  └─ deploy-cloudflare-pages.yml   push 到 main 自动部署
├─ assets/
│  ├─ styles.css       全站样式（含响应式、prefers-reduced-motion）
│  ├─ app.js           交互：奶群按钮 / 奶力交卷 / 盖章彩蛋
│  ├─ mark.svg         原创「奶」字印章（不是学校校徽）
│  └─ favicon.svg
└─ README.md
```

## 本地预览

直接双击 `index.html` 就能看。想更接近线上环境：

```powershell
# 在项目目录里
python -m http.server 8080
# 然后打开 http://localhost:8080
```

## 上线（Cloudflare Pages）

有两条路，任选一条。**手动上传**适合先看效果，**接 GitHub 自动部署**适合长期维护。

### 路线一：手动上传（5 分钟）

1. 登录 <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Upload assets**。
2. 项目名要写 `sxmu-nailong`（和 Action 里的 `--project-name` 对齐；想改名就两处一起改）。
3. 把**本文件夹里的全部文件**拖进去（根目录必须能直接看到 `index.html`，别多套一层）。
4. Deploy，拿到 `sxmu-nailong.pages.dev`，先用手机打开确认。
5. 项目 → **Custom domains** → 添加 `中国奶龙医科大学.com`，再添加 `山西奶蛙大学.com`。
6. 每个域名按提示去注册商改 DNS（或把域名接入 Cloudflare），证书会自动签发。

> 两个域名都建议加在**同一个 Pages 项目**上：两个门牌，一个奶站。

### 路线二：GitHub Actions 自动部署

仓库里已经带了 [`.github/workflows/deploy-cloudflare-pages.yml`](.github/workflows/deploy-cloudflare-pages.yml)：push 到 `main` 就部署，也能在 Actions 页面手动 Run。

1. **先建 Pages 项目**（`pages deploy` 不会替你创建）：
   - 面板：Workers & Pages → Create → Pages → **Create project**，名字 `sxmu-nailong`；
   - 或命令行：`npx wrangler pages project create sxmu-nailong --production-branch=main`。
2. **造一个 API Token**：Cloudflare 右上头像 → **My Profile → API Tokens → Create Token** → 自定义 token，权限给 **Account → Cloudflare Pages → Edit**，Account Resources 选你自己的账号。
3. **把两个值塞进 GitHub Secrets**（仓库 → Settings → Secrets and variables → Actions）：

   | Secret | 从哪来 |
   | --- | --- |
   | `CLOUDFLARE_API_TOKEN` | 上一步生成的 token |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 面板 URL 里的那串 hex，或 `wrangler whoami` 输出 |

   有 `gh` 的话也可以：

   ```powershell
   gh secret set CLOUDFLARE_API_TOKEN --repo axuanran/nailongsxmu
   gh secret set CLOUDFLARE_ACCOUNT_ID --repo axuanran/nailongsxmu
   ```

4. push 一次（或 Actions → Deploy · Cloudflare Pages → Run workflow），跑完在 `*.pages.dev` 验证。
5. 最后回 Pages 项目里绑两个中文域名（同路线一第 5、6 步）。

> 还没配 secrets 时，工作流会**跳过部署并留一条 notice**，不会红叉——所以先推代码、后配密钥也没关系。

**为什么不直接用 Cloudflare 的 Git 集成？** 也可以，而且更省事：Pages → Create → **Connect to Git** → 选仓库 → 构建命令留空、输出目录留 `/`。它不需要 token，PR 还能出预览。想要自定义构建步骤（压缩、加统计、多域名分支）时再用 Action。

## 两个域名怎么摆

页面里 `<link rel="canonical">` 指向 `中国奶龙医科大学.com`，所以搜索引擎只认它一个主站。

- **方案 A（推荐起步）**：同一个项目绑两个域名，两个都能进站。省事，也不会有「跳来跳去」的观感。
- **方案 B（主域名 + 备用域名 301）**：Cloudflare → **Rules → Redirect Rules**：
  - 条件：`hostname eq "xn--psszg58cp4a501kgld.com"`（这是 `山西奶蛙大学.com` 的 punycode）
  - 目标：`https://xn--fiq06jptdmvcili3hmr1fyf9c.com/$1`，状态码 301
- **方案 C**：建两个 Pages 项目，备用那个只放一个 `_redirects` 文件，一行 `/* https://xn--fiq06jptdmvcili3hmr1fyf9c.com/:splat 301`。

中文域名在后台显示成 `xn--…` 是正常现象（IDN / Punycode），不是乱码。

## 上线前要改的 3 个地方

1. **群号**：`assets/app.js` 顶部（已填好，换群时只改这里）

   ```js
   var CONFIG = {
     groupNumber: '1125198405',                              // 点「加入奶群」会复制这个号
     groupLink: 'https://qm.qq.com/q/k7RA7bpeTe'             // 填了就直接拉起加群页
   };
   ```

   两个都留空时，按钮会提示「群号还没填」，不会报错。
   群名与群号也写在了主页「奶群与门牌」里，换群时记得两处一起改。

2. **站点自称 / 文案**：`index.html` 里校区卡片、奶群卡片都可以按你的口味改；页脚那行「非官方 · 学生自建」**建议保留**（一句话就够，别到处重复）。

3. **页脚更新日期与版本**：搜 `v1.0.0`。

可选：

- **校徽**：现在用的是原创「奶」字印章。想换成学校校徽，请先确认使用权；学校标识一般不建议直接商用/冒用。
- **访问统计**：推荐 Cloudflare Web Analytics（无 Cookie、无需改页面）。若接入，必须同步更新 `privacy.html`，并放宽 `_headers` 里的 CSP（`script-src`、`connect-src` 加上统计域名）。
- **友链**：`index.html` 页脚，已放 NaiList、奶龙大学排行榜、奶龙教育网、奶龙社、学校官网。

## 这个版本已经处理好的

- 只在页脚留一行「非官方 · 学生自建」，详细声明收在最下面的协议/隐私页，正文不重复喊；
- 严格 CSP、`X-Frame-Options: DENY`、`nosniff`、`Referrer-Policy`，且**全站零第三方请求**（没有外部字体、CDN、统计脚本）；
- 不收集任何个人信息；「奶力」只写 `localStorage`（`sxmu-milk-v1`、`sxmu-milk-rounds-v1`），隐私页有对应说明；
- 移动端优先、键盘可访问（跳转链接、focus-visible、`aria-live` 状态播报）、`prefers-reduced-motion` 下自动关动画；
- 404 页、`robots.txt`、协议页 `noindex`。

## 上线后可以做的

- [ ] 在 [NaiList](https://nai.amoe.cc/) 更新/补充山医的收录（现在有两条：`中国奶龙医科大学.com`、`山西奶蛙大学.com`）；
- [ ] 去[奶力排行榜 · 山医页](https://naiwa.win/s/32) 给本校玩几局——目前还没人冲榜，第一局就是开张；站长讲过脚本刷分会作废，别用脚本；
- [ ] 排行榜上目前只收录了 `山西奶蛙大学.com` 一个域名，可以把 `中国奶龙医科大学.com` 一起提交收录；
- [ ] 把奶群 `1125198405` 提交到 NaiList 和排行榜的收录表里（排行榜现在没登记山医的群）；
- [ ] 跑通后把这个模板复制给别的学校（改文案和印章即可）。

## 常见坑

| 现象 | 原因 |
| --- | --- |
| 地址栏显示 `xn--…` | 中文域名的 Punycode 形式，正常 |
| 在 Cloudflare Registrar 买不了中文域名 | 其注册服务暂不支持 IDN，换注册商 |
| 自定义域名 522 | 先在 Pages 里加 Custom domain，再去配 DNS |
| 页面还是旧内容 | 改了文件要重新 Deploy；`/assets/*` 有 1 小时缓存 |
| 国内服务器访问要求 | 用国内主机才涉及 ICP 备案；Pages 走境外节点，不适用 |
| 别把学校官网 CNAME 到你的域名 | 对方证书不匹配，会直接报错 |

---

非官方学生项目，与山西医科大学及其附属机构无隶属关系。学校信息以 <https://www.sxmu.edu.cn/> 为准。
