// Pixel accent explorations (Tines uses its Pangea pixel face for small, playful moments).
// All free Google Fonts. Pixel type is for tiny labels, statuses and numbers, never body text.
export default { title: "Explorations/Pixel accents" };

const FONTS = [
  { name: "Silkscreen", css: "Silkscreen:wght@400;700", note: "Classic 8px pixel caps. Very legible small; the safest pick." },
  { name: "Pixelify Sans", css: "Pixelify+Sans:wght@400..700", note: "Pixel with weights and real lowercase. Friendliest." },
  { name: "Tiny5", css: "Tiny5", note: "Tiny 5px grid. Crisp at 10–12px, made for small UI." },
  { name: "Micro 5", css: "Micro+5", note: "Ultra-condensed 5px. Good for dense counters." },
  { name: "Jersey 10", css: "Jersey+10", note: "Chunky, sporty pixel. Fun for big numbers." },
  { name: "Press Start 2P", css: "Press+Start+2P", note: "Arcade. Wide and loud; tiny doses only." },
  { name: "VT323", css: "VT323", note: "Old terminal. Tall and readable; nice for readouts." },
  { name: "DotGothic16", css: "DotGothic16", note: "Dot-built gothic with a softer feel." },
  { name: "Doto", css: "Doto:wght@400..900", note: "Round-dot matrix, variable weight. Kiln-controller feel." },
  { name: "Sixtyfour", css: "Sixtyfour", note: "Scanline CRT texture. Strong character for displays." },
  { name: "Workbench", css: "Workbench", note: "Pixel with scanlines and bleed. A 'studio equipment' vibe." },
  { name: "Handjet", css: "Handjet:wght@300..700", note: "Modular/stitched pixel, variable. Craft-y, textile feel." },
  { name: "Jacquard 12", css: "Jacquard+12", note: "Pixel blackletter. Decorative, like a woven label." },
  { name: "Silkscreen Bold", css: "Silkscreen:wght@700", family: "Silkscreen", weight: 700, note: "Bold cut of Silkscreen for active states." },
];
const load = (list) => {
  const href = "https://fonts.googleapis.com/css2?" + list.map((f) => "family=" + f).join("&") + "&display=swap";
  if (!document.querySelector(`link[href="${href}"]`)) document.head.append(Object.assign(document.createElement("link"), { rel: "stylesheet", href }));
};
load(FONTS.map((f) => f.css));
const fam = (f) => `'${f.family || f.name}', monospace`;
const PICKS = ["Silkscreen", "Pixelify Sans", "Tiny5", "Doto"];

export const Catalog = () => `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px;max-width:1200px">${FONTS.map((f) => `
  <div style="background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px;display:grid;gap:10px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font:500 20px var(--display)">${f.name}</b>${PICKS.includes(f.name) ? `<span class="srcb new">Shortlist</span>` : ""}</div>
    <div style="font:${f.weight || 400} 22px ${fam(f)};letter-spacing:.02em">NEW · TESTING · KEEPER</div>
    <div style="font:${f.weight || 400} 30px ${fam(f)}">3,309 recipes</div>
    <div style="font:${f.weight || 400} 15px ${fam(f)}">cone 6 · 1222°C · satin plum</div>
    <span class="note">${f.note}</span>
  </div>`).join("")}</div>`;
Catalog.storyName = "Pixel font catalog";

const badge = (txt, f, bg, fg) => `<span style="justify-self:start;align-self:start;font:400 12px ${fam(f)};letter-spacing:.06em;border-radius:999px;padding:4px 10px;background:${bg};color:${fg}">${txt}</span>`;
export const InContext = () => `<div style="display:grid;gap:18px;max-width:1150px">${FONTS.filter((f) => PICKS.includes(f.name)).map((f) => `
  <section style="background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px;display:grid;gap:14px">
    <span class="lbl">${f.name}</span>
    <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
      ${badge("NEW", f, "var(--tint-purple)", "var(--accent)")}${badge("GLAZY", f, "var(--tint-blue)", "var(--ink)")}${badge("MINE", f, "var(--tint-green)", "var(--ok)")}
      <span style="width:1px;height:20px;background:var(--line)"></span>
      ${badge("UNTESTED", f, "var(--bg)", "var(--muted)")}${badge("TESTING", f, "var(--tint-yellow)", "#7A5A10")}${badge("PROVEN", f, "var(--tint-green)", "var(--ok)")}${badge("RETIRED", f, "var(--bg)", "var(--muted)")}
    </div>
    <div style="display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;align-items:center;border:1px solid var(--line);border-radius:14px;padding:12px;background:var(--bg)">
      <div style="height:96px;border-radius:12px;background:#70626E;position:relative"><span style="position:absolute;right:8px;bottom:6px;font:400 11px ${fam(f)};color:#fff">#70626E</span></div>
      <div style="display:grid;gap:4px">${badge("NEW", f, "var(--tint-purple)", "var(--accent)")}<b style="font:500 20px var(--display)">Bark satin</b><span class="meta" style="font-family:var(--mono)">Glaze for #70626E · adapted from Glazy #3033</span></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center"><span style="font:400 15px ${fam(f)}">471 OF 3,309 GLAZY RECIPES</span>
      <div class="tabs" style="display:inline-flex"><button aria-selected="true">Discover</button><button aria-selected="false">My Work <span style="font:400 11px ${fam(f)};background:var(--tint-orange);color:var(--warn);border-radius:999px;padding:1px 6px;margin-left:4px">3</span></button></div></div>
  </section>`).join("")}</div>`;
