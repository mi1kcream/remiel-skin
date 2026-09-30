/**
 * dsh-remiel-skin — node half.
 *
 * Serves the packaged scene backdrops and figure cutouts (assets/scenes/*.webp)
 * under a fixed, immutable URL prefix while the skin is enabled. The allowlist
 * is exactly the twenty sha256 file names below — nothing else on disk is
 * reachable.
 */
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

/**
 * Registered route path — must NOT end in a slash (v0.3.1 fix). The host
 * matcher accepts only `p` or `p/<anything>` (`pathname.startsWith(prefix + "/")`),
 * so registering "/skin-assets/remiel/" matched only the literal path and every
 * real file fell through to the SPA 404.
 */
const ROUTE = "/skin-assets/remiel";
/** File-name slice prefix: full request path minus this yields the allowlist key. */
const PREFIX = ROUTE + "/";
const FILES = new Map([
	// v0.3.5: user-picked scenes — dark #01 wa_01 (8000×4496 4K), light #10 wa_11 (4264×2400 4K)
	["d65ae2a9b96e991e9ff15756d412010bbf688360e8d41534b65a64fb513820e7.webp", "image/webp"], // dark
	["6bde8dafefff631d291d6501fcf69224d88acdd3b1379aae8683367c593a3ec6.webp", "image/webp"], // light
	// v0.4.12: 用户点单场景换装 — 明=i2i球厅00035（浅亮调）、暗=复现00046（深调）；
	// 旧 wa_01/wa_11 退居备用（仍留在白名单）
	["79b4bffd91f3f1a2ea95a163b8a13d83402a7d37616a614d77da1a4994877f40.webp", "image/webp"], // light (v0.4.12)
	["ea160e63ab2a42e26e95efc81d3fc2e8d3f81d14afe151a2bc9d9077e6c9baec.webp", "image/webp"], // dark (v0.4.12)
	// v0.3.4: 影画展示 landscape banners (spare — SCENE_LIGHT_ALT → 13843d…)
	["e0084f3508fc22d8f9b26d49f3dcfaa75997fa33b036dcf0fc14ebf40a21d6e3.webp", "image/webp"], // light
	["25658420c565e527c3c466afee387707a8a2be12e7ca85766487aed3551846cd.webp", "image/webp"], // dark
	["13843d3c30a14a329fd1b28de6ccf3d41a4138b4054b12b9a2011d7598a69eb1.webp", "image/webp"], // spare light
	// v0.3.6: full-art figure cutouts (light 影池独舞泳装 1091×1400 / dark 月夜密语 1600×1002)
	["275aa65ec784253c3e4fb4fe63f835f082f389a90d4a63feba27669463a84672.webp", "image/webp"],
	["ec7c6cd2785738d4ab1d3757ec5512edb61177ea42424e44a0237b425149ca1f.webp", "image/webp"],
	// v0.4.5: Q版三连（中文名原件保留于目录、不可达；这里只认 hash 改名副本）
	["63d62a7bc65b004fe8184c25665ee95d8a96e5f513350c133f294e76d13a81ce.png", "image/png"], // 泳装Q版 · 对话框左下角(明)
	["b43086e9159b27349fdc4457539818f47301a3037af18946aae10e41622d50c9.png", "image/png"], // 白色Q版 · 工作区水印(明)
	["0e39a40d65cca5fd101f85822abdd40f7ad9048a07d66404c33a87fc0a9d3eea.png", "image/png"], // 黑色Q版 · 旧双役(暗，v0.4.10 退役)
	// v0.4.10: 用户手抠四连（泳装Q版1/白色Q版1/黑色Q版1/黑色Q版2，紧裁 hash 副本）
	["e457336b4c17cff657dd3547ef90b3421923ac5bc226a08773681759512ae23f.png", "image/png"], // 泳装Q版1 · 对话框左下角(明)
	["cb8df6100f42713fd483c777282c91bef476767601a803bca212d2c2019d0a87.png", "image/png"], // 白色Q版1 · 工作区水印(明)
	["ae439a4f5db7bed3c2cb5d3d577673e40e96a95742bce806d1db1bd9d65bda14.png", "image/png"], // 黑色Q版1 · 对话框左下角(暗)
	["c95f6e2599c56d3f9beb22d24dccec0a1046dac2bba7a0dc9c4936945d5d2db8.png", "image/png"], // 黑色Q版2 · 旧暗水印(v0.4.11 退役)
	// v0.4.16: 用户 Q版大头二连（泳装Q版大头/黑色Q版大头，BFS保域+alpha紧裁 hash 副本）→ 对话框左下角
	["1b805a40057f18ec4fe73f5b5ebd7eb30b37f0a0c2a17a5d96fe3a63b98eb6c9.png", "image/png"], // 泳装Q版大头 · 对话框左下角(明)
	["684512d8035c15cc09f068ff8f00a457bc0320313afc816b20cff5b0664d035a.png", "image/png"], // 黑色Q版大头 · 对话框左下角(暗)
	// retired full-figure splashes (were the v0.3.x "scenes"; kept allowlisted as
	// the cutout母本 for future re-cuts — no longer referenced by the client)
	["0b53eeb5cd30ffd624d0aad04b8eaf917e9322a0137e47822c905cccb1c9af00.webp", "image/webp"],
	["3924eb10c62998f5675d2978c6fa0dbd1a4a9dc431f91d6707428615ccc305f0.webp", "image/webp"]
]);
/* v0.4.7: was immutable-cached — content edits kept the SAME name-derived ETag,
   so If-None-Match kept answering 304 and the browser replayed stale white-bg
   PNGs even after Ctrl+F5 ("深色/工作区还是有白底"的真凶). Now: always revalidate
   (cheap 304 when unchanged) with an ETag derived from CONTENT (see handler). */
