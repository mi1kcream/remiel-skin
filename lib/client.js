/**
 * dsh-remiel-skin — browser half.
 *
 * Injects the Remielle theme stylesheet and stamps `data-dsh-remiel` on <body>
 * so every rule stays scoped to this skin. Light and dark are both themed:
 *   light = 「曙色颂」 ivory & rose daylight
 *   dark  = 「月夜密语」 soft plum midnight & luminous pink  (v0.3.0)
 *
 * The official Remielle splash (transparent PNG, converted to lossy WebP) is
 * embedded as a data URI and shown as a right-edge companion figure:
 *   - welcome (hero) phase  → full presence
 *   - active conversation   → fades to a watermark so text stays readable
 *   - settings overlay / narrow viewports → hidden
 *
 * Hand-written (no build step): plain CSS inlined as a string, mounted with the
 * same `style[data-plugin-css]` convention the DSH skin bundlers use.
 */
window.__ModuleLoader__.load({
	id: "dsh-remiel-skin",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const TAG = "dsh-remiel-skin/theme.css";
		const ART_CLASS = "remiel-art";
		// v0.3.5: 用户选片 — 暗=#01 wa_01(8000×4496 4K)，明=#10 wa_11(4264×2400 4K)。
		// 旧的时装全画退役为抠图母本；v0.3.4 的影画展示 Banner 也在白名单里备用。
		// v0.4.12: 用户点单换装 — 明=i2i球厅00035（浅亮调 2016×1224）、
		// 暗=复现00046（深调 2016×1152）；wa_01/wa_11 退居备用白名单。
		const SCENE_DARK = "ea160e63ab2a42e26e95efc81d3fc2e8d3f81d14afe151a2bc9d9077e6c9baec.webp";
		const SCENE_LIGHT = "79b4bffd91f3f1a2ea95a163b8a13d83402a7d37616a614d77da1a4994877f40.webp";
		/** 备用明场景（影画展示 banner3 亮调），想换明场景把上面 SCENE_LIGHT 换成它即可。 */
		const SCENE_LIGHT_ALT = "13843d3c30a14a329fd1b28de6ccf3d41a4138b4054b12b9a2011d7598a69eb1.webp";

		/** v0.3.6: 明模式「影池独舞·泳装」完整立绘（透明底 WebP 1091×1400），经 /skin-assets/ 路由供给。 */
		// v0.3.5 fix: 常量必须带 .webp 扩展名 — artAsset() 原样拼 URL，之前漏了扩展名
		// 导致请求 /skin-assets/remiel/<sha>（无后缀）不匹配白名单 -> 404 -> 立绘不显示。
		const ART_FIG_LIGHT = "275aa65ec784253c3e4fb4fe63f835f082f389a90d4a63feba27669463a84672.webp";
		/** v0.3.6: 暗模式「月夜密语」完整立绘（透明底 WebP 1600×1002 横版），经 /skin-assets/ 路由供给。 */
		const ART_FIG_DARK = "ec7c6cd2785738d4ab1d3757ec5512edb61177ea42424e44a0237b425149ca1f.webp";
		/** v0.4.11: 用户点单换岗 —— 明角=泳装大头版、暗角=黑色大头版、
		   明水印=白色Q版1（不变）、暗水印=黑色Q版1。 */
		const Q_CORNER_LIGHT = "1b805a40057f18ec4fe73f5b5ebd7eb30b37f0a0c2a17a5d96fe3a63b98eb6c9.png"; // 泳装Q版大头 · 对话框左下角(明)
		const Q_WM_LIGHT = "cb8df6100f42713fd483c777282c91bef476767601a803bca212d2c2019d0a87.png"; // 白色Q版1 · 工作区水印(明)
		const Q_CORNER_DARK = "684512d8035c15cc09f068ff8f00a457bc0320313afc816b20cff5b0664d035a.png"; // 黑色Q版大头 · 对话框左下角(暗)
		const Q_WM_DARK = "ae439a4f5db7bed3c2cb5d3d577673e40e96a95742bce806d1db1bd9d65bda14.png"; // 黑色Q版1 · 工作区水印(暗)
		/* v0.4.8: URL 挂 ?v= 版本戳 —— 路由忽略 query，但浏览器视为新 URL，
		   连旧条目留下的 immutable 缓存也一并绕开（白底残留的最后一堵墙） */
		const artAsset = (file) =>
			typeof document !== "undefined"
				? new URL("skin-assets/remiel/" + file + "?v=0.4.16", document.baseURI).href
				: "/skin-assets/remiel/" + file + "?v=0.4.16";
		const ART = artAsset(ART_FIG_LIGHT);
		const ART_DARK = artAsset(ART_FIG_DARK);


		const CSS = `
/* ============================================================
   蕾米埃尔·时隙流明 — Remielle · Aeon Gleam  (v0.3.0)
   A Zenless Zone Zero fan skin for the DeepSeek Harness GUI.
   ============================================================ */

/* ---------- light mode · 「曙色颂」 ---------- */
body[data-dsh-remiel] {
  /* v0.3.2: bg-base 必须透明——.pI_x6G_frame / 对话根都拿它铺全屏，
     不透明会把 z-index:-1 的场景画整个盖死（"没有场景"的根因）。
     底色仍由 body 的 background-color 提供。 */
  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: #fbf2f7;
  --dsw-alias-bg-layer-2: #f6e9f1;
  --dsw-alias-bg-layer-3: #f0dde9;
  --dsw-alias-bg-overlay: #fdf6f9;
  --dsw-specific-menu: #f0dde9;
  /* v0.3.9b: the shell root (hHd-Xa_root) paints height:100% of the sidebar
     with this fill — it hid the column's velvet AND the v0.3.9 hem ornament
     (the "workspace is blank" root cause). Open it so the drape shows. */
  --dsw-specific-sidebar-fill: transparent;
  --dsw-alias-border-l1: #ecd2e1;
  --dsw-alias-border-l2: #e3bfd4;
  --dsw-alias-border-l3: #dba9c6;
  --dsw-alias-border-l4: #d59cbc;
  --dsw-alias-brand-primary: #e2609f;
  --dsw-alias-button-primary-fill: #e2609f;
  --dsw-alias-button-primary-hover: #d14e90;
  --dsw-alias-button-ghost-active-fill: #f9dcea;
  --dsw-alias-button-ghost-active-border: #f0b8d3;
  --dsw-alias-button-tool-bar-fill: #faeaf3;
  --dsw-alias-button-tool-bar-hover: #f5dcea;
  --dsw-alias-button-elevated-fill: #fffdfe;
  --dsw-alias-button-floating-fill: #fffdfe;
  --dsw-alias-button-floating-hover: #f7e4ef;
  --dsw-specific-input-major: #fffbfdde;
  --dsw-alias-interactive-bg-hover: #e2609f1f;
  --dsw-alias-interactive-bg-hover-solid: #f8e6f0;
  --dsw-alias-interactive-bg-active: #e2609f38;
  --dsw-alias-link: #cf4289;
  --dsw-alias-markdown-inline-code: #b03a78;
  --dsw-alias-markdown-code-block: #fdf1f8f7;
  --dsw-alias-markdown-tag: #a4762f;
  --dsh-scrollbar-thumb: #e7a7c8;
  --dsh-scrollbar-thumb-hover: #db8cb8;
  --dsh-boot-bg: #fdf8fa;
  --dsh-boot-brand: #e2609f;
  --dsh-boot-border: #f0bcd6;
  --dsh-boot-arc: #e2609f;
  --dsh-boot-label-primary: #4a2a3a;
  --dsh-boot-label-secondary: #8a6076;
  --dsh-boot-label-tertiary: #b08ea1;
  --remiel-art: url("__ART_URI__");
  --remiel-art-dark: url("__ART_DARK_URI__");
  /* v0.4.5 · Q版三连：四个原值 + 两个主题开关（规则只消费开关） */
  --remiel-wm-light: url("__WM_LIGHT_URI__");
  --remiel-wm-dark: url("__WM_DARK_URI__");
  --remiel-corner-light: url("__Q_CORNER_URI__");
  --remiel-corner-dark: url("__Q_CORNER_DARK_URI__");
  --remiel-wm: var(--remiel-wm-light);
  --remiel-corner: var(--remiel-corner-light);
  background-color: #fdf8fa;
  background-image:
    radial-gradient(1100px 640px at 78% -12%, #ffd7ec4d, transparent 62%),
    radial-gradient(900px 520px at -8% 108%, #efe0ff40, transparent 60%);
}

/* ---------- dark mode · 「月夜密语」 (v0.1.1 lightened · v0.1.2 visible · v0.1.3 stacking · v0.1.4 settings fix · v0.2.0 ballroom ornaments · v0.3.0 scene backdrop) ---------- */
body[data-dsh-remiel][data-ds-dark-theme] {
  /* v0.3.2: 同明模式——透明底让场景画透出（根因：frame 全屏不透明铺底） */
  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: #2b2036;
  --dsw-alias-bg-layer-2: #342741;
  --dsw-alias-bg-layer-3: #3f2f4d;
  --dsw-alias-bg-overlay: #271d2f;
  --dsw-specific-menu: #3f2f4d;
  --dsw-specific-sidebar-fill: transparent; /* v0.3.9b: velvet + hem show through */
  /* v0.4.5: Q版主题开关——工作区水印与对话框角饰换暗版 */
  --remiel-wm: var(--remiel-wm-dark);
  --remiel-corner: var(--remiel-corner-dark);
  --dsw-alias-border-l1: #5b4567;
  --dsw-alias-border-l2: #6a5378;
  --dsw-alias-border-l3: #7a6089;
  --dsw-alias-border-l4: #896c98;
  --dsw-alias-brand-primary: #f286b6;
  --dsw-alias-button-primary-fill: #d9599b;
  --dsw-alias-button-primary-hover: #e268a7;
  --dsw-alias-button-ghost-active-fill: #e2609f38;
  --dsw-alias-button-ghost-active-border: #e2609f70;
  --dsw-alias-button-tool-bar-fill: #382a44;
  --dsw-alias-button-tool-bar-hover: #43314f;
  --dsw-alias-button-elevated-fill: #322640f0;
  --dsw-alias-button-floating-fill: #362a45f5;
  --dsw-alias-button-floating-hover: #453352;
  --dsw-specific-input-major: #2c2139e6;
  --dsw-alias-interactive-bg-hover: #f286b629;
  --dsw-alias-interactive-bg-hover-solid: #46324f;
  --dsw-alias-interactive-bg-active: #e2609f4d;
  --dsw-alias-link: #f286b6;
  --dsw-alias-markdown-inline-code: #f4a3c8;
  --dsw-alias-markdown-code-block: #2b2039f7;
  --dsw-alias-markdown-tag: #e2c489;
  --dsh-scrollbar-thumb: #8a5f78;
  --dsh-scrollbar-thumb-hover: #a07089;
  --dsh-boot-bg: #241a2d;
  --dsh-boot-brand: #f286b6;
  --dsh-boot-border: #6a5378;
  --dsh-boot-arc: #f286b6;
  --dsh-boot-label-primary: #f5e9f1;
  --dsh-boot-label-secondary: #cdb6c6;
  --dsh-boot-label-tertiary: #a68fa0;
  background-color: #241a2d;
  background-image:
    radial-gradient(1100px 640px at 78% -12%, #f286b62e, transparent 62%),
    radial-gradient(900px 520px at -8% 108%, #9d7ad933, transparent 60%);
}

/* ---------- signature: titlebar, a rose-to-gold hairline ---------- */
body[data-dsh-remiel] [class*=titlebar] {
  background: linear-gradient(90deg, #fdf6fad9, #fbe9f3d1 55%, #f8e1efd6);
  backdrop-filter: blur(12px) saturate(1.05);
  -webkit-backdrop-filter: blur(12px) saturate(1.05);
  border-bottom: 1px solid #eec3da;
  box-shadow: inset 0 -1px #d9b36a4d;
}
body[data-dsh-remiel] [class*=titlebar] [class*=button] {
  color: #b76a94;
}
body[data-dsh-remiel] [class*=titlebar] [class*=button]:hover {
  color: #cf4289;
  background: #e2609f1f;
}
body[data-dsh-remiel][data-ds-dark-theme] [class*=titlebar] {
  background: linear-gradient(90deg, #261c2fd9, #2e2038d1 55%, #382744d6);
  backdrop-filter: blur(12px) saturate(1.05);
  -webkit-backdrop-filter: blur(12px) saturate(1.05);
  border-bottom-color: #e2609f59;
  box-shadow: inset 0 -1px #d9b36a59;
}
body[data-dsh-remiel][data-ds-dark-theme] [class*=titlebar] [class*=button] {
  color: #d9a4c1;
}
body[data-dsh-remiel][data-ds-dark-theme] [class*=titlebar] [class*=button]:hover {
  color: #f286b6;
  background: #f286b624;
}

/* ---------- signature: conversation area shows the ballroom spotlight ---------- */
body[data-dsh-remiel] [class*=ConversationRoot] {
  background: transparent;
}

/* ---------- signature: user bubbles, a note of rose ---------- */
body[data-dsh-remiel] [class*=userRow] [class*=bubble]:not([role=tooltip]) {
  background: #fdf0f7f2;
  border: 1px solid #f0bcd6;
  box-shadow: 0 4px 14px #e2609f1f;
}
body[data-dsh-remiel][data-ds-dark-theme] [class*=userRow] [class*=bubble]:not([role=tooltip]) {
  background: #382642f2;
  border-color: #e2609f70;
  box-shadow: 0 4px 16px #00000033;
}

/* ---------- signature: primary actions glow like 虚曜 ---------- */
body[data-dsh-remiel] [data-composer-card] button[class*=primary] {
  background: linear-gradient(145deg, #ee7ab1, #d14e90);
  border: 1px solid #ffd2e7;
  box-shadow: 0 4px 14px #e2609f4d, inset 0 1px #ffffff59;
}
body[data-dsh-remiel] [data-composer-card] button[class*=primary]:hover:not(:disabled) {
  background: linear-gradient(145deg, #f286b6, #d9599b);
}
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card] button[class*=primary] {
  background: linear-gradient(145deg, #e268a7, #c14e8b);
  border-color: #e2609f80;
  box-shadow: 0 4px 16px #e2609f52, inset 0 1px #ffffff2e;
}

/* ---------- composer card surface ---------- */
body[data-dsh-remiel] [data-composer-card] [data-composer-input] {
  caret-color: #d14e90;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card] [data-composer-input] {
  caret-color: #f286b6;
}

/* ---------- selection & focus ---------- */
body[data-dsh-remiel] ::selection {
  background: #e2609f47;
}
body[data-dsh-remiel][data-ds-dark-theme] ::selection {
  background: #f286b652;
}

/* ---------- header hairline ---------- */
body[data-dsh-remiel] header[class*=header] {
  border-bottom-color: #eec3da;
}
body[data-dsh-remiel][data-ds-dark-theme] header[class*=header] {
  border-bottom-color: #5b4567;
}

/* ---------- turn triggers keep a rose frame ---------- */
body[data-dsh-remiel] [data-turn-trigger] {
  border-color: #f0bcd68a;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-turn-trigger] {
  border-color: #e2609f5e;
}

/* ============================================================
   v0.3.0 · 场景背景 — the ballroom itself
   a full-viewport backdrop served from assets/scenes (node route),
   veiled by a readable scrim; light = 影池独舞, dark = 月夜密语.
   ============================================================ */
/* v0.3.3: 整画完整展示 — cover 裁切会把人物切掉（影池独舞的头发在顶部 0~9%，
   旧裁切带从 14% 起 → 直接无头）。改为三层：
   ::before = 同图 cover + 高斯模糊垫满两翼；.remiel-scene-art = contain 整画居中
   （人物完整入画）；::after = 减淡后的可读性罩纱。 */
.remiel-scene {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}
.remiel-scene::before {
  content: "";
  position: absolute;
  inset: -48px;
  background-image: var(--remiel-scene-light);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(34px) saturate(1.08) brightness(1.02);
}
.remiel-scene-art {
  position: absolute;
  inset: 0;
  background-image: var(--remiel-scene-light);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
body[data-dsh-remiel][data-ds-dark-theme] .remiel-scene::before,
body[data-dsh-remiel][data-ds-dark-theme] .remiel-scene-art {
  background-image: var(--remiel-scene-dark);
}
.remiel-scene::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(253, 248, 250, 0.38), rgba(253, 248, 250, 0.58) 45%, rgba(253, 248, 250, 0.78));
}
body[data-dsh-remiel][data-ds-dark-theme] .remiel-scene::after {
  background: linear-gradient(180deg, rgba(20, 14, 26, 0.34), rgba(30, 21, 38, 0.52) 45%, rgba(36, 26, 45, 0.76));
}

/* ============================================================
   v0.2.0 · 舞会装潢 — ballroom ornaments
   the density of a maid atelier, re-laced in Remielle's
   rose & luminous gold. all CSS-only, all scoped.
   ============================================================ */

/* ---------- ballroom floor: faint diamond tiling under the conversation ---------- */
body[data-dsh-remiel] [class*=ConversationRoot] {
  background:
    linear-gradient(45deg, #e2609f0a 25%, transparent 25%, transparent 75%, #e2609f0a 75%) 0 0 / 48px 48px,
    linear-gradient(45deg, #e2609f0a 25%, transparent 25%, transparent 75%, #e2609f0a 75%) 24px 24px / 48px 48px,
    radial-gradient(900px 600px at 50% -10%, #ffd7ec33, transparent 65%);
}
body[data-dsh-remiel][data-ds-dark-theme] [class*=ConversationRoot] {
  background:
    linear-gradient(45deg, #f286b60f 25%, transparent 25%, transparent 75%, #f286b60f 75%) 0 0 / 48px 48px,
    linear-gradient(45deg, #f286b60f 25%, transparent 25%, transparent 75%, #f286b60f 75%) 24px 24px / 48px 48px,
    radial-gradient(900px 600px at 50% -10%, #f286b622, transparent 65%);
}

/* ---------- sidebar: a velvet drape with a rose-to-gold seam ---------- */
body[data-dsh-remiel] :is([data-pane=sidebar],[class*=sidebarCol]) {
  position: relative;
  background: linear-gradient(180deg, #fdf2f7d9, #f7e6f0d1 60%, #f3dfebd6);
  backdrop-filter: blur(14px) saturate(1.08);
  -webkit-backdrop-filter: blur(14px) saturate(1.08);
  border-right: 1px solid #eec3da;
  box-shadow:
    inset -1px 0 #d9b36a30,
    inset -4px 0 #ffd9ea2b,
    7px 0 26px #e2609f12;
}
body[data-dsh-remiel][data-ds-dark-theme] :is([data-pane=sidebar],[class*=sidebarCol]) {
  background: linear-gradient(180deg, #241a2dd9, #2b2036d1 60%, #332540d6);
  backdrop-filter: blur(14px) saturate(1.08);
  -webkit-backdrop-filter: blur(14px) saturate(1.08);
  border-right-color: #4a3552;
  box-shadow:
    inset -1px 0 #d9b36a2b,
    inset -4px 0 #f286b621,
    7px 0 26px #0000002e;
}
body[data-dsh-remiel] :is([data-pane=sidebar],[class*=sidebarCol])::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: -1px;
  width: 2px;
  pointer-events: none;
  background: linear-gradient(180deg, #e2609f66, #d9b36a59 35%, #d9b36a59 65%, #e2609f66);
}
body[data-dsh-remiel] :is([data-pane=sidebar],[class*=sidebarCol]) button:hover {
  background: #e2609f1f;
}
body[data-dsh-remiel][data-ds-dark-theme] :is([data-pane=sidebar],[class*=sidebarCol]) button:hover {
  background: #f286b629;
}

/* ---------- v0.3.9 · sidebar hem: lace, floor and a foot glow ----------
   the stretch under the session list was bare velvet; the column now ends
   in a decorated hem — ballroom diamonds fading up into a scalloped lace
   edge with a rose glow — painted in ::before at z-index -1 (above the
   column's own paint, below every row of content). */
body[data-dsh-remiel] :is([data-pane=sidebar],[class*=sidebarCol])::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 240px;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(150px 84px at 50% 100%, #ffd7ec59, transparent 70%),
    linear-gradient(to bottom, #f3dfebd6 0, #f3dfebd6 36px, transparent 168px);
}
body[data-dsh-remiel][data-ds-dark-theme] :is([data-pane=sidebar],[class*=sidebarCol])::before {
  background:
    radial-gradient(150px 84px at 50% 100%, #f286b640, transparent 70%),
    linear-gradient(to bottom, #332540d6 0, #332540d6 36px, transparent 168px);
}
/* gold hairline + rose breath above the footer seat */
body[data-dsh-remiel] .hHd-Xa_footArea {
  border-top: 1px solid #e8c98a66;
  box-shadow: 0 -10px 24px -8px #e2609f2e;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_footArea {
  border-top-color: #d9b36a73;
  box-shadow: 0 -10px 24px -8px #f286b633;
}

/* ============================================================
   v0.4.0 · 舞会满席 — atelier-density dressing for the two panels
   you live in: the left workspace browser and the bottom composer.
   Grammar re-woven from the reference skin (top spotlight, 135°
   weave, framed inner panel with filigree corners, ribbon band +
   medallion over the composer, the figure veiled into the sidebar
   foot) — every pixel hand-drawn in gradients, zero borrowed art.
   ============================================================ */

/* ---------- shell root: rose crown spotlight + milky wash + the frame itself
   (v0.4.4 · 内框迁入元素本体 —— ::before 画了两轮用户都看不见，改为
   inset 双环 box-shadow + 背景层角花：背景层与本体阴影是已证必渲染的路径) ---------- */
body[data-dsh-remiel] .hHd-Xa_root {
  position: relative;
  z-index: 0;
  border-radius: 12px;
  box-shadow:
    inset 0 0 0 2px #d9a05b99,
    inset 0 0 0 6px #e2609f2b;
  background:
    radial-gradient(circle at 0 0, #d9a05b 0 3px, #e2609f 3.5px 9px, #e2609f33 9.5px 14px, transparent 15px) left top / 44px 44px no-repeat,
    radial-gradient(circle at 100% 0, #d9a05b 0 3px, #e2609f 3.5px 9px, #e2609f33 9.5px 14px, transparent 15px) right top / 44px 44px no-repeat,
    radial-gradient(circle at 0 100%, #d9a05b 0 3px, #e2609f 3.5px 9px, #e2609f33 9.5px 14px, transparent 15px) left bottom / 44px 44px no-repeat,
    radial-gradient(circle at 100% 100%, #d9a05b 0 3px, #e2609f 3.5px 9px, #e2609f33 9.5px 14px, transparent 15px) right bottom / 44px 44px no-repeat,
    radial-gradient(130% 240px at 50% 0%, #e2609f70, transparent 74%),
    linear-gradient(180deg, #fffdfe6b, #fffdfe2b);
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_root {
  box-shadow:
    inset 0 0 0 2px #d9b36a99,
    inset 0 0 0 6px #f286b630;
  background:
    radial-gradient(circle at 0 0, #e2c489 0 3px, #f286b6 3.5px 9px, #f286b63d 9.5px 14px, transparent 15px) left top / 44px 44px no-repeat,
    radial-gradient(circle at 100% 0, #e2c489 0 3px, #f286b6 3.5px 9px, #f286b63d 9.5px 14px, transparent 15px) right top / 44px 44px no-repeat,
    radial-gradient(circle at 0 100%, #e2c489 0 3px, #f286b6 3.5px 9px, #f286b63d 9.5px 14px, transparent 15px) left bottom / 44px 44px no-repeat,
    radial-gradient(circle at 100% 100%, #e2c489 0 3px, #f286b6 3.5px 9px, #f286b63d 9.5px 14px, transparent 15px) right bottom / 44px 44px no-repeat,
    radial-gradient(130% 240px at 50% 0%, #f286b680, transparent 74%),
    linear-gradient(180deg, #241a2d8c, #241a2d4d);
}
/* v0.4.2 · functional fix: root z-index:0 (needed to keep the ornaments above
   its own background) turned root into a stacking context that trapped the
   settings dialog's z ~940 below the conversation — while a modal is open,
   drop the context so the dialog escapes like it did pre-v0.4.0 */
body[data-dsh-remiel]:has([role=dialog][aria-modal=true]) .hHd-Xa_root {
  z-index: auto;
}
/* v0.4.2 · visible density: a gilded hairline under the brand row
   (logoRow is border-box, so zero layout shift).
   v0.4.7: brand-row wings deleted with all the rest ("翅膀不好看") */
body[data-dsh-remiel] .hHd-Xa_logoRow {
  border-bottom: 1px solid #d9a05b66;
  box-shadow: 0 1px 8px #e2609f1f;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_logoRow {
  border-bottom-color: #d9b36a7a;
  box-shadow: 0 1px 8px #f286b626;
}

/* v0.4.4: root::before frame (two rounds invisible) RETIRED — line lives in
   the element's inset box-shadow, corners live in its background layers */

/* ---------- her Q 版 at the sidebar foot: bigger, bolder, no white box
   (v0.4.6: PNG 白底已抠 + alpha 紧裁 ——「白色背景框」的真身是 PNG 自带白底；
   v0.4.7: 60%→72%、贴满左右边缘 ——「还不够大」；白底回魂曾是 etag 缓存陷阱) ---------- */
body[data-dsh-remiel] .hHd-Xa_root::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.5;
  /* v0.4.5: 工作区立绘水印与右下大立绘解耦——明=白色Q版 */
  background: var(--remiel-wm) center bottom / contain no-repeat;
  -webkit-mask-image: linear-gradient(to top, #000 62%, transparent 99%);
  mask-image: linear-gradient(to top, #000 62%, transparent 99%);
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_root::after {
  /* v0.4.5: 暗=黑色Q版（--remiel-wm 已在暗块切到 wm-dark，这里只调浓度） */
  opacity: 0.58;
}

/* search — wings removed v0.4.7 ("翅膀不好看"); base search styling lives in
   the v0.4.0/v0.4.1 focus/hover rules */
body[data-dsh-remiel] .bhn1Oq_sectionHeader {
  overflow: visible;
}
body[data-dsh-remiel] .bhn1Oq_search:hover,
body[data-dsh-remiel] .bhn1Oq_search:focus-within,
body[data-dsh-remiel] .bhn1Oq_searchExpanded:focus-within {
  border-color: #e2609f8c;
  box-shadow: inset 0 0 0 1px #e2609f26, 0 4px 12px #e2609f1f;
}
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_search:hover,
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_search:focus-within,
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_searchExpanded:focus-within {
  border-color: #f286b699;
  box-shadow: inset 0 0 0 1px #f286b630, 0 4px 12px #00000033;
}

/* ---------- v0.4.2: composer outer frame (ribbon/medallion/rails/corner studs)
   REMOVED — user judged "对话框周围的框不好看". The card keeps its own glow,
   hairline rail and gold-answering buttons. */

/* ---------- every composer button answers in gold ---------- */
body[data-dsh-remiel] [data-composer-card] button:hover {
  border-color: #d9a05b;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card] button:hover {
  border-color: #e2c489;
}

/* ---------- v0.3.1 · settings overlay escape hatch ----------
   backdrop-filter on the sidebar makes it the containing block for its
   position:fixed descendants, so the full-screen settings dialog (rendered
   inside the sidebar seat) was trapped inside the left column. While an
   aria-modal dialog is open, drop the blur so the overlay re-anchors to the
   viewport — visually invisible, because the dialog mask paints its own
   full-screen backdrop-filter over everything anyway. */
body[data-dsh-remiel]:has([role=dialog][aria-modal=true]) :is([data-pane=sidebar],[class*=sidebarCol]) {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* ---------- composer: a lace-trimmed boudoir card ---------- */
body[data-dsh-remiel] [data-composer-card] {
  position: relative;
  overflow: visible;
  background:
    radial-gradient(150% 110px at 50% 0%, #e2609f26, transparent 66%),
    linear-gradient(180deg, #fffdfee8, #fdf0f7e0);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid #f0bcd6;
  border-radius: 26px;
  box-shadow:
    0 10px 30px #e2609f26,
    0 2px 8px #e2609f14,
    inset 0 1px #ffffffd9,
    inset 0 -1px #d9b36a4d;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card] {
  background:
    radial-gradient(150% 110px at 50% 0%, #f286b62b, transparent 66%),
    linear-gradient(180deg, #2e2139e8, #271c31e0);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-color: #e2609f59;
  box-shadow:
    0 12px 34px #00000047,
    inset 0 1px #ffffff14,
    inset 0 -1px #d9b36a47;
}
/* v0.4.2: dot scallops retired ("对话框的点不好看") — a slim double hairline
   rail (gold over rose) now floats above the card instead.
   v0.4.7: all wings deleted on request ("翅膀不好看") — band box kept (hairlines
   land on the same absolute rows as the v0.4.2 rail), wing layers gone */
body[data-dsh-remiel] [data-composer-card]::before {
  content: "";
  position: absolute;
  left: 26px;
  right: 26px;
  top: -24px;
  height: 27px;
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent, #d9a05b99 14%, #e2609f8c 50%, #d9a05b99 86%, transparent) 0 16px / 100% 2px no-repeat,
    linear-gradient(90deg, transparent, #e2609f4d 8%, #e2609f33 50%, #e2609f4d 92%, transparent) 0 20px / 100% 1px no-repeat;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card]::before {
  background:
    linear-gradient(90deg, transparent, #e2c489aa 14%, #f286b68c 50%, #e2c489aa 86%, transparent) 0 16px / 100% 2px no-repeat,
    linear-gradient(90deg, transparent, #f286b64d 8%, #f286b638 50%, #f286b64d 92%, transparent) 0 20px / 100% 1px no-repeat;
}

/* ---------- round composer tools with an inset ring ---------- */
body[data-dsh-remiel] [data-composer-card] button[class*=add],
body[data-dsh-remiel] [data-composer-card] [class*=modes] button[class*=trigger] {
  background: #fdf0f7f2;
  border-color: #f0bcd6;
  box-shadow: 0 3px 10px #e2609f1f, inset 0 0 0 3px #ffffffb3;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card] button[class*=add],
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card] [class*=modes] button[class*=trigger] {
  background: #332540e6;
  border-color: #e2609f66;
  box-shadow: 0 3px 12px #00000038, inset 0 0 0 3px #ffffff12;
}

/* ---------- send button: a held 虚曜 with a gold ring ---------- */
body[data-dsh-remiel] [data-composer-card] button[class*=primary] {
  box-shadow:
    0 4px 14px #e2609f4d,
    inset 0 1px #ffffff59,
    inset 0 0 0 2px #d9b36a59;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-composer-card] button[class*=primary] {
  box-shadow:
    0 4px 16px #e2609f52,
    inset 0 1px #ffffff2e,
    inset 0 0 0 2px #d9b36a66;
}
/* v0.4.7: send-hover wings deleted ("翅膀不好看") — button hover styling from
   the v0.2/v0.4.0 rules stands alone */

/* ---------- v0.4.4 · composer phase states: a pure-CSS port of the atelier
   state machine — hero = translucent + deep blur (the docked solid card is
   the default above), settings modal = step aside ---------- */
body[data-dsh-remiel]:has([data-phase=hero]) [data-composer-card],
body[data-dsh-remiel][data-phase=hero] [data-composer-card] {
  background:
    radial-gradient(150% 110px at 50% 0%, #e2609f33, transparent 66%),
    linear-gradient(180deg, #fffdfeb8, #fdf0f7a6);
  backdrop-filter: blur(16px) saturate(1.04);
  -webkit-backdrop-filter: blur(16px) saturate(1.04);
  box-shadow:
    0 18px 44px #e2609f33,
    0 2px 8px #e2609f1a,
    inset 0 1px #ffffffe6,
    inset 0 -1px #d9b36a59;
  /* v0.4.14/15: hero 卡收窄回对话态规格（0414 修 gap97<216 被切）。v0.4.15 起
     角饰改钉 centerCol::after（与卡宽彻底解耦），952 仅为与对话态观感一致 */
  max-width: 952px;
}
body[data-dsh-remiel][data-ds-dark-theme]:has([data-phase=hero]) [data-composer-card],
body[data-dsh-remiel][data-ds-dark-theme][data-phase=hero] [data-composer-card] {
  background:
    radial-gradient(150% 110px at 50% 0%, #f286b63d, transparent 66%),
    linear-gradient(180deg, #2e2139b8, #271c31a6);
  box-shadow:
    0 20px 48px #00000059,
    inset 0 1px #ffffff1f,
    inset 0 -1px #d9b36a59;
}
body[data-dsh-remiel]:has([role=dialog][aria-modal=true]) [data-composer-card] {
  opacity: 0.75;
  pointer-events: none;
}

/* ---------- v0.4.15 · hero 角饰改道：钉 centerCol 左下（用户点单：
   「位置左移 + 往下移，底边与右下立绘最下端水平对齐」） ----------
   diag 实锤 hero 座舱不坐底：.viewArea flex:1 0 auto 仅 [data-phase=active]
   生效，hero 座舱随欢迎内容浮空 → 卡片锚定的角饰整体悬空；且 hero 卡宽一动
   gap 就漂（0414 收窄后冲到 311）。改钉 centerCol::after：
   left 14 = 对话态同轨（卡952居中 → 盒 [centerCol+14 .. +230]，自动跟侧栏宽）；
   bottom 0 = 与 .remiel-art（bottom:0）同一地平线；centerCol 自带
   overflow:hidden，永在裁剪链内。卡片角饰 hero 态退役。
   注：.pI_x6G_centerCol 为 DSH 哈希类名，DSH 升级后随 diag 复核（v0.3.7 家规） */
body[data-dsh-remiel]:has([data-phase=hero]) [data-composer-card]::after {
  content: none;
}
body[data-dsh-remiel]:has([data-phase=hero]) .pI_x6G_centerCol {
  position: relative;
}
body[data-dsh-remiel]:has([data-phase=hero]) .pI_x6G_centerCol::after {
  content: "";
  position: absolute;
  left: 14px;
  bottom: 0;
  width: 216px;
  height: 400px;
  pointer-events: none;
  user-select: none;
  background: var(--remiel-corner) right bottom / contain no-repeat;
}

/* ---------- v0.4.6 → v0.4.8 · 角饰 Q 版（对话框左下）：素语法不变。
   v0.4.8「往右一点 + 工作区最小时完整露出」：460px/盒伸 250 在 hero 态
   （卡片变宽）会顶穿 centerCol:hidden 左边距被切 → v0.4.16 起 contain 按盒宽自适配、盒伸 216
   （Q版大头 216×235 满宽不裁），右缘 right:0 仍贴卡片左缘 ---------- */
body[data-dsh-remiel] [data-composer-card]::after {
  content: "";
  position: absolute;
  left: -216px;
  width: 216px;
  top: -470px;
  bottom: -6px;
  pointer-events: none;
  background: var(--remiel-corner) right 0 bottom 4px / contain no-repeat;
}

/* ---------- conversation panels: assistant cards with a ribbon corner ---------- */
body[data-dsh-remiel] [data-chat-flow] div[class*=markdown] {
  background: #fffdfeb8;
  border: 1px solid #f2d7e6;
  border-radius: 18px 18px 18px 7px;
  padding: 10px 16px 6px;
  box-shadow: 0 4px 16px #e2609f14;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-chat-flow] div[class*=markdown] {
  background: #2b2036c9;
  border-color: #5b4567;
  box-shadow: 0 6px 18px #00000033;
}
/* user bubbles get the mirrored corner */
body[data-dsh-remiel] [class*=userRow] [class*=bubble]:not([role=tooltip]) {
  border-radius: 18px 18px 6px 18px;
}

/* ---------- headings, quotes, rules: the printed-programme look ---------- */
body[data-dsh-remiel] div[class*=markdown] :is(h1, h2) {
  border-bottom: 1px solid #f0bcd6;
  padding-bottom: 0.3em;
}
body[data-dsh-remiel][data-ds-dark-theme] div[class*=markdown] :is(h1, h2) {
  border-bottom-color: #5b4567;
}
body[data-dsh-remiel] div[class*=markdown] blockquote {
  background: linear-gradient(90deg, #fdf0f7e6, #fdf0f755);
  border-left: 3px solid #e2609f;
  border-radius: 10px;
  padding: 0.5em 0.9em;
  font-family: Georgia, "Times New Roman", "Songti SC", "Noto Serif SC", serif;
  font-style: italic;
}
body[data-dsh-remiel][data-ds-dark-theme] div[class*=markdown] blockquote {
  background: linear-gradient(90deg, #332540e0, #33254055);
  border-left-color: #f286b6;
}
body[data-dsh-remiel] div[class*=markdown] li::marker {
  color: #e2609f;
}
body[data-dsh-remiel][data-ds-dark-theme] div[class*=markdown] li::marker {
  color: #f286b6;
}
body[data-dsh-remiel] hr {
  border: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e2609f8c 20%, #d9b36a8c 80%, transparent);
}
body[data-dsh-remiel] a {
  text-decoration-color: #e2609f99;
  text-underline-offset: 3px;
}

/* ---------- tables: framed programme boards ---------- */
body[data-dsh-remiel] div[class*=markdown] table {
  border: 1px solid #e9c3d8;
  border-radius: 12px;
  box-shadow: 0 4px 14px #e2609f14;
}
body[data-dsh-remiel][data-ds-dark-theme] div[class*=markdown] table {
  border-color: #5b4567;
  box-shadow: 0 6px 16px #00000030;
}
body[data-dsh-remiel] div[class*=markdown] th {
  background: #fbe7f1;
  color: #8a4b6c;
  border-bottom: 1px solid #f0bcd6;
}
body[data-dsh-remiel][data-ds-dark-theme] div[class*=markdown] th {
  background: #382642;
  color: #f4c9dd;
  border-bottom-color: #e2609f59;
}
body[data-dsh-remiel] div[class*=markdown] td {
  border-top: 1px solid #f6e2ed;
}
body[data-dsh-remiel][data-ds-dark-theme] div[class*=markdown] td {
  border-top-color: #4a3552;
}

/* ---------- code: rose-tinted cases ---------- */
body[data-dsh-remiel] div[class*=markdown] :not(pre) > code {
  background: #f9e3ee;
  border: 1px solid #f2d7e6;
}
body[data-dsh-remiel][data-ds-dark-theme] div[class*=markdown] :not(pre) > code {
  background: #3a2a47;
  border-color: #5b4567;
}
body[data-dsh-remiel] :is([class~=md-code-block], [data-read], [data-diff]) {
  border: 1px solid #f2d7e6;
  box-shadow: 0 4px 14px #e2609f12;
}
body[data-dsh-remiel][data-ds-dark-theme] :is([class~=md-code-block], [data-read], [data-diff]) {
  border-color: #4a3552;
  box-shadow: 0 6px 16px #0000002e;
}

/* ---------- turn triggers & floating pills ---------- */
body[data-dsh-remiel] [data-turn-trigger] {
  background: #fdf0f7e6;
  border-radius: 12px;
  box-shadow: 0 4px 12px #e2609f1a;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-turn-trigger] {
  background: #2e2139ec;
  box-shadow: 0 6px 16px #00000033;
}

/* ---------- dialogs & menus: rose-gold frames ---------- */
body[data-dsh-remiel] :is([role=dialog], [role=menu], [data-radix-popper-content-wrapper] > *) {
  border: 1px solid #f0bcd6;
  border-radius: 14px;
  box-shadow: 0 18px 44px #e2609f2b, 0 4px 12px #0000001f;
}
body[data-dsh-remiel][data-ds-dark-theme] :is([role=dialog], [role=menu], [data-radix-popper-content-wrapper] > *) {
  border-color: #e2609f59;
  box-shadow: 0 20px 48px #00000059, 0 4px 12px #00000033;
}

/* ---------- tool surfaces: todo / goal / queue keep a rose frame ---------- */
body[data-dsh-remiel] :is([data-testid=todo-panel], [data-goal-bar] > div, [data-queue-dock] > div) {
  border-color: #f0bcd6;
  box-shadow: 0 8px 24px #e2609f1a;
}
body[data-dsh-remiel][data-ds-dark-theme] :is([data-testid=todo-panel], [data-goal-bar] > div, [data-queue-dock] > div) {
  border-color: #e2609f4d;
  box-shadow: 0 10px 26px #00000038;
}

/* ---------- focus rings in her color ---------- */
body[data-dsh-remiel] *:focus-visible {
  outline-color: #e2609fa6;
}
body[data-dsh-remiel][data-ds-dark-theme] *:focus-visible {
  outline-color: #f286b6b3;
}

/* ============================================================
   v0.3.7 · 右侧工作区 — the right workspace panel in her colours
   the right column (「工作区文件」 dockkit pane) was still on the
   stock surface. it now mirrors the left velvet drape, carries the
   ballroom floor, and laces the file rows in rose-gold.
   targets = shipped css-module maps: P3OORG_* (sidebar-right
   shell), k-1LKG_* (工作区文件 tab), geFEbW_* (guide hero) plus
   the dockkit data-attributes for the tab strip (structure-verified
   against the shipped bundles, immune to class hashing).
   ============================================================ */

/* ---------- right column shell: the drape, mirrored to the left ----------
   v0.3.7b: [data-rightbar-col] = AppFrame's right track (layout pI_x6G_rightbarCol),
   painted regardless of which occupant draws inside it; .P3OORG_panel = the
   sidebar-right panel itself; :has(...) fallbacks cover either nesting. */
body[data-dsh-remiel] [data-rightbar-col],
body[data-dsh-remiel] [data-dockkit-pane]:has(.P3OORG_panel),
body[data-dsh-remiel] :has(> .P3OORG_panel),
body[data-dsh-remiel] .P3OORG_panel {
  background: linear-gradient(180deg, #fdf2f7e6, #f7e6f0de 60%, #f3dfebe0);
  backdrop-filter: blur(14px) saturate(1.08);
  -webkit-backdrop-filter: blur(14px) saturate(1.08);
}
body[data-dsh-remiel] [data-rightbar-col],
body[data-dsh-remiel] [data-dockkit-pane]:has(.P3OORG_panel),
body[data-dsh-remiel] :has(> .P3OORG_panel) {
  border-left: 1px solid #eec3da;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-rightbar-col],
body[data-dsh-remiel][data-ds-dark-theme] [data-dockkit-pane]:has(.P3OORG_panel),
body[data-dsh-remiel][data-ds-dark-theme] :has(> .P3OORG_panel),
body[data-dsh-remiel][data-ds-dark-theme] .P3OORG_panel {
  background: linear-gradient(180deg, #241a2de6, #2b2036de 60%, #332540e6);
  backdrop-filter: blur(14px) saturate(1.08);
  -webkit-backdrop-filter: blur(14px) saturate(1.08);
}
body[data-dsh-remiel][data-ds-dark-theme] [data-rightbar-col],
body[data-dsh-remiel][data-ds-dark-theme] [data-dockkit-pane]:has(.P3OORG_panel),
body[data-dsh-remiel][data-ds-dark-theme] :has(> .P3OORG_panel) {
  border-left-color: #4a3552;
}

/* rose-to-gold seam + ballroom floor for the right track (v0.3.7b:
   the column carries its own floor so even an empty/hostless track
   stays dense — never a bare gradient). the panel keeps seam+glass only
   (its panelBody already lays the floor). */
body[data-dsh-remiel] [data-rightbar-col] {
  background-image:
    linear-gradient(180deg, #e2609f73, #d9b36a66 35%, #d9b36a66 65%, #e2609f73),
    linear-gradient(45deg, #e2609f0a 25%, transparent 25%, transparent 75%, #e2609f0a 75%),
    linear-gradient(45deg, #e2609f0a 25%, transparent 25%, transparent 75%, #e2609f0a 75%),
    linear-gradient(180deg, #fdf2f7e6, #f7e6f0de 60%, #f3dfebe0);
  background-size: 2px 100%, 48px 48px, 48px 48px, 100% 100%;
  background-position: left top, 0 0, 24px 24px, left top;
  background-repeat: no-repeat, repeat, repeat, no-repeat;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-rightbar-col] {
  background-image:
    linear-gradient(180deg, #f286b68c, #d9b36a70 35%, #d9b36a70 65%, #f286b68c),
    linear-gradient(45deg, #f286b60f 25%, transparent 25%, transparent 75%, #f286b60f 75%),
    linear-gradient(45deg, #f286b60f 25%, transparent 25%, transparent 75%, #f286b60f 75%),
    linear-gradient(180deg, #241a2de6, #2b2036de 60%, #332540e6);
  background-size: 2px 100%, 48px 48px, 48px 48px, 100% 100%;
  background-position: left top, 0 0, 24px 24px, left top;
  background-repeat: no-repeat, repeat, repeat, no-repeat;
}
body[data-dsh-remiel] .P3OORG_panel {
  background-image:
    linear-gradient(180deg, #e2609f73, #d9b36a66 35%, #d9b36a66 65%, #e2609f73),
    linear-gradient(180deg, #fdf2f7e6, #f7e6f0de 60%, #f3dfebe0);
  background-size: 2px 100%, 100% 100%;
  background-repeat: no-repeat;
  background-position: left top, left top;
}
body[data-dsh-remiel][data-ds-dark-theme] .P3OORG_panel {
  background-image:
    linear-gradient(180deg, #f286b68c, #d9b36a70 35%, #d9b36a70 65%, #f286b68c),
    linear-gradient(180deg, #241a2de6, #2b2036de 60%, #332540e6);
}

/* ---------- panel body: the ballroom floor, echoed ---------- */
body[data-dsh-remiel] .P3OORG_panelBody {
  background:
    linear-gradient(45deg, #e2609f0a 25%, transparent 25%, transparent 75%, #e2609f0a 75%) 0 0 / 48px 48px,
    linear-gradient(45deg, #e2609f0a 25%, transparent 25%, transparent 75%, #e2609f0a 75%) 24px 24px / 48px 48px,
    radial-gradient(700px 420px at 60% -10%, #ffd7ec38, transparent 70%);
}
body[data-dsh-remiel][data-ds-dark-theme] .P3OORG_panelBody {
  background:
    linear-gradient(45deg, #f286b60f 25%, transparent 25%, transparent 75%, #f286b60f 75%) 0 0 / 48px 48px,
    linear-gradient(45deg, #f286b60f 25%, transparent 25%, transparent 75%, #f286b60f 75%) 24px 24px / 48px 48px,
    radial-gradient(700px 420px at 60% -10%, #f286b61f, transparent 70%);
}

/* ---------- tab strip: a rose valance with a gold hairline ---------- */
body[data-dsh-remiel] [data-dockkit-strip] {
  background: linear-gradient(180deg, #fdf6fad9, #fbe9f3cc);
  backdrop-filter: blur(12px) saturate(1.05);
  -webkit-backdrop-filter: blur(12px) saturate(1.05);
  border-bottom: 1px solid #f0bcd6;
  box-shadow: inset 0 -1px #d9b36a40;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-dockkit-strip] {
  background: linear-gradient(180deg, #261c2fd9, #2e2038d1);
  border-bottom-color: #e2609f59;
  box-shadow: inset 0 -1px #d9b36a59;
}
body[data-dsh-remiel] [data-dockkit-tab] {
  color: #96607e;
  border-radius: 10px 10px 0 0;
}
body[data-dsh-remiel] [data-dockkit-tab]:hover {
  background: #e2609f1f;
  color: #cf4289;
}
body[data-dsh-remiel] [data-dockkit-tab][aria-selected=true] {
  color: #b03a78;
  background: #fffdfecc;
  box-shadow: inset 0 -2px #e2609f, inset 0 1px #ffffffb3;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-dockkit-tab] {
  color: #cdb6c6;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-dockkit-tab]:hover {
  background: #f286b624;
  color: #f286b6;
}
body[data-dsh-remiel][data-ds-dark-theme] [data-dockkit-tab][aria-selected=true] {
  color: #f4c9dd;
  background: #382642e6;
  box-shadow: inset 0 -2px #f286b6, inset 0 1px #ffffff1f;
}

/* ---------- panel icon buttons (collapse / presentation) ---------- */
body[data-dsh-remiel] .P3OORG_iconButton {
  color: #b76a94;
  border-radius: 10px;
}
body[data-dsh-remiel] .P3OORG_iconButton:hover {
  background: #e2609f1f;
  color: #cf4289;
}
body[data-dsh-remiel][data-ds-dark-theme] .P3OORG_iconButton {
  color: #d9a4c1;
}
body[data-dsh-remiel][data-ds-dark-theme] .P3OORG_iconButton:hover {
  background: #f286b624;
  color: #f286b6;
}
body[data-dsh-remiel] .P3OORG_unavailable {
  color: #8a6076;
}
body[data-dsh-remiel][data-ds-dark-theme] .P3OORG_unavailable {
  color: #cdb6c6;
}

/* ---------- 工作区文件 tab: rose-gold file rows (k-1LKG) ---------- */
body[data-dsh-remiel] .k-1LKG_root {
  color: #4a2a3a;
}
body[data-dsh-remiel] .k-1LKG_header {
  background: linear-gradient(90deg, #fdf0f7e6, #fdf0f755);
  border-bottom: 1px solid #f0bcd6;
}
body[data-dsh-remiel] .k-1LKG_pathDirectory {
  color: #b08ea1;
}
body[data-dsh-remiel] .k-1LKG_pathName {
  color: #8a4b6c;
  font-weight: 600;
}
body[data-dsh-remiel] .k-1LKG_tool {
  color: #b76a94;
  border-radius: 9px;
}
body[data-dsh-remiel] .k-1LKG_tool:hover {
  background: #e2609f24;
  color: #cf4289;
}
body[data-dsh-remiel] .k-1LKG_item {
  border-radius: 9px;
}
body[data-dsh-remiel] .k-1LKG_row:hover {
  background: #e2609f1f;
}
body[data-dsh-remiel] .k-1LKG_name {
  color: #4a2a3a;
}
body[data-dsh-remiel] .k-1LKG_note,
body[data-dsh-remiel] .k-1LKG_status {
  color: #8a6076;
}
body[data-dsh-remiel] .k-1LKG_fileIcon {
  color: #c2568e;
}
body[data-dsh-remiel] .k-1LKG_titleIcon {
  color: #c2568e;
}
/* indent guides: a faint rose-gold thread down each level rail */
body[data-dsh-remiel] .k-1LKG_level {
  box-shadow: inset 1px 0 #e2609f33;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_root {
  color: #f5e9f1;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_header {
  background: linear-gradient(90deg, #332540cc, #33254055);
  border-bottom-color: #e2609f59;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_pathDirectory {
  color: #a68fa0;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_pathName {
  color: #f4c9dd;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_tool {
  color: #d9a4c1;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_tool:hover {
  background: #f286b624;
  color: #f286b6;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_row:hover {
  background: #f286b629;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_name {
  color: #f5e9f1;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_note,
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_status {
  color: #cdb6c6;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_fileIcon,
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_titleIcon {
  color: #f286b6;
}
body[data-dsh-remiel][data-ds-dark-theme] .k-1LKG_level {
  box-shadow: inset 1px 0 #f286b640;
}

/* ---------- guide hero: her programme cards (geFEbW) ---------- */
body[data-dsh-remiel] .geFEbW_guide {
  color: #4a2a3a;
}
body[data-dsh-remiel] .geFEbW_titleIcon {
  color: #d9a05b;
}
body[data-dsh-remiel] .geFEbW_entry {
  background: #fffdfeb3;
  border: 1px solid #f2d7e6;
  border-radius: 14px 14px 14px 6px;
}
body[data-dsh-remiel] .geFEbW_entry:hover {
  background: #fdf0f7;
  border-color: #f0bcd6;
  box-shadow: 0 6px 16px #e2609f1f;
}
body[data-dsh-remiel] .geFEbW_entryTitle {
  color: #8a4b6c;
}
body[data-dsh-remiel] .geFEbW_entryDescription {
  color: #8a6076;
}
body[data-dsh-remiel] .geFEbW_entryIcon {
  color: #c2568e;
}
body[data-dsh-remiel][data-ds-dark-theme] .geFEbW_guide {
  color: #f5e9f1;
}
body[data-dsh-remiel][data-ds-dark-theme] .geFEbW_titleIcon {
  color: #e2c489;
}
body[data-dsh-remiel][data-ds-dark-theme] .geFEbW_entry {
  background: #32264099;
  border-color: #5b4567;
}
body[data-dsh-remiel][data-ds-dark-theme] .geFEbW_entry:hover {
  background: #3a2a49;
  border-color: #e2609f59;
  box-shadow: 0 8px 18px #00000040;
}
body[data-dsh-remiel][data-ds-dark-theme] .geFEbW_entryTitle {
  color: #f4c9dd;
}
body[data-dsh-remiel][data-ds-dark-theme] .geFEbW_entryDescription {
  color: #cdb6c6;
}
body[data-dsh-remiel][data-ds-dark-theme] .geFEbW_entryIcon {
  color: #f286b6;
}

/* ---------- every button in her right column answers in rose ---------- */
body[data-dsh-remiel] :is([data-rightbar-col], [data-dockkit-pane], :has(> .P3OORG_panel)) button:hover {
  background: #e2609f1f;
}
body[data-dsh-remiel][data-ds-dark-theme] :is([data-rightbar-col], [data-dockkit-pane], :has(> .P3OORG_panel)) button:hover {
  background: #f286b629;
}

/* ============================================================
   v0.3.8 · 左侧工作区 — the workspace browser (left sidebar)
   diag proved the workspace lives LEFT (.bhn1Oq_root, ws:1) while the
   right track was a closed 1px slot; this block themes where the user
   actually looks. targets = shipped css-module maps: hHd-Xa_* (sidebar
   shell chrome), bhn1Oq_* (browser chrome: headers/search/empty/list),
   YDXeBa_* (workspace & session rows, hover card, search results),
   all body-scoped, light + dark.
   ============================================================ */

/* ---------- sidebar shell chrome: brand & nav ---------- */
body[data-dsh-remiel] .hHd-Xa_brandName {
  color: #b03a78;
  letter-spacing: 0.04em;
}
body[data-dsh-remiel] .hHd-Xa_brand,
body[data-dsh-remiel] .hHd-Xa_brandIdentity {
  color: #8a4b6c;
}
body[data-dsh-remiel] .hHd-Xa_logoRow,
body[data-dsh-remiel] .hHd-Xa_brandMark {
  color: #d9a05b;
}
body[data-dsh-remiel] .hHd-Xa_buildVersion,
body[data-dsh-remiel] .hHd-Xa_localBuildBrand {
  color: #b08ea1;
}
body[data-dsh-remiel] .hHd-Xa_newSession {
  box-shadow: 0 4px 12px #e2609f33;
}
body[data-dsh-remiel] .hHd-Xa_panelRow {
  border-radius: 10px;
}
body[data-dsh-remiel] .hHd-Xa_panelRow:hover {
  background: #e2609f1f;
}
body[data-dsh-remiel] .hHd-Xa_panelActive {
  background: #fffdfeb3;
  box-shadow: inset 2px 0 #e2609f;
  border-radius: 10px;
}
body[data-dsh-remiel] .hHd-Xa_panelTitle {
  color: #8a4b6c;
  font-weight: 600;
}
body[data-dsh-remiel] .hHd-Xa_panelGlyph,
body[data-dsh-remiel] .hHd-Xa_panelIcon {
  color: #c79a4e;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_brandName {
  color: #f4c9dd;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_brand,
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_brandIdentity {
  color: #cdb6c6;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_logoRow,
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_brandMark {
  color: #e2c489;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_buildVersion,
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_localBuildBrand {
  color: #a68fa0;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_newSession {
  box-shadow: 0 4px 14px #f286b626;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_panelRow:hover {
  background: #f286b624;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_panelActive {
  background: #453056b3;
  box-shadow: inset 2px 0 #f286b6;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_panelTitle {
  color: #f4c9dd;
}
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_panelGlyph,
body[data-dsh-remiel][data-ds-dark-theme] .hHd-Xa_panelIcon {
  color: #e2c489;
}

/* ---------- browser chrome: gold section labels, rose search ---------- */
body[data-dsh-remiel] .bhn1Oq_sectionHeader {
  background: linear-gradient(90deg, #e2609f14, transparent 72%);
}
body[data-dsh-remiel] .bhn1Oq_sectionLabel {
  color: #b98a3f;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-shadow: 0 1px 2px #e2609f2e;
}
body[data-dsh-remiel] .bhn1Oq_search:hover,
body[data-dsh-remiel] .bhn1Oq_searchExpanded {
  border-color: #f0bcd6;
}
body[data-dsh-remiel] .bhn1Oq_searchExpanded {
  /* v0.4.3: was a background SHORTHAND — it reset background-image to none
     and silently murdered the wings (same specificity, later in file) */
  background-color: #fffdfe80;
}
body[data-dsh-remiel] .bhn1Oq_empty {
  border: 1px dashed #e8bcd4;
  border-radius: 12px;
  margin: 8px 4px;
  text-align: center;
  color: #8a6076;
  background-color: #fffdfe59;
}
body[data-dsh-remiel] .bhn1Oq_renameInput,
body[data-dsh-remiel] .bhn1Oq_deleteStatus {
  color: #8a6076;
}
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_sectionHeader {
  background: linear-gradient(90deg, #f286b61a, transparent 72%);
}
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_sectionLabel {
  color: #e2c489;
  text-shadow: 0 1px 2px #f286b633;
}
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_search:hover,
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_searchExpanded {
  border-color: #e2609f59;
}
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_searchExpanded {
  background-color: #241a2d80;
}
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_empty {
  border-color: #e2609f4d;
  color: #cdb6c6;
  background-color: #31244059;
}
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_renameInput,
body[data-dsh-remiel][data-ds-dark-theme] .bhn1Oq_deleteStatus {
  color: #cdb6c6;
}

/* ---------- rows: velvet rose list with a gold selection bar ---------- */
body[data-dsh-remiel] .YDXeBa_sessionRow,
body[data-dsh-remiel] .YDXeBa_projectRow,
body[data-dsh-remiel] .YDXeBa_searchResultRow {
  border-radius: 10px;
}
body[data-dsh-remiel] .YDXeBa_sessionRow:hover,
body[data-dsh-remiel] .YDXeBa_projectRow:hover,
body[data-dsh-remiel] .YDXeBa_searchResultRow:hover {
  background: #e2609f1f;
}
body[data-dsh-remiel] .YDXeBa_selected {
  background: #fffdfecc;
  box-shadow: inset 2.5px 0 #e2609f;
}
body[data-dsh-remiel] .YDXeBa_title {
  color: #4a2a3a;
  font-weight: 500;
}
body[data-dsh-remiel] .YDXeBa_meta,
body[data-dsh-remiel] .YDXeBa_time,
body[data-dsh-remiel] .YDXeBa_hoverTime,
body[data-dsh-remiel] .YDXeBa_hoverPath,
body[data-dsh-remiel] .YDXeBa_hoverStatus,
body[data-dsh-remiel] .YDXeBa_searchResultMeta,
body[data-dsh-remiel] .YDXeBa_searchResultSnippet,
body[data-dsh-remiel] .YDXeBa_searchResultWorkspace {
  color: #8a6076;
}
body[data-dsh-remiel] .YDXeBa_searchResultHeading,
body[data-dsh-remiel] .YDXeBa_searchResultTitle {
  color: #8a4b6c;
  font-weight: 600;
}
body[data-dsh-remiel] .YDXeBa_folder {
  color: #c2568e;
}
body[data-dsh-remiel] .YDXeBa_folderActive {
  color: #b98a3f;
  background: #e2609f14;
  border-radius: 8px;
}
body[data-dsh-remiel] .YDXeBa_chevron,
body[data-dsh-remiel] .YDXeBa_arrow,
body[data-dsh-remiel] .YDXeBa_arrowOpen {
  color: #b98aa6;
}
body[data-dsh-remiel] .YDXeBa_scheduleIndicator {
  color: #b98a3f;
}
body[data-dsh-remiel] .YDXeBa_hoverContent {
  background: #fdf6faf2;
  border: 1px solid #f0bcd6;
  border-radius: 12px;
  box-shadow: 0 10px 24px #e2609f26;
}
body[data-dsh-remiel] .YDXeBa_renameInput {
  background: #fffdfe;
  border: 1px solid #e2609f66;
  border-radius: 8px;
  color: #4a2a3a;
  outline-color: #e2609fa6;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_sessionRow:hover,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_projectRow:hover,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_searchResultRow:hover {
  background: #f286b629;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_selected {
  background: #453056cc;
  box-shadow: inset 2.5px 0 #f286b6;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_title {
  color: #f5e9f1;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_meta,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_time,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_hoverTime,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_hoverPath,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_hoverStatus,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_searchResultMeta,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_searchResultSnippet,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_searchResultWorkspace {
  color: #cdb6c6;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_searchResultHeading,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_searchResultTitle {
  color: #f4c9dd;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_folder {
  color: #f286b6;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_folderActive {
  color: #e2c489;
  background: #f286b61a;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_chevron,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_arrow,
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_arrowOpen {
  color: #a68fa0;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_scheduleIndicator {
  color: #e2c489;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_hoverContent {
  background: #312440f2;
  border-color: #e2609f4d;
  box-shadow: 0 10px 24px #00000059;
}
body[data-dsh-remiel][data-ds-dark-theme] .YDXeBa_renameInput {
  background: #241a2d;
  border-color: #f286b666;
  color: #f5e9f1;
  outline-color: #f286b6b3;
}

/* ============================================================
   蕾米埃尔 — the companion figure at the right edge
   ============================================================ */
.remiel-art {
  position: fixed;
  right: 12px;
  bottom: 0;
  z-index: 60;
  height: min(64vh, 660px);
  aspect-ratio: 1091 / 1400; /* 影池独舞·泳装 full art cutout (v0.3.6) */
  pointer-events: none;
  user-select: none;
  background: var(--remiel-art) right bottom / contain no-repeat;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 16%);
  mask-image: linear-gradient(to right, transparent, #000 16%);
  filter: drop-shadow(0 10px 30px rgba(226, 96, 159, 0.30));
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
/* v0.3.6b: 用户反馈暗版太小 → 与明版同高，宽度按横版比例自动
   v0.4.9→v0.4.11: 56vh/560（缩小）→ 用户要求「改成原来的」回退 64vh/660 */
body[data-dsh-remiel][data-ds-dark-theme] .remiel-art {
  background-image: var(--remiel-art-dark);
  aspect-ratio: 1600 / 1002; /* 月夜密语 full art cutout (v0.3.6, 横版) */
  width: auto;
  height: min(64vh, 660px);
  filter: drop-shadow(0 10px 30px rgba(157, 122, 217, 0.34));
}
body[data-dsh-remiel] .remiel-art.is-visible {
  opacity: 0.96 !important;
  transform: none;
}
/* active conversation → fade to a watermark behind the reading column
   v0.3.9: !important shields these from any stray inline opacity (the old
   diag's forced reveal used to pin her at 0.96 and she never blended back)
   v0.4.13: hero（新会话空态）与 settling 同样入列——hero 卡片宽、右缘正好钻
   立绘射程，0.96 全亮会盖住视野（用户实报「新会话立绘在表层」） */
body[data-dsh-remiel]:has([data-phase=active]) .remiel-art,
body[data-dsh-remiel][data-phase=active] .remiel-art,
body[data-dsh-remiel]:has([data-phase=hero]) .remiel-art,
body[data-dsh-remiel]:has([data-phase=settling]) .remiel-art {
  opacity: 0.42 !important;
  transform: none;
  filter: drop-shadow(0 6px 20px rgba(226, 96, 159, 0.30));
}
/* settings overlay handled above (v0.3.0) */
/* settings note (v0.3.0): DSH keeps [data-slot="sidebar.settings"] in the DOM at all
   times, so the old ":has(settings) -> opacity 0" rule pinned her at zero forever
   (root cause of the v0.1.3 "opacity: 0" report). Dialogs paint at z ~940 — already
   above the art (z 60) — so no hide rule is needed. */
/* small viewports → make room for the UI */
@media (width <= 720px) {
  .remiel-art {
    height: min(40vh, 340px);
    right: 4px;
  }
  body[data-dsh-remiel][data-ds-dark-theme] .remiel-art {
    width: min(84vw, 440px);
    height: auto;
  }
}
@media (width <= 520px) {
  .remiel-art {
    display: none;
  }
}

/* ---------- honor reduced motion (no animations are added, kept for safety) ---------- */
@media (prefers-reduced-motion: reduce) {
  body[data-dsh-remiel] * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
`.replace("__ART_URI__", ART).replace("__ART_DARK_URI__", ART_DARK)
			.replace("__WM_LIGHT_URI__", artAsset(Q_WM_LIGHT))
			.replace("__WM_DARK_URI__", artAsset(Q_WM_DARK))
			.replace("__Q_CORNER_URI__", artAsset(Q_CORNER_LIGHT))
			.replace("__Q_CORNER_DARK_URI__", artAsset(Q_CORNER_DARK));

		/** Stamp the skin scope and mount the companion figure, idempotently. */
		function mount() {
			if (typeof document === "undefined" || !document.body) return;
			if (document.querySelector('style[data-plugin-css="' + TAG + '"]') === null) {
				const style = document.createElement("style");
				style.setAttribute("data-plugin-css", TAG);
				style.setAttribute("data-skin-version", "v0.4.16");
				style.textContent = CSS;
				document.head.appendChild(style);
			}
			if (!document.body.hasAttribute("data-dsh-remiel")) {
				document.body.setAttribute("data-dsh-remiel", "");
			}
			if (document.querySelector(".remiel-scene") === null) {
				const scene = document.createElement("div");
				scene.className = "remiel-scene";
				scene.setAttribute("aria-hidden", "true");
				const sceneAsset = (file) => new URL("skin-assets/remiel/" + file + "?v=0.4.16", document.baseURI).href;
				scene.style.setProperty("--remiel-scene-dark", 'url("' + sceneAsset(SCENE_DARK) + '")');
				scene.style.setProperty("--remiel-scene-light", 'url("' + sceneAsset(SCENE_LIGHT) + '")');
				// v0.3.3: 整画层（contain 居中，人物完整入画）；::before 模糊垫底，::after 罩纱
				const artLayer = document.createElement("div");
				artLayer.className = "remiel-scene-art";
				artLayer.setAttribute("aria-hidden", "true");
				scene.appendChild(artLayer);
				document.body.appendChild(scene);
			}
			if (document.querySelector("." + ART_CLASS) === null) {
				const art = document.createElement("div");
				art.className = ART_CLASS;
				art.setAttribute("aria-hidden", "true");
				document.body.appendChild(art);
				// enter on the next frame so the opacity transition can play
				requestAnimationFrame(() => requestAnimationFrame(() => art.classList.add("is-visible")));
				setTimeout(() => art.classList.add("is-visible"), 300);
				/* v0.4.11: 跟随锚定按用户要求整体回退（v0.4.9/v0.4.10 两版）——
				   立绘回到原生 right:12px 静态锚 + 原尺寸 64vh/660，不再注入 JS 位移 */
				console.info("[dsh-remiel-skin] v0.4.16 mounted — corner swapped to Q版大头 (box contain), corners = Q版大头, URLs ?v=0.4.16");
				// v0.3.7b: right-column census runs 0.7s after mount and is also
				// reachable by hand — window.__remielDiag() — after opening the
				// right sidebar (the auto probe fires while it may still be closed).
				setTimeout(() => runDiag(art), 700);
			}
		}

		/** v0.3.7b: ancestor chain at a viewport point (what actually sits on the right). */
		function pathAt(x, y) {
			const out = [];
			let el = document.elementFromPoint(x, y);
			while (el && out.length < 7) {
				let cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
				out.push(el.tagName.toLowerCase() + (cls ? "." + cls : ""));
				el = el.parentElement;
			}
			return out;
		}

		/** v0.3.7b: art health + right workspace column census (auto after mount, or manual via window.__remielDiag()). */
		function runDiag(art) {
			try {
				const r = art.getBoundingClientRect();
				const cs = getComputedStyle(art);
				const q = (s) => document.querySelectorAll(s).length;
				const first = (s) => document.querySelector(s);
				const bg = (s) => { const el = first(s); return el ? getComputedStyle(el).backgroundImage.slice(0, 110) : null; };
				const skin = first('style[data-skin-version]');
				const col = first("[data-rightbar-col]");
				const kids = [];
				if (col) {
					const seen = {};
					const all = col.querySelectorAll("*");
					for (let i = 0; i < all.length && kids.length < 14; i++) {
						const cn = typeof all[i].className === "string" ? all[i].className.trim().split(/\s+/)[0] : "";
						if (cn && !seen[cn]) { seen[cn] = 1; kids.push(cn); }
					}
				}
				const info = {
					v: "v0.4.16",
					win: [innerWidth, innerHeight],
					rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
					opacity: cs.opacity,
					z: cs.zIndex,
					display: cs.display,
					cls: art.className,
					settingsSlot: !!document.querySelector('[data-slot="sidebar.settings"]'),
					scene: !!document.querySelector(".remiel-scene"),
					phase: (function () { const p = document.querySelector("[data-phase]"); return p ? p.getAttribute("data-phase") : null; })(),
					artInline: art.style.opacity || "",
					fillVar: (getComputedStyle(document.body).getPropertyValue("--dsw-specific-sidebar-fill") || "").trim(),
					root: (function () {
						const r = document.querySelector(".hHd-Xa_root");
						if (!r) return null;
						const cs = getComputedStyle(r);
						return { pos: cs.position, z: cs.zIndex, bgLen: cs.backgroundImage.length, radius: cs.borderRadius, bs: cs.boxShadow.slice(0, 60) };
					})(),
					comp: (function () {
						const c = document.querySelector("[data-composer-card]");
						if (!c) return null;
						const bf = getComputedStyle(c, "::before");
						const af = getComputedStyle(c, "::after");
						const clips = [];
						for (let el = c.parentElement; el && clips.length < 4; el = el.parentElement) {
							const s = getComputedStyle(el);
							if (s.overflow !== "visible") clips.push((String(el.className).slice(0, 24) || el.tagName) + ":" + s.overflow);
						}
						const cr = c.getBoundingClientRect();
						const col = document.querySelector(".pI_x6G_centerCol");
						const gap = col ? Math.round(cr.left - col.getBoundingClientRect().left) : -1;
						return { before: bf.backgroundImage.length, after: af.backgroundImage.length, gap: gap, cardW: Math.round(cr.width), clips: clips };
					})(),
					search: (function () {
						const s = document.querySelector(".bhn1Oq_searchExpanded") || document.querySelector(".bhn1Oq_search") || document.querySelector("[class*=search]");
						if (!s) return null;
						const cs = getComputedStyle(s);
						const r = s.getBoundingClientRect();
						return { cls: String(s.className).slice(0, 70), rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], ov: cs.overflow, bg: cs.backgroundImage.length };
					})(),
					header: (function () {
						const h = document.querySelector(".bhn1Oq_sectionHeader");
						if (!h) return null;
						const cs = getComputedStyle(h);
						const r = h.getBoundingClientRect();
						return { rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], ov: cs.overflow };
					})(),
					right: {
						col: q("[data-rightbar-col]"),
						colRect: col ? (function (b) { return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; })(col.getBoundingClientRect()) : null,
						panel: q(".P3OORG_panel"),
						panelBody: q(".P3OORG_panelBody"),
						panelBg: bg(".P3OORG_panel"),
						cssHasPanel: !!skin && skin.textContent.indexOf("P3OORG_panel") >= 0,
						cssHasRightbar: !!skin && skin.textContent.indexOf("data-rightbar-col") >= 0,
						strip: q("[data-dockkit-strip]"),
						dockTab: q("[data-dockkit-tab]"),
						files: q(".k-1LKG_root"),
						guide: q(".geFEbW_guide"),
						ws: q(".bhn1Oq_root"),
						colKids: kids,
						topRight: pathAt(innerWidth - 60, 140),
						midRight: pathAt(innerWidth - 60, Math.round(innerHeight / 2))
					}
				};
				// v0.3.9: never pin an inline opacity — it beats the phase rules and
				// froze her at 0.96 over conversations. Reveal by class instead; the
				// .is-visible / [data-phase=active] rules (both !important) decide the blend.
				if (cs.opacity === "0") {
					art.classList.add("is-visible");
					art.style.removeProperty("opacity");
					info.forced = true;
				}
				console.info("[dsh-remiel-skin] diag " + JSON.stringify(info));
				return info;
			} catch (e) {
				console.info("[dsh-remiel-skin] diag failed: " + e);
				return null;
			}
		}

		/** Manual re-probe: open the right sidebar first, then run this in the console. */
		if (typeof window !== "undefined") {
			window.__remielDiag = function () {
				const a = document.querySelector("." + ART_CLASS);
				return a ? runDiag(a) : null;
			};
		}

		/** Cordis browser-plugin entry: run once the document is ready. */
		function apply() {
			if (typeof document === "undefined") return;
			if (document.body) mount();
			else document.addEventListener("DOMContentLoaded", mount, { once: true });
		}

		exports.apply = apply;
		return module.exports;
	}
});
