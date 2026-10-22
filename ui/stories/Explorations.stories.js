// Tines-inspired directions to choose from. Nothing here is in the app yet.
// Tines builds its look from: 11 hue families with full 1–99 lightness ramps, warm cream neutrals,
// purple as primary, a serif display (Reckless) over a grotesk (Roobert) with a mono and a pixel accent,
// pill buttons (min-height 2.75em, weight 600), and big pastel blocks per section.
// Their fonts are commercial, so the pairings below use free Google Fonts in the same spirit.
export default { title: "Explorations/Tines-inspired" };

const loadFonts = (families) => {
  const href = "https://fonts.googleapis.com/css2?" + families.map((f) => "family=" + f).join("&") + "&display=swap";
  if (!document.querySelector(`link[href="${href}"]`)) document.head.append(Object.assign(document.createElement("link"), { rel: "stylesheet", href }));
};

// Glaze-named families, each a 50–900 ramp in OKLCH so steps feel even across hues.
const FAMILIES = [
  ["Cobalt", 265, 0.16], ["Celadon", 170, 0.09], ["Sage", 135, 0.08], ["Ochre", 85, 0.13], ["Iron", 50, 0.13],
  ["Copper red", 25, 0.16], ["Plum", 330, 0.12], ["Lavender", 300, 0.11], ["Shino", 40, 0.07], ["Slate", 250, 0.03], ["Clay", 65, 0.025],
];
const STEPS = [[50, 0.975], [100, 0.95], [200, 0.9], [300, 0.83], [400, 0.74], [500, 0.65], [600, 0.56], [700, 0.47], [800, 0.38], [900, 0.29]];
const shade = (h, c, step) => { const [, L] = STEPS.find(([s]) => s === step); const k = step <= 100 ? 0.25 : step <= 200 ? 0.5 : step >= 800 ? 0.8 : 1; return `oklch(${L} ${(c * k).toFixed(3)} ${h})`; };

export const GlazePalette = () => `<div style="display:grid;gap:10px;max-width:1100px">
  <p class="note" style="max-width:70ch">Like Tines' 11 hue families, but named for glazes. Use 50–100 for page and block backgrounds, 200–300 for chips and pills, 500–600 for accents and buttons, 800–900 for text on tinted blocks.</p>
  <div style="display:grid;grid-template-columns:110px repeat(10,minmax(0,1fr));gap:4px;font:500 10.5px var(--mono);color:var(--muted)">
    <span></span>${STEPS.map(([s]) => `<span style="text-align:center">${s}</span>`).join("")}
    ${FAMILIES.map(([name, h, c]) => `<span style="font:600 13px var(--body);color:var(--ink);align-self:center">${name}</span>` +
      STEPS.map(([s]) => `<div title="${name} ${s}: ${shade(h, c, s)}" style="height:44px;border-radius:8px;background:${shade(h, c, s)}"></div>`).join("")).join("")}
  </div></div>`;
GlazePalette.storyName = "Glaze palette (11 ramps)";

