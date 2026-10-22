// Input directions for the Match colors form. Nothing here is in the app yet.
// Tines' demo form: one white card (8px radius, 1px light-purple border), fields are 42px rows split by
// #DBD7FF hairlines (pairs share a row with a vertical divider), no boxes, placeholder-as-label in purple 16/500.
export default { title: "Explorations/Inputs" };

const CSS = `<style>
.ix{display:grid;gap:34px;max-width:860px}
.ix .lead{margin:0;max-width:72ch}

/* A: Tines rows. One card, divided rows, small label inside each cell above the value */
.ix-rows{background:var(--surface);border:1px solid var(--purple-200);border-radius:12px;overflow:hidden}
.ix-row{display:grid;grid-template-columns:repeat(var(--n,1),minmax(0,1fr));border-top:1px solid var(--purple-100)}
.ix-row:first-child{border-top:0}
.ix-cell{display:grid;gap:2px;padding:10px 20px 8px;min-width:0}
.ix-cell+.ix-cell{border-left:1px solid var(--purple-100)}
.ix-cell:focus-within{background:var(--purple-50)}
.ix-cell{text-transform:none;letter-spacing:0}
.ix-cell>span{font:500 11px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.ix-cell input,.ix-cell select,.ix-cell textarea{border:0;background:transparent;padding:2px 0;border-radius:0;font:500 16px var(--body);color:var(--ink);width:100%;outline:none}
.ix-cell select{appearance:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23714BD0' stroke-width='1.5'/%3E%3C/svg%3E") right 2px center/10px no-repeat;padding-right:18px}
.ix-cell textarea{min-height:44px;resize:vertical;font-family:var(--mono);font-size:15px}
.ix-drop{display:flex;align-items:center;gap:12px;padding:14px 20px;color:var(--accent);font:500 15px var(--body)}
.ix-drop b{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--purple-50);font-size:18px}
.ix-checks{display:flex;flex-wrap:wrap;gap:8px;padding:12px 20px}
.ix-foot{padding:12px;border-top:1px solid var(--purple-100);display:flex;gap:10px}
.ix-foot .btn{flex:1}

/* B: Balanced boxes. Labels up (body font, sentence case), every control 44px, white fill, toggles in one row */
.ix-box{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px 14px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px}
.ix-f{display:grid;gap:6px;min-width:0;align-content:start}
.ix-f{text-transform:none;letter-spacing:0}
.ix-f>span{font:600 13px var(--body);color:var(--ink);text-transform:none;letter-spacing:0}
.ix-f>span small{font-weight:400;color:var(--muted)}
.ix-f input,.ix-f select,.ix-f textarea,.ix-f .drop2{height:44px;border:1px solid var(--line);background-color:var(--surface);border-radius:10px;padding:0 14px;font:400 15px var(--body);color:var(--ink);width:100%}
.ix-f select{padding-right:40px}
.ix-f textarea{height:44px;min-height:44px;padding:11px 14px;font-family:var(--mono);font-size:14px;resize:none}
.ix-f .drop2{display:flex;align-items:center;gap:8px;border-style:dashed;color:var(--muted);font-size:14px}
.ix-f input:focus,.ix-f select:focus,.ix-f textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--purple-100)}
.ix-span2{grid-column:span 2}.ix-span4{grid-column:1/-1}
.ix-toggles{display:flex;flex-wrap:wrap;gap:8px;grid-column:1/-1;padding-top:4px;border-top:1px solid var(--line)}
.ix-tog{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--purple-300);border-radius:999px;padding:7px 14px 7px 8px;font:500 13.5px var(--body);color:var(--accent);background:transparent;cursor:pointer}
.ix-tog i{width:28px;height:16px;border-radius:999px;background:var(--purple-100);position:relative;transition:background .15s}
.ix-tog i::after{content:"";position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#fff;transition:transform .15s}
.ix-tog[aria-pressed=true]{background:var(--purple-50)}
.ix-tog[aria-pressed=true] i{background:var(--accent)}.ix-tog[aria-pressed=true] i::after{transform:translateX(12px)}
@media (max-width:640px){.ix-box{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.ix-span2,.ix-span4{grid-column:1/-1}.ix-row{--n:1!important}.ix-cell+.ix-cell{border-left:0;border-top:1px solid var(--purple-100)}}
</style>`;