InContext.storyName = "In context (shortlist)";

export const Kickers = () => `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;max-width:1150px">${FONTS.filter((f) => PICKS.includes(f.name)).map((f) => `
  <div style="background:var(--tint-purple);border-radius:20px;padding:26px;display:grid;gap:8px">
    <span style="font:400 13px ${fam(f)};letter-spacing:.08em;color:var(--accent)">▶ ${f.name.toUpperCase()} · DISCOVER</span>
    <div style="font:400 46px/1 var(--display);letter-spacing:-.03em">Find a glaze</div>
    <p style="margin:0">Search 3,309 tested recipes, or match a palette.</p>
  </div>`).join("")}</div><p class="note" style="margin-top:12px">Tines puts a small pixel or mono label over big serif headlines. Here the pixel kicker sits over the Soft clay display.</p>`;
Kickers.storyName = "Section kickers over Soft clay";

export const KilnDisplay = () => {
  const panel = (f, color, big = 64) => `<div style="background:#16141A;border-radius:18px;padding:22px;display:grid;gap:12px;color:${color};min-width:0;overflow:hidden">
    <span style="font:500 11px var(--mono);letter-spacing:.1em;color:#8D8994">${f.name.toUpperCase()}</span>
    <div style="display:flex;justify-content:space-between;align-items:end"><span style="font:400 ${big}px/1 ${fam(f)}">1222°C</span><span style="font:400 18px ${fam(f)}">CONE 6</span></div>
    <div style="display:grid;grid-template-columns:repeat(24,1fr);gap:3px">${Array.from({ length: 24 }, (_, i) => `<i style="display:block;height:10px;border-radius:2px;background:${i < 17 ? color : "#2C2933"}"></i>`).join("")}</div>
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font:400 ${big < 64 ? 11 : 14}px ${fam(f)};color:#B9B4C2"><span>RAMP 3/4 · 150°/HR</span><span>HOLD 0:15</span></div>
  </div>`;
  const by = (n) => FONTS.find((f) => f.name === n);
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;max-width:1150px">
    ${panel(by("Doto"), "#F2A65A")}${panel(by("VT323"), "#7FE0A8")}${panel(by("Sixtyfour"), "#C2AAFA", 38)}${panel(by("Jersey 10"), "#F27E7E")}
  </div><p class="note" style="margin-top:12px">An idea for My Work: a live firing card styled like a kiln controller. Pixel type earns its place here as real readouts.</p>`;
};
KilnDisplay.storyName = "Kiln display (My Work idea)";

export const Stickers = () => {
  const by = (n) => FONTS.find((f) => f.name === n);
  const sticker = (f, title, line, bg, fg) => `<div style="border-radius:14px;padding:16px 18px;background:${bg};color:${fg};display:grid;gap:6px;border:2px dashed color-mix(in srgb,${fg} 35%,transparent)">
    <span style="font:400 20px ${fam(f)};letter-spacing:.04em">${title}</span><span style="font:400 13px ${fam(f)}">${line}</span></div>`;
  const drop = (c) => { const rows = ["..XX..", ".XXXX.", "XXXXXX", "XXXXXX", ".XXXX."]; return `<div style="display:grid;grid-template-columns:repeat(6,8px);gap:2px">${rows.join("").split("").map((x) => `<i style="display:block;width:8px;height:8px;background:${x === "X" ? c : "transparent"}"></i>`).join("")}</div>`; };
  return `<div style="display:grid;gap:18px;max-width:1100px">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">
      ${sticker(by("Silkscreen"), "STUDIO WHITE", "5 KG · SG 1.45 · OCT 20", "oklch(0.95 0.01 85)", "#3A3530")}
      ${sticker(by("Pixelify Sans"), "Bark satin v2", "1,000 g · cone 6 · testing", "oklch(0.93 0.03 330)", "#4A2A3B")}
      ${sticker(by("Tiny5"), "PLUM LINER", "FOOD-SAFE · LEACH TEST DUE", "oklch(0.93 0.03 300)", "#3B2A55")}
      ${sticker(by("Handjet"), "Celadon A", "2 kg · proven · 14 pieces", "oklch(0.93 0.04 170)", "#1F4A3E")}
    </div>
    <div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap"><span class="lbl">Pixel glaze-drop mark</span>${drop("#6956A8")}${drop("#2F6B45")}${drop("#B74D1A")}
      <span class="note">A pixel version of the logo mark for favicons, loading states and badges.</span></div>
  </div>`;
};
Stickers.storyName = "Bucket labels and pixel mark";