export const SectionColors = () => {
  const sec = (name, h, c, title, body) => `<div style="border-radius:20px;padding:28px;background:${shade(h, c, 50)};display:grid;gap:10px;color:${shade(h, c, 900)}">
    <span style="font:500 11px var(--mono);letter-spacing:.09em;text-transform:uppercase">${name}</span>
    <div style="font:400 44px/1 var(--display);letter-spacing:-.03em">${title}</div><p style="margin:0;max-width:46ch">${body}</p>
    <div style="display:flex;gap:8px"><button type="button" style="border:0;border-radius:999px;min-height:2.75em;padding:.75em 1.25em;font:600 14px var(--body);background:${shade(h, c, 600)};color:#fff">Primary</button>
      <button type="button" style="border:0;border-radius:999px;min-height:2.75em;padding:.75em 1.25em;font:600 14px var(--body);background:#fff;color:${shade(h, c, 700)}">Secondary</button></div></div>`;
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;max-width:1100px">
    ${sec("Discover", 265, 0.16, "Find a glaze", "Cobalt for searching and matching colors.")}
    ${sec("My Studio", 135, 0.08, "Your shelves", "Sage for recipes and materials you keep.")}
    ${sec("My Work", 50, 0.13, "On the wheel", "Iron for pieces, tests and firings in progress.")}
  </div><p class="note" style="margin-top:12px">Tines gives each product area its own pastel block. Here each tab would own a glaze color for its header, active tab and primary buttons.</p>`;
};
SectionColors.storyName = "A color per section";

const PAIRS = [
  { name: "Previous", fonts: ["Newsreader:opsz,wght@6..72,400;6..72,500", "Hanken+Grotesk:wght@400;500;600", "DM+Mono:wght@500"], display: "Newsreader", body: "Hanken Grotesk", mono: "DM Mono", note: "Calm editorial serif, friendly grotesk. Replaced by Soft clay." },
  { name: "Soft clay · in the app", fonts: ["Fraunces:opsz,wght,SOFT@9..144,400,100", "Inter+Tight:wght@400;500;600", "JetBrains+Mono:wght@500"], display: "Fraunces", body: "Inter Tight", mono: "JetBrains Mono", note: "Rounder, softer serif, closest to Reckless' warmth." },
  { name: "Studio journal", fonts: ["Instrument+Serif", "Schibsted+Grotesk:wght@400;500;600", "Space+Mono"], display: "Instrument Serif", body: "Schibsted Grotesk", mono: "Space Mono", note: "Condensed, elegant display with a sturdy grotesk." },
  { name: "Workshop", fonts: ["Young+Serif", "Figtree:wght@400;500;600", "IBM+Plex+Mono:wght@500"], display: "Young Serif", body: "Figtree", mono: "IBM Plex Mono", note: "Chunkier serif, very legible body. Most playful." },
];

export const FontPairings = () => {
  PAIRS.forEach((p) => loadFonts(p.fonts)); loadFonts(["Silkscreen"]);
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(480px,1fr));gap:16px;max-width:1100px">${PAIRS.map((p) => `
    <div style="background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:22px;display:grid;gap:10px">
      <span style="font:500 11px '${p.mono}',monospace;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)">${p.name} · ${p.display} / ${p.body} / ${p.mono}</span>
      <div style="font:400 56px/1 '${p.display}',serif;letter-spacing:-.03em">Discover</div>
      <div style="font:500 22px/1.2 '${p.display}',serif">Satin Slate, cone 6</div>
      <p style="margin:0;font:400 15.5px/1.5 '${p.body}',sans-serif">Drop in a photo or hex codes and get glaze recipes with grams for your batch.</p>
      <div style="display:flex;gap:8px;align-items:center"><button type="button" style="border:0;border-radius:999px;padding:.75em 1.25em;font:600 14px '${p.body}',sans-serif;background:var(--ink);color:var(--bg)">Get recipes</button>
        <span style="font:500 12px '${p.mono}',monospace;color:var(--muted)">Glazy #3030 · 1,000 g</span></div>
      <span class="note">${p.note}</span>
    </div>`).join("")}
    <div style="background:var(--tint-purple);border-radius:16px;padding:22px;display:grid;gap:10px">
      <span class="lbl">Pixel accent (Tines uses Pangea) · Silkscreen</span>
      <div style="font:400 28px 'Silkscreen',monospace">NEW · TESTING · KEEPER</div>
      <p class="note" style="margin:0">Only for tiny status badges and counters, never body text.</p>
    </div></div>`;
};
FontPairings.storyName = "Font pairings";

export const Buttons = () => `<div style="display:grid;gap:18px;max-width:900px">
  <div><span class="lbl">Current</span><div style="display:flex;gap:10px;margin-top:8px;align-items:center"><button class="btn">Get recipes</button><button class="ghost">Search &amp; add</button><button class="ghost sm">Save</button></div></div>
  <div><span class="lbl">Tines-style: min-height 2.75em, padding .75em 1.25em, weight 600, min-width 6.5em, accent-filled primary</span>
    <div style="display:flex;gap:10px;margin-top:8px;align-items:center">
      <button type="button" style="border:1px solid transparent;border-radius:999px;min-height:2.75em;min-width:6.5em;padding:.75em 1.25em;font:600 14px var(--body);background:${shade(265, 0.16, 600)};color:#fff">Get recipes</button>
      <button type="button" style="border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:999px;min-height:2.75em;min-width:6.5em;padding:.75em 1.25em;font:600 14px var(--body);background:transparent;color:var(--ink)">Search &amp; add</button>
      <button type="button" style="border:1px solid transparent;border-radius:999px;min-height:2.75em;min-width:6.5em;padding:.75em 1.25em;font:600 14px var(--body);background:${shade(265, 0.16, 100)};color:${shade(265, 0.16, 800)}">Save</button></div></div>
  <p class="note">Tines' primary is accent-filled, not black, and secondary buttons use a 14% currentColor hairline, so they adapt to colored blocks.</p></div>`;
Buttons.storyName = "Buttons, Tines-style";
