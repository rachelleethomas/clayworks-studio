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
function cwRenderUser() {
  const box = document.getElementById("cwUser"); if (!box) return; box.textContent = "";
  if (!CW.me) return;
  const m = CW.me, capTxt = m.cap == null ? `$${m.spent.toFixed(2)} this week` : `$${m.spent.toFixed(2)} of $${m.cap} this week`;
  const meter = el("span", { class: "cw-meter" });
  if (m.cap != null) { const f = el("i"); f.style.width = Math.min(100, (m.spent / m.cap) * 100) + "%"; if (m.spent >= m.cap) f.className = "full"; meter.append(f); }
  box.append(...[el("b", { text: m.user }), m.cap != null ? meter : null, el("span", { text: capTxt, title: m.cap != null ? "Resets " + m.resetLabel : "" }),
    el("button", { type: "button", class: "linkbtn", text: "Log out", onclick: () => cwLogout() })].filter(Boolean));
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
  if (!CW.token) { cwShowLogin(); return; }
  try { CW.me = await cwApi("/me"); cwRenderUser(); cwPullStudio(); } catch { if (!CW.token) return; cwShowLogin("Couldn't reach the server. Check your connection and log in."); }
})();