// Same style as the first pixel accent (lavender block, uppercase, wide tracking), different typefaces.
const ACCENT_FONTS = [
  { name: "Silkscreen (original)", family: "Silkscreen", css: "Silkscreen", w: 400, note: "The pixel original, for comparison." },
  { name: "IBM Plex Mono · Light", family: "IBM Plex Mono", css: "IBM+Plex+Mono:wght@300;400;500;600;700", w: 300, note: "IBM's typeface. Light reads airy and precise." },
  { name: "IBM Plex Mono · Regular", family: "IBM Plex Mono", w: 400, note: "Engineered, calm; pairs well with Fraunces." },
  { name: "IBM Plex Mono · Medium", family: "IBM Plex Mono", w: 500, note: "Good default for small badges." },
  { name: "IBM Plex Mono · SemiBold", family: "IBM Plex Mono", w: 600, note: "Stronger labels on tinted blocks." },
  { name: "IBM Plex Mono · Bold", family: "IBM Plex Mono", w: 700, note: "Stamp-like for status." },
  { name: "Space Mono", family: "Space Mono", css: "Space+Mono:wght@400;700", w: 400, note: "Geometric, a little retro-futurist." },
  { name: "Martian Mono", family: "Martian Mono", css: "Martian+Mono:wght@300..700", w: 500, note: "Wide, technical; closest to a lab instrument." },
  { name: "Major Mono Display", family: "Major Mono Display", css: "Major+Mono+Display", w: 400, note: "Display mono with quirky letterforms. Headings only." },
  { name: "Share Tech Mono", family: "Share Tech Mono", css: "Share+Tech+Mono", w: 400, note: "Squared, LCD-ish without being pixel." },
  { name: "Azeret Mono", family: "Azeret Mono", css: "Azeret+Mono:wght@300..700", w: 500, note: "Crisp grotesk mono, many weights." },
  { name: "Fragment Mono", family: "Fragment Mono", css: "Fragment+Mono", w: 400, note: "Helvetica-like mono. Very clean." },
  { name: "Red Hat Mono", family: "Red Hat Mono", css: "Red+Hat+Mono:wght@300..700", w: 500, note: "Friendly, rounded corners." },
  { name: "Syne Mono", family: "Syne Mono", css: "Syne+Mono", w: 400, note: "Narrow, artsy, a bit hand-cut." },
  { name: "Kode Mono", family: "Kode Mono", css: "Kode+Mono:wght@400..700", w: 500, note: "Angular, code-editor feel." },
  { name: "VT323", family: "VT323", css: "VT323", w: 400, note: "Terminal pixel-mono hybrid." },
];
load(ACCENT_FONTS.filter((f) => f.css).map((f) => f.css));

export const AccentFontOptions = () => `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;max-width:1200px">${ACCENT_FONTS.map((f) => `
  <div style="background:var(--tint-purple);border-radius:16px;padding:22px;display:grid;gap:10px">
    <span class="lbl">${f.name}</span>
    <div style="font:${f.w} 26px '${f.family}',monospace;letter-spacing:.04em;color:var(--ink)">NEW · TESTING · KEEPER</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${["NEW", "PROVEN", "471 RECIPES", "CONE 6"].map((t) => `<span style="font:${f.w} 12px '${f.family}',monospace;letter-spacing:.08em;border-radius:999px;padding:4px 10px;background:var(--surface);color:var(--accent)">${t}</span>`).join("")}</div>
    <span class="note">${f.note}</span>
  </div>`).join("")}</div>
  <p class="note" style="margin-top:12px">Same lavender block, uppercase and wide tracking as the first pixel accent. Only the typeface changes.</p>`;
