export default { title: "Foundations" };

const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const swatch = (name, note) => `
  <div style="display:grid;gap:6px;min-width:0">
    <div style="height:72px;border-radius:12px;border:1px solid var(--line);background:var(${name})"></div>
    <div style="font:600 13px var(--body)">${name}</div>
    <div class="meta" data-token="${name}" style="font:500 11.5px var(--mono);color:var(--muted)"></div>
    ${note ? `<div class="note">${note}</div>` : ""}
  </div>`;

const fillTokens = (root) => {
  requestAnimationFrame(() => root.querySelectorAll("[data-token]").forEach((n) => (n.textContent = token(n.dataset.token))));
  return root;
};
const section = (title, body) => `<section style="display:grid;gap:14px;margin-bottom:36px"><h2>${title}</h2>${body}</section>`;
const grid = (cols, body) => `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(${cols}px,1fr));gap:16px">${body}</div>`;
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html; return d; };

export const Colors = () => fillTokens(el(
  section("Surfaces and ink", grid(170, [
    swatch("--bg", "Page: warm paper"), swatch("--surface", "Cards and panels"), swatch("--line", "Hairlines"),
    swatch("--ink", "Text"), swatch("--muted", "Secondary text"),
  ].join(""))) +
  section("Accent and status", grid(170, [
    swatch("--accent", "Links, focus, key actions"), swatch("--hl", "Hover wash"),
    swatch("--ok", "On hand, proven"), swatch("--warn", "Needs, warnings"),
  ].join(""))) +
  section("Pastel tints (blocks and pills)", grid(170, [
    swatch("--tint-purple", "Empty states, active chips"), swatch("--tint-green", "On hand"), swatch("--tint-orange", "Shopping list, needs"),
    swatch("--tint-blue", "Notices, Glazy badge"), swatch("--tint-pink"), swatch("--tint-yellow"),
  ].join(""))) +
  `<p class="note">Switch Theme in the toolbar to see the dark values. Tokens are read live from the app's CSS.</p>`
));

export const Typography = () => el(`
  <div style="display:grid;gap:22px;max-width:900px">
    <div><span class="lbl">Display · var(--display) · Fraunces (soft) 400, -0.035em</span><h1 style="margin:6px 0 0">Discover</h1></div>
    <div><span class="lbl">Section heading · 28px</span><h2 style="margin:6px 0 0">Shopping list</h2></div>
    <div><span class="lbl">Card title · 20px display</span><div class="rcard" style="border:0;background:none"><div class="in" style="padding:0"><h4 style="margin:6px 0 0;font:500 20px/1.2 var(--display)">Satin Slate</h4></div></div></div>
    <div><span class="lbl">Body · var(--body) · Inter Tight 15.5px</span><p style="margin:6px 0 0;max-width:60ch">Drop in an inspiration photo or hex codes, pick your clay body and cone, and get recipes with gram weights for your batch.</p></div>
    <div><span class="lbl">Secondary · .note</span><p class="note" style="margin:6px 0 0">Recipes from Glazy contributors, shared under CC BY-NC-SA 4.0.</p></div>
    <div><span class="lbl">Label · .lbl · var(--mono) uppercase</span><div style="margin-top:6px"><span class="lbl">Batch (g dry)</span></div></div>
    <div><span class="lbl">Data · .meta · JetBrains Mono</span><div class="meta" style="margin-top:6px;font-family:var(--mono)">Glazy #3030 · cone 6 · semi-matte</div></div>
  </div>`);

export const ShapeAndElevation = () => el(
  section("Radius", grid(160, [
    ["Pill · 999px", "999px"], ["Card · var(--radius) 16px", "var(--radius)"], ["Control · var(--radius-sm) 10px", "var(--radius-sm)"], ["Swatch · 8px", "8px"],
  ].map(([l, r]) => `<div style="display:grid;gap:8px"><div style="height:64px;background:var(--surface);border:1px solid var(--line);border-radius:${r}"></div><span class="note">${l}</span></div>`).join(""))) +
  section("Elevation", grid(220, [
    ["Card: hairline + faint shadow", "0 1px 3px rgba(0,0,0,.04)"], ["Menu / popover", "0 18px 50px rgba(0,0,0,.14)"], ["Dialog", "0 30px 80px rgba(0,0,0,.18)"],
  ].map(([l, s]) => `<div style="display:grid;gap:8px"><div style="height:90px;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:${s}"></div><span class="note">${l}</span></div>`).join("")))
);
ShapeAndElevation.storyName = "Shape and elevation";
