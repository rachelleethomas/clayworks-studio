const F={title:"Explorations/Brand surfaces"},a="#483C72",i={purple:["#D7C4FA","#A88FEF"],green:["#B0E0BD","#5EBC89"],pink:["#FAA3CA","#E269A4"],orange:["#FBBD74","#E49307"],blue:["#98BCF1","#4E8FD0"],clay:["#FFE5CA","#F0C89A"]},g=(s,l="0 0 140 170")=>`<svg viewBox="${l}" width="100%" height="100%" fill="none" stroke="${a}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">${s}</svg>`,r=(s,l,t,e)=>`<ellipse cx="${s+5}" cy="${l+2}" rx="${t}" ry="${e}" fill="${a}" stroke="none"/>`,o=(s,l,t,e,d,v,w)=>`<path d="M${s-t},${l} V${l+d} A${t},${e} 0 0 0 ${s+t},${l+d} V${l}" fill="${v}"/><ellipse cx="${s}" cy="${l}" rx="${t}" ry="${e}" fill="${w}"/>`,y=()=>g(`
  <defs><clipPath id="potClip"><path d="M50,126 C40,108 40,92 54,78 C61,71 61,64 59,56 H81 C79,64 79,71 86,78 C100,92 100,108 90,126 Z"/></clipPath></defs>
  ${r(70,150,52,11)}
  <rect x="64" y="132" width="12" height="18" fill="${i.purple[1]}"/>
  ${o(70,128,50,11,7,i.purple[1],i.purple[0])}
  <path d="M50,126 C40,108 40,92 54,78 C61,71 61,64 59,56 H81 C79,64 79,71 86,78 C100,92 100,108 90,126 Z" fill="${i.clay[0]}"/>
  <g clip-path="url(#potClip)"><path d="M30,40 H110 V96 C104,96 103,104 99,104 C95,104 95,94 90,94 C86,94 86,110 81,110 C76,110 77,96 72,96 C67,96 67,106 62,106 C57,106 58,95 53,95 C48,95 47,101 43,101 C38,101 36,95 30,95 Z" fill="${i.green[1]}"/>
    <path d="M30,74 H110 V82 H30 Z" fill="${i.green[0]}" stroke="none"/></g>
  <path d="M50,126 C40,108 40,92 54,78 C61,71 61,64 59,56 H81 C79,64 79,71 86,78 C100,92 100,108 90,126 Z"/>
  <ellipse cx="70" cy="56" rx="11" ry="3" fill="${a}"/>
  <path d="M112,52 l4,-6 M118,60 l7,-2 M114,70 l7,3" stroke="${i.pink[1]}" stroke-width="2"/>`),h=()=>g(`
  ${r(42,150,26,7)}${r(84,150,22,6)}${r(118,150,16,5)}
  ${o(42,70,26,7,80,i.orange[0],i.orange[1])}
  <ellipse cx="42" cy="70" rx="20" ry="4.5" fill="#BB781B"/>
  <path d="M30,78 v10 q0,4 3,0 v-10 M50,78 v16 q0,4 3,0 v-16" fill="${i.orange[1]}"/>
  <rect x="28" y="104" width="28" height="18" rx="2" fill="#fff"/><path d="M33,110 h18 M33,116 h12"/>
  ${o(84,98,22,6,52,i.pink[0],i.pink[1])}
  <ellipse cx="84" cy="98" rx="17" ry="4" fill="#C0508A"/>
  <path d="M74,105 v8 q0,4 3,0 v-8" fill="${i.pink[1]}"/>
  <rect x="72" y="118" width="24" height="15" rx="2" fill="#fff"/><path d="M76,123 h16 M76,128 h10"/>
  ${o(118,114,16,5,36,i.green[0],i.green[1])}
  <ellipse cx="118" cy="114" rx="12" ry="3.2" fill="#2A8B5E"/>
  <path d="M96,40 L80,96" stroke-width="3"/><path d="M96,40 L80,96" stroke="${i.blue[0]}" stroke-width="1.4"/>
  <ellipse cx="80" cy="97" rx="6" ry="3" fill="${i.blue[1]}"/>`),x=()=>g(`
  ${r(62,150,46,10)}
  ${o(62,52,44,10,98,i.purple[0],i.purple[1])}
  <path d="M18,72 A44,10 0 0 0 106,72 M18,104 A44,10 0 0 0 106,104 M18,134 A44,10 0 0 0 106,134"/>
  <circle cx="44" cy="90" r="4" fill="${a}"/><circle cx="80" cy="90" r="4" fill="${a}"/>
  <rect x="58" y="34" width="8" height="14" fill="${i.purple[1]}"/>
  <path d="M60,28 q-4,-6 2,-10 q6,-4 2,-10" stroke="${i.pink[1]}" stroke-width="2"/>
  <rect x="104" y="80" width="30" height="40" rx="4" fill="${i.blue[0]}"/>
  <circle cx="119" cy="96" r="10" fill="#fff"/>
  <path d="M119,96 V86 A10,10 0 0 1 128.5,99 Z" fill="${i.orange[1]}"/><path d="M119,96 L128.5,99 A10,10 0 0 1 112,103 Z" fill="${i.pink[1]}"/>
  <rect x="110" y="110" width="18" height="5" rx="2" fill="${a}"/>
  <rect x="4" y="150" width="40" height="6" rx="2" fill="${i.clay[1]}"/>
  <path d="M10,150 L14,124 L18,150 Z" fill="${i.orange[0]}"/><path d="M20,150 L25,128 Q28,126 30,134 L28,150 Z" fill="${i.orange[0]}"/><path d="M31,150 L34,138 Q38,134 42,142 L40,150 Z" fill="${i.orange[1]}"/>`),u=()=>{const s=[i.green,i.blue,i.pink,i.purple,i.orange],l=(t,e,d,v)=>`<g>
    <path d="M${t},${e} h18 v44 h-18 Z" fill="${i.clay[0]}"/>
    <path d="M${t},${e} h18 v${22+v%2*4} q-2,4 -4,0 q-3,6 -5,0 q-2,3 -4,0 q-3,5 -5,0 Z" fill="${d[1]}"/>
    <path d="M${t},${e+6} h18" stroke="${d[0]}" stroke-width="3"/>
    <circle cx="${t+9}" cy="${e+5}" r="2.4" fill="${a}"/>
    <path d="M${t},${e+44} h18 v6 h-26 Z" fill="${i.clay[1]}"/></g>`;return g(`
    ${r(70,140,60,8)}
    <rect x="8" y="130" width="124" height="10" rx="3" fill="${i.purple[1]}"/>
    <path d="M14,60 V130 M126,60 V130" stroke-width="2.2"/>
    <path d="M10,58 H130" stroke-width="3"/>
    ${s.map((t,e)=>l(16+e*22,66+e%2*8,t,e)).join("")}
    <path d="M22,36 h14 M29,29 v14" stroke="${i.pink[1]}" stroke-width="2.4"/><circle cx="112" cy="34" r="5" fill="${i.green[0]}"/>`)},A={purple:{strong:"#9F94FF",s200:"#BBB5FF",s100:"#DBD7FF",card:"#EBE8FC",ink:"#3F2374",line:"#BBB5FF"},green:{strong:"#33B17F",s200:"#7AC8A2",s100:"#BDDFCB",card:"#DDEBE1",ink:"#00452A",line:"#7AC8A2"},pink:{strong:"#F573B4",s200:"#FF9DCA",s100:"#FECADD",card:"#FDE1E9",ink:"#621D3E",line:"#FF9DCA"},orange:{strong:"#F6A400",s200:"#FFBD53",s100:"#FFDAA1",card:"#FFE5CA",ink:"#552D14",line:"#FFBD53"}},c=(s,l,t)=>{const e=A[s];return`
  <div style="border:1px solid ${e.line};border-radius:14px;overflow:hidden;background:${e.card};display:grid">
    <div style="background:${e.strong};height:220px;display:grid;place-items:center;padding:18px"><div style="width:150px;height:180px">${t}</div></div>
    <div style="height:14px;background:${e.s200}"></div><div style="height:14px;background:${e.s100}"></div>
    <div style="padding:20px 22px 24px;font:300 26px/1.1 var(--display);letter-spacing:-.01em;color:${e.ink}">${l}</div>
  </div>`},n=()=>`<div style="display:grid;gap:18px;max-width:1000px">
  <p class="note" style="max-width:72ch;margin:0">Tines' illustration recipe, redrawn with studio subjects: one dark violet outline (#483C72), thin round strokes, flat fills in a light and mid tint of one color, front-on shapes with flat oval tops, and a solid dark shadow offset down-right. Shown in Tines' link card: strong panel, two stepped bands, light title block.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px">
    ${c("green","Discover",y())}
    ${c("orange","My Studio",h())}
    ${c("purple","My Work",x())}
    ${c("pink","Test tiles",u())}
  </div>
  <span class="lbl">Small spot use (empty states, section headers)</span>
  <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
    ${[y,h,x,u].map(s=>`<div style="width:72px;height:88px">${s()}</div>`).join("")}
    <div class="empty" style="display:flex;gap:16px;align-items:center;max-width:520px"><div style="width:64px;height:78px;flex:none">${h()}</div><div>Your studio is empty. Tap Search &amp; add to find stains, glazes, clay bodies and chemicals.</div></div>
  </div></div>`;n.storyName="Pottery illustrations";const p=()=>`<div style="display:grid;gap:26px;max-width:1000px">
  <div style="display:grid;gap:8px"><span class="lbl">Dot grid · .dotgrid · Match colors panel as a test-tile board</span>
    <div class="dotgrid" style="border:2px solid var(--purple-300);border-radius:var(--radius);padding:22px;display:grid;gap:12px">
      <span class="lbl">Colors to match</span>
      <div class="chips">${["ACB0AB","BAABAB","70626E","48333B"].map(s=>`<span class="chip"><i style="background:#${s}"></i>${s}<button type="button">×</button></span>`).join("")}</div>
      <div style="display:flex;gap:10px"><button class="btn" type="button">Get recipes</button><button class="ghost" type="button">Use a photo</button></div>
    </div></div>
  <div style="display:grid;gap:8px"><span class="lbl">Blueprint grid · .blueprint · My Work planner (planning)</span>
    <div class="blueprint" style="border:1px solid var(--line);border-radius:var(--radius);padding:22px;min-height:150px;display:grid;align-content:start;gap:8px">
      <span class="lbl">This week</span><div style="font:300 28px/1.1 var(--display)">Bisque Thursday · glaze fire Saturday</div>
      <p class="note" style="margin:0">Blueprints signal planning, so it fits the planner and recipe lab, not browsing.</p></div></div>
  <div style="display:grid;gap:8px"><span class="lbl">Bento · .bento · My Studio overview</span>
    <div class="bento">
      <div class="wide" style="background:var(--tint-purple);border:1px solid var(--tint-purple-line);color:var(--tint-purple-ink)"><span class="lbl">Recipes</span><div style="font:300 40px/1.1 var(--display)">12 saved</div><p style="margin:6px 0 0">3 tested this month · bark palette in progress</p></div>
      <div style="background:var(--tint-green);border:1px solid var(--tint-green-line);color:var(--tint-green-ink)"><span class="lbl">On the shelf</span><div style="font:300 40px/1.1 var(--display)">6</div><p style="margin:6px 0 0">stains and clay bodies</p></div>
      <div style="background:var(--tint-orange);border:1px solid var(--tint-orange-line);color:var(--tint-orange-ink)"><span class="lbl">To buy</span><div style="font:300 40px/1.1 var(--display)">2</div><p style="margin:6px 0 0">6500 Sage, 6020 Pink</p></div>
      <div class="dotgrid" style="border:1px solid var(--line)"><span class="lbl">Palette</span><div style="display:flex;gap:6px;margin-top:10px">${["ACB0AB","BAABAB","70626E","48333B","20161B"].map(s=>`<i style="width:28px;height:28px;border-radius:50%;background:#${s};display:block"></i>`).join("")}</div></div>
      <div class="wide" style="background:var(--surface);border:1px solid var(--line)"><span class="lbl">Last test</span><div style="font:300 26px/1.1 var(--display);margin-top:6px">Satin Slate on porcelain, cone 6</div><p class="note" style="margin:6px 0 0">Bubbled where thick. Try 10 min hold.</p></div>
    </div></div>
  <div style="display:grid;gap:8px"><span class="lbl">A surface that is a color (Tines: "surfaces should feel like they are a color")</span>
    <div style="background:#9F94FF;border-radius:var(--radius);padding:28px;display:grid;grid-template-columns:1fr 140px;gap:20px;align-items:center;color:#fff">
      <div><div style="font:300 44px/1.1 var(--display);letter-spacing:-.02em">Find a glaze that fits your shelf</div><p style="margin:10px 0 0;font-size:16px">3,309 tested Glazy recipes at cone 5–6.</p></div>
      <div style="height:170px">${y()}</div></div></div>
</div>`;p.storyName="Dot grid, blueprint, bento";var f,b,$;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`() => \`<div style="display:grid;gap:18px;max-width:1000px">
  <p class="note" style="max-width:72ch;margin:0">Tines' illustration recipe, redrawn with studio subjects: one dark violet outline (#483C72), thin round strokes, flat fills in a light and mid tint of one color, front-on shapes with flat oval tops, and a solid dark shadow offset down-right. Shown in Tines' link card: strong panel, two stepped bands, light title block.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px">
    \${card("green", "Discover", wheelPot())}
    \${card("orange", "My Studio", glazeBuckets())}
    \${card("purple", "My Work", kiln())}
    \${card("pink", "Test tiles", testTiles())}
  </div>
  <span class="lbl">Small spot use (empty states, section headers)</span>
  <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
    \${[wheelPot, glazeBuckets, kiln, testTiles].map(f => \`<div style="width:72px;height:88px">\${f()}</div>\`).join("")}
    <div class="empty" style="display:flex;gap:16px;align-items:center;max-width:520px"><div style="width:64px;height:78px;flex:none">\${glazeBuckets()}</div><div>Your studio is empty. Tap Search &amp; add to find stains, glazes, clay bodies and chemicals.</div></div>
  </div></div>\``,...($=(b=n.parameters)==null?void 0:b.docs)==null?void 0:$.source}}};var k,m,B;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`() => \`<div style="display:grid;gap:26px;max-width:1000px">
  <div style="display:grid;gap:8px"><span class="lbl">Dot grid · .dotgrid · Match colors panel as a test-tile board</span>
    <div class="dotgrid" style="border:2px solid var(--purple-300);border-radius:var(--radius);padding:22px;display:grid;gap:12px">
      <span class="lbl">Colors to match</span>
      <div class="chips">\${["ACB0AB", "BAABAB", "70626E", "48333B"].map(h => \`<span class="chip"><i style="background:#\${h}"></i>\${h}<button type="button">×</button></span>\`).join("")}</div>
      <div style="display:flex;gap:10px"><button class="btn" type="button">Get recipes</button><button class="ghost" type="button">Use a photo</button></div>
    </div></div>
  <div style="display:grid;gap:8px"><span class="lbl">Blueprint grid · .blueprint · My Work planner (planning)</span>
    <div class="blueprint" style="border:1px solid var(--line);border-radius:var(--radius);padding:22px;min-height:150px;display:grid;align-content:start;gap:8px">
      <span class="lbl">This week</span><div style="font:300 28px/1.1 var(--display)">Bisque Thursday · glaze fire Saturday</div>
      <p class="note" style="margin:0">Blueprints signal planning, so it fits the planner and recipe lab, not browsing.</p></div></div>
  <div style="display:grid;gap:8px"><span class="lbl">Bento · .bento · My Studio overview</span>
    <div class="bento">
      <div class="wide" style="background:var(--tint-purple);border:1px solid var(--tint-purple-line);color:var(--tint-purple-ink)"><span class="lbl">Recipes</span><div style="font:300 40px/1.1 var(--display)">12 saved</div><p style="margin:6px 0 0">3 tested this month · bark palette in progress</p></div>
      <div style="background:var(--tint-green);border:1px solid var(--tint-green-line);color:var(--tint-green-ink)"><span class="lbl">On the shelf</span><div style="font:300 40px/1.1 var(--display)">6</div><p style="margin:6px 0 0">stains and clay bodies</p></div>
      <div style="background:var(--tint-orange);border:1px solid var(--tint-orange-line);color:var(--tint-orange-ink)"><span class="lbl">To buy</span><div style="font:300 40px/1.1 var(--display)">2</div><p style="margin:6px 0 0">6500 Sage, 6020 Pink</p></div>
      <div class="dotgrid" style="border:1px solid var(--line)"><span class="lbl">Palette</span><div style="display:flex;gap:6px;margin-top:10px">\${["ACB0AB", "BAABAB", "70626E", "48333B", "20161B"].map(h => \`<i style="width:28px;height:28px;border-radius:50%;background:#\${h};display:block"></i>\`).join("")}</div></div>
      <div class="wide" style="background:var(--surface);border:1px solid var(--line)"><span class="lbl">Last test</span><div style="font:300 26px/1.1 var(--display);margin-top:6px">Satin Slate on porcelain, cone 6</div><p class="note" style="margin:6px 0 0">Bubbled where thick. Try 10 min hold.</p></div>
    </div></div>
  <div style="display:grid;gap:8px"><span class="lbl">A surface that is a color (Tines: "surfaces should feel like they are a color")</span>
    <div style="background:#9F94FF;border-radius:var(--radius);padding:28px;display:grid;grid-template-columns:1fr 140px;gap:20px;align-items:center;color:#fff">
      <div><div style="font:300 44px/1.1 var(--display);letter-spacing:-.02em">Find a glaze that fits your shelf</div><p style="margin:10px 0 0;font-size:16px">3,309 tested Glazy recipes at cone 5–6.</p></div>
      <div style="height:170px">\${wheelPot()}</div></div></div>
</div>\``,...(B=(m=p.parameters)==null?void 0:m.docs)==null?void 0:B.source}}};const M=["PotteryIllustrations","Surfaces"];export{n as PotteryIllustrations,p as Surfaces,M as __namedExportsOrder,F as default};
