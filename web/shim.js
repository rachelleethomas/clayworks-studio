/* ---------- Clayworks login + Claude bridge (GitHub Pages build) ---------- */
const API_BASE = "__API_BASE__";
const CW = { token: null, me: null };
try { CW.token = localStorage.getItem("cw-token"); } catch {}
async function cwApi(path, opts = {}) {
  const r = await fetch(API_BASE + path, { ...opts, headers: { "Content-Type": "application/json", ...(CW.token ? { Authorization: "Bearer " + CW.token } : {}), ...(opts.headers || {}) } });
  let body = {}; try { body = await r.json(); } catch {}
  if (r.status === 401 && path !== "/login") { cwLogout("Your login expired. Log in again."); }
  if (!r.ok) throw { code: body.code || (r.status === 429 ? "cap_reached" : "error"), message: body.error || "Something went wrong.", ...body };
  return body;
}
const blobToB64 = b => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res({ type: b.type || "image/jpeg", data: String(fr.result).split(",")[1] }); fr.onerror = rej; fr.readAsDataURL(b); });
async function shrink(blob) { // keep uploads small: max 1400px JPEG
  try {
    const img = await createImageBitmap(blob); const s = Math.min(1, 1400 / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(r, "image/jpeg", 0.85)) || blob;
  } catch { return blob; }
}
async function cwSample(input, opts = {}) {
  if (!CW.token) throw { code: "not_granted", message: "Log in to use Claude features." };
  const prompt = typeof input === "string" ? input : input.map(m => m.content).join("\n\n");
  const images = await Promise.all((opts.images || []).slice(0, 2).map(async b => blobToB64(await shrink(b))));
  const res = await cwApi("/claude", { method: "POST", body: JSON.stringify({ prompt, images, task: opts.modelTier === "complex" ? "recipe" : "default" }) });
  CW.me = res; cwRenderUser();
  return { text: res.text, truncated: res.truncated };
}
cwSample.json = async (input, opts = {}) => {
  const ask = (typeof input === "string" ? input : input.map(m => m.content).join("\n\n")) + "\n\nRespond with only the JSON, no other text.";
  const { text } = await cwSample(ask, opts);
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  try { return JSON.parse(text.slice(a, b + 1)); } catch { throw { code: "bad_json", message: "Claude's answer couldn't be read. Try again." }; }
};
cwSample.limits = async () => ({ images: true });
window.claude = { use: async name => (name === "sample" ? cwSample : null) };

/* shelves sync */
let cwSyncTimer = null;
function cwQueueSync() {
  if (!CW.token) return;
  clearTimeout(cwSyncTimer);
  cwSyncTimer = setTimeout(() => cwApi("/studio", { method: "PUT", body: JSON.stringify({ items: allDocs() }) }).catch(e => flash("Couldn't sync shelves. " + e.message)), 600);
}
async function cwPullStudio() {
  try {
    const { items } = await cwApi("/studio");
    if (items.length) { splitDocs(items); try { localStorage.setItem("stainlab-studio", JSON.stringify(allDocs())); } catch {} }
    else if (allDocs().length) cwQueueSync();
    renderAll();
  } catch {}
}