const tog = `onclick="this.setAttribute('aria-pressed',this.getAttribute('aria-pressed')!=='true')"`;
const sel = (opts) => `<select>${opts.map((o) => `<option>${o}</option>`).join("")}</select>`;
const BODY = ["White porcelain", "Buff stoneware", "Red earthenware"], FIRE = ["Cone 6 oxidation", "Cone 6 reduction", "Cone 10 reduction"];
const SURF = ["Glossy", "Satin", "Matte"], OPAC = ["Opaque", "Semi-opaque", "Translucent"];
const item = (t, n, html) => `<div style="display:grid;gap:10px"><span class="lbl">${t}</span>${n ? `<p class="note lead">${n}</p>` : ""}${html}</div>`;

export const MatchForm = () => `${CSS}<div class="ix">
  ${item("A · Tines rows", "Closest to Tines' demo form. One card, fields are rows divided by hairlines, a small purple label sits inside each cell above its value. Fewest boxes, calmest. Checkboxes become toggle pills in their own row.",
    `<div class="ix-rows">
      <div class="ix-drop"><b>+</b>Drop, paste or tap to add an inspiration photo</div>
      <div class="ix-row"><label class="ix-cell"><span>Hex codes</span><textarea>ACB0AB  BAABAB  70626E</textarea></label></div>
      <div class="ix-row" style="--n:3"><label class="ix-cell"><span>Clay body</span>${sel(BODY)}</label><label class="ix-cell"><span>Firing</span>${sel(FIRE)}</label><label class="ix-cell"><span>Surface</span>${sel(SURF)}</label></div>
      <div class="ix-row" style="--n:3"><label class="ix-cell"><span>Opacity</span>${sel(OPAC)}</label><label class="ix-cell"><span>Batch (g dry)</span><input value="1000" inputmode="decimal"></label><label class="ix-cell"><span>Anything else</span><input placeholder="e.g. liner glaze, no zinc"></label></div>
      <div class="ix-row"><div class="ix-checks"><button type="button" class="ix-tog" aria-pressed="true" ${tog}><i></i>Food-safe</button><button type="button" class="ix-tog" aria-pressed="true" ${tog}><i></i>Prefer what's on my shelves</button></div></div>
      <div class="ix-foot"><button class="btn" type="button">Get recipes</button></div>
    </div>`)}
  ${item("B · Balanced boxes", "Keeps separate fields but evens them out: labels in the body font (13px, sentence case) so they match the field text, every control 44px tall on white, 4-column grid so things line up, toggles in one row at the bottom.",
    `<div class="ix-box">
      <label class="ix-f ix-span2"><span>Inspiration photo <small>optional</small></span><div class="drop2">+ Drop, paste or tap</div></label>
      <label class="ix-f ix-span2"><span>Hex codes</span><textarea>ACB0AB  BAABAB  70626E</textarea></label>
      <label class="ix-f ix-span2"><span>Clay body</span>${sel(BODY)}</label>
      <label class="ix-f"><span>Firing</span>${sel(FIRE)}</label>
      <label class="ix-f"><span>Surface</span>${sel(SURF)}</label>
      <label class="ix-f"><span>Opacity</span>${sel(OPAC)}</label>
      <label class="ix-f"><span>Batch <small>g dry</small></span><input value="1000" inputmode="decimal"></label>
      <label class="ix-f ix-span2"><span>Anything else</span><input placeholder="e.g. liner glaze, no zinc"></label>
      <div class="ix-toggles"><button type="button" class="ix-tog" aria-pressed="true" ${tog}><i></i>Food-safe</button><button type="button" class="ix-tog" aria-pressed="true" ${tog}><i></i>Prefer what's on my shelves</button><span style="flex:1"></span><button class="btn" type="button">Get recipes</button></div>
    </div>`)}
</div>`;
MatchForm.storyName = "Match colors form";