AccentFontOptions.storyName = "Accent font options (same style)";

// Fonts between Silkscreen (pure pixel) and IBM Plex Mono (smooth), in the same accent style, ordered pixel → smooth.
const SPECTRUM = [
  { name: "Silkscreen", family: "Silkscreen", css: "Silkscreen", note: "Pure 8px pixel. The starting point." },
  { name: "Tiny5", family: "Tiny5", css: "Tiny5", note: "Pixel on a tighter grid; a little finer." },
  { name: "Geist Pixel", family: "Geist Pixel", href: "https://cdn.jsdelivr.net/npm/@fontsource/geist-pixel@5.3.0/index.css", note: "Vercel's pixel face (OFL). Modern proportions, crisp." },
  { name: "Pixelify Sans", family: "Pixelify Sans", css: "Pixelify+Sans:wght@400..700", w: 500, note: "Pixel with smoother weights and real lowercase." },
  { name: "Bitcount · square", family: "Bitcount Grid Single", css: "Bitcount+Grid+Single:wght,ELSH@100..900,0..100", w: 500, fvs: "'ELSH' 0", note: "Variable pixel grid with square elements." },
  { name: "Bitcount · round", family: "Bitcount Grid Single", w: 500, fvs: "'ELSH' 100", note: "Same grid, rounded elements: pixel but softer." },
  { name: "Doto · square dots", family: "Doto", css: "Doto:wght,ROND@100..900,0..100", w: 700, fvs: "'ROND' 0", note: "Dot matrix with square dots." },
  { name: "Doto · round dots", family: "Doto", w: 700, fvs: "'ROND' 100", note: "Round dots: a kiln-controller display." },
  { name: "DotGothic16", family: "DotGothic16", css: "DotGothic16", note: "Built from dots but reads like a normal gothic." },
  { name: "Handjet", family: "Handjet", css: "Handjet:wght,ELSH@100..900,0..16", w: 500, fvs: "'ELSH' 2", note: "Modular, stitched look; craft-y, textile-like." },
  { name: "VT323", family: "VT323", css: "VT323", note: "Terminal bitmap; tall and readable." },
  { name: "Share Tech Mono", family: "Share Tech Mono", css: "Share+Tech+Mono", note: "Smooth, but squared like an LCD." },
  { name: "Nova Mono", family: "Nova Mono", css: "Nova+Mono", note: "Smooth with square shoulders." },
  { name: "Kode Mono", family: "Kode Mono", css: "Kode+Mono:wght@400..700", w: 500, note: "Angular cuts on smooth strokes." },
  { name: "B612 Mono", family: "B612 Mono", css: "B612+Mono:wght@400;700", note: "Designed for cockpit screens; very legible." },
  { name: "IBM Plex Mono · Medium", family: "IBM Plex Mono", w: 500, note: "Fully smooth. The other end." },
];
load(SPECTRUM.filter((f) => f.css).map((f) => f.css));
SPECTRUM.filter((f) => f.href).forEach((f) => { if (!document.querySelector(`link[href="${f.href}"]`)) document.head.append(Object.assign(document.createElement("link"), { rel: "stylesheet", href: f.href })); });

export const PixelToSmooth = () => `<div style="display:grid;gap:14px;max-width:1200px">
  <div style="display:flex;justify-content:space-between;align-items:center;font:600 13px var(--body)"><span>◼ More pixel</span>
    <span style="flex:1;height:6px;margin:0 14px;border-radius:999px;background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 20%,var(--line)))"></span><span>More smooth ●</span></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px">${SPECTRUM.map((f, i) => {
    const font = `font-family:'${f.family}',monospace;font-weight:${f.w || 400};${f.fvs ? `font-variation-settings:${f.fvs};` : ""}`;
    return `<div style="background:var(--tint-purple);border-radius:16px;padding:18px;display:grid;gap:9px">
      <span class="lbl">${String(i + 1).padStart(2, "0")} · ${f.name}</span>
      <div style="${font}font-size:22px;letter-spacing:.04em;color:var(--ink)">NEW · TESTING · KEEPER</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${["NEW", "PROVEN", "CONE 6"].map((t) => `<span style="${font}font-size:12px;letter-spacing:.08em;border-radius:999px;padding:4px 10px;background:var(--surface);color:var(--accent)">${t}</span>`).join("")}</div>
      <span class="note">${f.note}</span></div>`;
  }).join("")}</div></div>`;
PixelToSmooth.storyName = "Pixel → smooth spectrum";