const IMMUTABLE = "no-cache";

/** @param {import('@deepseek-ai/cordis').Context} ctx */
export function apply(ctx) {
	ctx.inject(["webServer"], (webCtx) => {
		const server = webCtx.get("webServer");
		webCtx.effect(() =>
			server.register({
				kind: "prefix",
				path: ROUTE,
				handler: async (req, res) => {
					if (req.method !== "GET" && req.method !== "HEAD") {
						res.writeHead(405, { Allow: "GET, HEAD" }).end();
						return;
					}
					const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
					const file = pathname.slice(PREFIX.length);
					const type = !pathname.startsWith(PREFIX) ? undefined : FILES.get(file);
					if (type === undefined) {
						res.writeHead(404).end();
						return;
					}
					let bytes;
					try {
						bytes = await readFile(new URL("../assets/scenes/" + file, import.meta.url));
					} catch (error) {
						if (error.code !== "ENOENT") throw error;
						res.writeHead(404).end();
						return;
					}
					// v0.4.7: ETag = name + content hash — renames aside, in-place
					// asset edits now change the validator and bust the 304 loop
					const etag = '"' + file.split(".")[0] + "-" + createHash("sha256").update(bytes).digest("hex").slice(0, 16) + '"';
					const headers = {
						"Content-Type": type,
						"Cache-Control": IMMUTABLE,
						"X-Content-Type-Options": "nosniff",
						ETag: etag
					};
					const inm = req.headers["if-none-match"];
					if (inm && inm.split(",").some((v) => v.trim().replace(/^W\//, "") === etag || v.trim() === "*")) {
						res.writeHead(304, headers).end();
						return;
					}
					res.writeHead(200, { ...headers, "Content-Length": bytes.length });
					res.end(req.method === "HEAD" ? undefined : bytes);
				}
			}),
			"ui-skin-remiel: packaged scene backdrops"
		);
	});
}

export const name = "ui-skin-remiel";
