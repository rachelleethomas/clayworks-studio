const f={title:"Explorations/Tabs and switches"},d=(t,r,i)=>`oklch(${t} ${r} ${i})`,g=[["Discover","Search Glazy or match colors",265,.16],["My Studio","Your recipes and shelves",135,.08],["My Work","Pieces, tests and firings",50,.13]],p=`onclick="[...this.parentNode.querySelectorAll('button')].forEach(b=>{const on=b===this;b.hasAttribute('aria-checked')?b.setAttribute('aria-checked',on):b.setAttribute('aria-selected',on)});this.closest('[data-blocks]')?.style.setProperty('--panel',this.dataset.panel||'')"`,$=`<style>
.tx{display:grid;gap:28px;max-width:1000px}
.tx-item{display:grid;gap:10px}
.tx-item>.lbl+p{margin:-4px 0 0;max-width:70ch}
.tx-bar{display:flex;align-items:center;gap:18px;padding:14px 18px;border-radius:16px;background:var(--bg);border:1px dashed var(--line)}
.tx-bar .brand-name{font:500 20px var(--display);letter-spacing:-.01em}
.tx-bar .sp{flex:1}
.tx-av{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--accent-ink);font:600 13px var(--body)}
.tx button{cursor:pointer}

/* B: Tines nav links */
.tx-links{display:flex;gap:2px}
.tx-links button{border:0;background:none;color:var(--accent);font:600 14.5px var(--body);padding:8px 12px;border-radius:999px;transition:background .15s}
.tx-links button:hover{background:var(--wash)}
.tx-links button[aria-selected=true]{background:var(--wash-strong)}

/* C: pixel pill track (Tines WORKFLOW | FRONTEND) */
.tx-track{display:inline-flex;gap:2px;padding:4px;border-radius:999px;background:var(--accent)}
.tx-track button{border:0;background:none;color:color-mix(in srgb,var(--bg) 78%,transparent);font:400 12.5px var(--pixel);letter-spacing:.1em;text-transform:uppercase;padding:9px 16px;border-radius:999px;transition:background .15s,color .15s}
.tx-track button:hover{color:var(--bg)}
.tx-track button[aria-selected=true],.tx-track button[aria-checked=true]{background:var(--bg);color:var(--accent)}
.tx-track.ink{background:var(--ink)}
.tx-track.ink button[aria-selected=true],.tx-track.ink button[aria-checked=true]{color:var(--ink)}

/* D: wash track */
.tx-wash{display:inline-flex;gap:2px;padding:4px;border-radius:999px;background:var(--wash)}
.tx-wash button{border:0;background:none;color:var(--accent);font:400 12.5px var(--pixel);letter-spacing:.1em;text-transform:uppercase;padding:9px 16px;border-radius:999px;transition:background .15s}
.tx-wash button:hover{background:var(--wash)}
.tx-wash button[aria-selected=true],.tx-wash button[aria-checked=true]{background:var(--surface);box-shadow:0 1px 3px color-mix(in srgb,var(--accent) 25%,transparent)}

/* E: outlined, divided (Tines NEW | Introducing pill) */
.tx-out{display:inline-flex;border:1px solid var(--accent);border-radius:999px;overflow:hidden}
.tx-out button{border:0;background:none;color:var(--accent);font:400 12.5px var(--pixel);letter-spacing:.1em;text-transform:uppercase;padding:10px 18px;transition:background .15s}
.tx-out button+button{border-left:1px solid var(--accent)}
.tx-out button:hover{background:var(--wash)}
.tx-out button[aria-selected=true],.tx-out button[aria-checked=true]{background:var(--accent);color:var(--bg)}

/* F: colored block tabs joined to a panel */
.tx-blocks{display:grid;border-radius:18px;overflow:hidden}
.tx-blocks .tabs-row{display:grid;grid-template-columns:repeat(3,1fr)}
.tx-blocks button{border:0;text-align:left;padding:16px 18px 12px;border-radius:14px 14px 0 0;color:#fff;display:grid;gap:6px;opacity:.9;transition:opacity .15s}
.tx-blocks button:hover{opacity:1}
.tx-blocks button b{font:400 24px/1 var(--display);letter-spacing:-.02em}
.tx-blocks button span{font:500 13px var(--body);opacity:.85}
.tx-blocks button[aria-selected=true]{opacity:1}
.tx-blocks button[aria-selected=false] b{font-size:20px}
.tx-blocks .panel{background:var(--panel);color:#fff;padding:22px 20px;font:500 14px var(--body);min-height:70px;transition:background .2s}

/* G: card switch with descriptions (Tines team tabs, small) */
.tx-cards{display:grid;grid-template-columns:repeat(2,minmax(0,240px));gap:8px}
.tx-cards button{border:1px solid var(--hairline);background:transparent;border-radius:14px;padding:12px 14px;text-align:left;display:grid;gap:4px;color:var(--ink);transition:background .15s,border-color .15s}
.tx-cards button:hover{background:var(--wash)}
.tx-cards button b{font:400 11.5px var(--pixel);letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
.tx-cards button span{font:500 13.5px/1.35 var(--body);color:var(--muted)}
.tx-cards button[aria-checked=true]{background:var(--accent);border-color:var(--accent)}
.tx-cards button[aria-checked=true] b,.tx-cards button[aria-checked=true] span{color:var(--bg)}
</style>`,e=(t,r,i)=>`<div class="tx-item"><span class="lbl">${t}</span>${r?`<p class="note">${r}</p>`:""}${i}</div>`,s=t=>`<div class="tx-bar"><span class="brand-name">Clayworks Studio</span>${t}<span class="sp"></span><span class="tx-av">R</span></div>`,a=(t,r="aria-selected")=>t.map((i,l)=>`<button type="button" ${r}="${l===0}" ${p}>${i}</button>`).join(""),o=g.map(t=>t[0]),c=()=>`${$}<div class="tx">
  ${e("Now","Current app tabs: pill track, filled active tab.",s(`<div class="tabs" role="tablist">${a(o)}</div>`))}
  ${e("1 · Nav links","Like Tines' header: no track, purple text, soft wash on hover and on the current tab. Lightest option.",s(`<div class="tx-links" role="tablist">${a(o)}</div>`))}
  ${e("2 · Pixel track, purple","Tines' WORKFLOW | FRONTEND switcher: solid track, uppercase Geist Pixel, cream pill for the current tab.",s(`<div class="tx-track" role="tablist">${a(o)}</div>`))}
  ${e("3 · Pixel track, ink","Same, on a near-black track. Quieter next to purple buttons.",s(`<div class="tx-track ink" role="tablist">${a(o)}</div>`))}
  ${e("4 · Wash track","Faint purple track, white pill for the current tab. Matches the active filter chips.",s(`<div class="tx-wash" role="tablist">${a(o)}</div>`))}
  ${e("5 · Outlined, divided","Tines' NEW | Introducing pill: hairline outline with dividers, current tab filled.",s(`<div class="tx-out" role="tablist">${a(o)}</div>`))}
  ${e("6 · Colored block tabs","Tines' team tabs: each section owns a glaze color, the current tab joins a panel of the same color (where the page title would sit). Boldest option.",`<div class="tx-blocks" data-blocks style="--panel:${d(.56,.16,265)}"><div class="tabs-row" role="tablist">${g.map(([t,r,i,l],m)=>`<button type="button" aria-selected="${m===0}" data-panel="${d(.56,l,i)}" style="background:${d(.56,l,i)}" ${p}><b>${t}</b><span>${r}</span></button>`).join("")}</div>
      <div class="panel">Page content sits on the section's color, or the panel stays short and the page continues on cream.</div></div>`)}