/* login UI */
document.addEventListener("click", () => CW.closeMenu && CW.closeMenu());
document.addEventListener("keydown", e => { if (e.key === "Escape" && CW.closeMenu) CW.closeMenu(true); });
function cwRenderUser(open = false) {
  const box = document.getElementById("cwUser"); if (!box) return; box.textContent = ""; CW.closeMenu = null;
  if (!CW.me) return;
  const m = CW.me, initial = (m.user || "?").slice(0, 1).toUpperCase();
  const avatar = (tag, props = {}) => el(tag, { class: "cw-avatar", text: initial, ...props });
  const btn = avatar("button", { type: "button", "aria-haspopup": "true", "aria-expanded": "false", "aria-label": "Account: " + m.user, title: m.user });
  const spend = el("div", { class: "cw-spend" }, el("span", { class: "lbl", text: "Spent this week" }),
    el("div", { class: "amt" }, "$" + m.spent.toFixed(2), m.cap != null ? el("span", { text: "of $" + Number(m.cap).toFixed(2) }) : el("span", { text: "no weekly limit" })));
  if (m.cap != null) {
    const meter = el("span", { class: "cw-meter" }), f = el("i");
    f.style.width = Math.min(100, (m.spent / m.cap) * 100) + "%"; if (m.spent >= m.cap) f.className = "full"; meter.append(f);
    spend.append(meter, el("span", { class: "note", text: m.spent >= m.cap ? "Limit reached. Resets " + m.resetLabel + "." : "Resets " + m.resetLabel + "." }));
  }
  const menu = el("div", { class: "cw-menu", role: "dialog", "aria-label": "Account", hidden: true },
    el("div", { class: "who" }, avatar("span", { "aria-hidden": "true" }), el("div", {}, el("b", { text: m.user }), el("small", { text: "Signed in" }))),
    spend,
    typeof layoutMenu === "function" ? layoutMenu() : null,
    el("button", { type: "button", class: "ghost out", text: "Log out", onclick: () => cwLogout() }));
  const setOpen = o => { menu.hidden = !o; btn.setAttribute("aria-expanded", String(o)); };
  CW.closeMenu = refocus => { if (menu.hidden) return; setOpen(false); if (refocus) btn.focus(); };
  btn.onclick = e => {
    e.stopPropagation(); const o = menu.hidden; setOpen(o);
    if (o) cwApi("/me").then(me => { if (menu.hidden) return; CW.me = me; cwRenderUser(true); }).catch(() => {}); // fresh spend
  };
  menu.onclick = e => e.stopPropagation();
  box.append(btn, menu);
  if (open) setOpen(true);
}
function cwLogout(msg) {
  CW.token = null; CW.me = null; try { localStorage.removeItem("cw-token"); localStorage.removeItem("stainlab-studio"); } catch {}
  studio = []; recipes = []; renderAll(); cwRenderUser(); cwShowLogin(msg);
}
function cwShowLogin(msg) {
  document.getElementById("cwLogin").hidden = false; document.querySelector(".wrap").setAttribute("inert", "");
  document.getElementById("cwMsg").textContent = msg || ""; setTimeout(() => document.getElementById("cwName").focus(), 50);
}
function cwHideLogin() { document.getElementById("cwLogin").hidden = true; document.querySelector(".wrap").removeAttribute("inert"); }
document.getElementById("cwForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = e.target.querySelector("button"); btn.disabled = true; document.getElementById("cwMsg").textContent = "";
  try {
    const res = await cwApi("/login", { method: "POST", body: JSON.stringify({ user: document.getElementById("cwName").value, password: document.getElementById("cwPass").value }) });
    CW.token = res.token; CW.me = res; try { localStorage.setItem("cw-token", res.token); } catch {}
    document.getElementById("cwPass").value = ""; cwHideLogin(); cwRenderUser(); await cwPullStudio();
  } catch (err) { document.getElementById("cwMsg").textContent = err.message; }
  finally { btn.disabled = false; }
});
(async () => {
  // Local dev: the mock worker hands out a session, so no login screen. Add ?login to the URL to see it anyway.
  if (!CW.token && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(API_BASE) && !/[?&]login\b/.test(location.search)) {
    try { const res = await cwApi("/dev-login"); CW.token = res.token; try { localStorage.setItem("cw-token", res.token); } catch {} } catch {}
  }
  if (!CW.token) { cwShowLogin(); return; }
  try { CW.me = await cwApi("/me"); cwRenderUser(); cwPullStudio(); } catch { if (!CW.token) return; cwShowLogin("Couldn't reach the server. Check your connection and log in."); }
})();