</div>`;c.storyName="Top tabs";const n=()=>`${$}<div class="tx">
  ${e("Now","Current .seg switch.",`<div style="display:grid;gap:10px;max-width:420px"><div class="seg dmode" role="radiogroup">${a(["Search","Match colors"],"aria-checked")}</div>
    <div class="seg" role="radiogroup">${a(["Glaze","Stain in clay or slip"],"aria-checked")}</div></div>`)}
  ${e("1 · Pixel track, purple","Tines WORKFLOW | FRONTEND.",`<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-track" role="radiogroup">${a(["Search","Match colors"],"aria-checked")}</div><div class="tx-track" role="radiogroup">${a(["Recipes","Shelves"],"aria-checked")}</div></div>`)}
  ${e("2 · Pixel track, ink","",`<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-track ink" role="radiogroup">${a(["Search","Match colors"],"aria-checked")}</div><div class="tx-track ink" role="radiogroup">${a(["Recipes","Shelves"],"aria-checked")}</div></div>`)}
  ${e("3 · Wash track","",`<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-wash" role="radiogroup">${a(["Search","Match colors"],"aria-checked")}</div><div class="tx-wash" role="radiogroup">${a(["Recipes","Shelves"],"aria-checked")}</div></div>`)}
  ${e("4 · Outlined, divided","",`<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-out" role="radiogroup">${a(["Search","Match colors"],"aria-checked")}</div><div class="tx-out" role="radiogroup">${a(["Recipes","Shelves"],"aria-checked")}</div></div>`)}
  ${e("5 · Cards with a line of description","Small version of Tines' team tabs, for choices that need explaining, like Glaze vs Stain in clay.",`<div class="tx-cards" role="radiogroup">${[["Glaze","Full recipe: base to 100 plus colorants"],["Stain in clay or slip","Mason stain % of dry clay, grams per batch"]].map(([t,r],i)=>`<button type="button" aria-checked="${i===0}" ${p}><b>${t}</b><span>${r}</span></button>`).join("")}</div>`)}
</div>`;n.storyName="Switches";var b,x,u;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:'() => `${CSS}<div class="tx">\n  ${item("Now", "Current app tabs: pill track, filled active tab.", bar(`<div class="tabs" role="tablist">${btns(NAV)}</div>`))}\n  ${item("1 · Nav links", "Like Tines\' header: no track, purple text, soft wash on hover and on the current tab. Lightest option.", bar(`<div class="tx-links" role="tablist">${btns(NAV)}</div>`))}\n  ${item("2 · Pixel track, purple", "Tines\' WORKFLOW | FRONTEND switcher: solid track, uppercase Geist Pixel, cream pill for the current tab.", bar(`<div class="tx-track" role="tablist">${btns(NAV)}</div>`))}\n  ${item("3 · Pixel track, ink", "Same, on a near-black track. Quieter next to purple buttons.", bar(`<div class="tx-track ink" role="tablist">${btns(NAV)}</div>`))}\n  ${item("4 · Wash track", "Faint purple track, white pill for the current tab. Matches the active filter chips.", bar(`<div class="tx-wash" role="tablist">${btns(NAV)}</div>`))}\n  ${item("5 · Outlined, divided", "Tines\' NEW | Introducing pill: hairline outline with dividers, current tab filled.", bar(`<div class="tx-out" role="tablist">${btns(NAV)}</div>`))}\n  ${item("6 · Colored block tabs", "Tines\' team tabs: each section owns a glaze color, the current tab joins a panel of the same color (where the page title would sit). Boldest option.", `<div class="tx-blocks" data-blocks style="--panel:${ok(0.56, 0.16, 265)}"><div class="tabs-row" role="tablist">${SECTIONS.map(([n, d, h, c], i) => `<button type="button" aria-selected="${i === 0}" data-panel="${ok(0.56, c, h)}" style="background:${ok(0.56, c, h)}" ${pick}><b>${n}</b><span>${d}</span></button>`).join("")}</div>\n      <div class="panel">Page content sits on the section\'s color, or the panel stays short and the page continues on cream.</div></div>`)}\n</div>`',...(u=(x=c.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};var v,h,k;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:'() => `${CSS}<div class="tx">\n  ${item("Now", "Current .seg switch.", `<div style="display:grid;gap:10px;max-width:420px"><div class="seg dmode" role="radiogroup">${btns(["Search", "Match colors"], "aria-checked")}</div>\n    <div class="seg" role="radiogroup">${btns(["Glaze", "Stain in clay or slip"], "aria-checked")}</div></div>`)}\n  ${item("1 · Pixel track, purple", "Tines WORKFLOW | FRONTEND.", `<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-track" role="radiogroup">${btns(["Search", "Match colors"], "aria-checked")}</div><div class="tx-track" role="radiogroup">${btns(["Recipes", "Shelves"], "aria-checked")}</div></div>`)}\n  ${item("2 · Pixel track, ink", "", `<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-track ink" role="radiogroup">${btns(["Search", "Match colors"], "aria-checked")}</div><div class="tx-track ink" role="radiogroup">${btns(["Recipes", "Shelves"], "aria-checked")}</div></div>`)}\n  ${item("3 · Wash track", "", `<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-wash" role="radiogroup">${btns(["Search", "Match colors"], "aria-checked")}</div><div class="tx-wash" role="radiogroup">${btns(["Recipes", "Shelves"], "aria-checked")}</div></div>`)}\n  ${item("4 · Outlined, divided", "", `<div style="display:flex;gap:14px;flex-wrap:wrap"><div class="tx-out" role="radiogroup">${btns(["Search", "Match colors"], "aria-checked")}</div><div class="tx-out" role="radiogroup">${btns(["Recipes", "Shelves"], "aria-checked")}</div></div>`)}\n  ${item("5 · Cards with a line of description", "Small version of Tines\' team tabs, for choices that need explaining, like Glaze vs Stain in clay.", `<div class="tx-cards" role="radiogroup">${[["Glaze", "Full recipe: base to 100 plus colorants"], ["Stain in clay or slip", "Mason stain % of dry clay, grams per batch"]].map(([n, d], i) => `<button type="button" aria-checked="${i === 0}" ${pick}><b>${n}</b><span>${d}</span></button>`).join("")}</div>`)}\n</div>`',...(k=(h=n.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};const y=["TopTabs","Switches"];export{n as Switches,c as TopTabs,y as __namedExportsOrder,f as default};
