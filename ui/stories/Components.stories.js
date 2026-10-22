// Each story renders the same markup and classes the app builds, so styles come straight from app/clayworks.html.
import FRAG from "../styles/fragments.js";
export default { title: "Components" };

const row = (...items) => `<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">${items.join("")}</div>`;
const stack = (...items) => `<div style="display:grid;gap:22px;max-width:960px">${items.join("")}</div>`;
const label = (t) => `<span class="lbl">${t}</span>`;
const sw = (hex) => `background:#${hex}`;
const table = (rows, batch) => `<table>${rows.map(([n, p, cls]) =>
  `<tr class="${cls || ""}"><td>${cls === "add" ? "+ " : ""}${n}</td><td class="n">${p}%</td><td class="n">${batch ? Math.round(batch * p / 100) + " g" : ""}</td></tr>`).join("")}</table>`;
const baseRows = [["Custer Feldspar *", 20], ["EP Kaolin *", 20], ["Ferro Frit 3134 *", 20], ["Silica *", 20], ["Wollastonite *", 20], ["Base total", 100, "sub"], ["Yellow Ochre *", 8, "add"]];

export const Buttons = {
  args: { label: "Get recipes" },
  render: ({ label: l }) => stack(
    label("Primary · .btn"), row(`<button class="btn" type="button">${l}</button>`, `<button class="btn" type="button" disabled>Working…</button>`),
    label("Secondary · .ghost and .ghost.sm"), row(`<button class="ghost" type="button">Search &amp; add</button>`, `<button class="ghost sm" type="button">Save</button>`, `<button class="ghost sm" type="button">Copy</button>`),
    label("Text · .linkbtn"), row(`<button class="linkbtn" type="button">Edit on Shelves</button>`, `<button class="linkbtn" type="button">Delete</button>`)),
};

export const TabsAndSwitches = () => stack(
  label("Top-level tabs · .topbar .tabs"),
  `<header class="topbar" style="position:static"><a class="brand" href="#"><span class="mark" aria-hidden="true"></span><span class="brand-name">Clayworks Studio</span></a>
    <div class="tabs" role="tablist"><button role="tab" aria-selected="true">Discover</button><button role="tab" aria-selected="false">My Studio</button><button role="tab" aria-selected="false">My Work</button></div>
    <div class="acct"><div class="cw-user"><button class="cw-avatar" type="button" aria-label="Account">R</button></div></div></header>`,
  label("Segmented switch · .seg"),
  `<div class="seg dmode" role="radiogroup" style="max-width:320px"><button role="radio" aria-checked="true">Search</button><button role="radio" aria-checked="false">Match colors</button></div>`,
  `<div class="seg" role="radiogroup" style="max-width:420px"><button role="radio" aria-checked="true">Glaze</button><button role="radio" aria-checked="false">Stain in clay or slip</button></div>`,
  label("Filter pills · .filters (My Studio)"),
  `<div class="filters"><button aria-pressed="true">All<b>12</b></button><button aria-pressed="false">Stains<b>5</b></button><button aria-pressed="false">Glazes<b>4</b></button><button aria-pressed="false">Chemicals<b>3</b></button></div>`);
TabsAndSwitches.storyName = "Tabs and switches";

export const ChipsAndBadges = () => stack(
  label("Color chips · .fchip (filters)"),
  `<div class="fchips">${[["Clear", ""], ["White", "F2F0EA"], ["Gray", "9A9A9A"], ["Blue", "2C4FA8"], ["Purple", "6A3A82"], ["Pink", "D9868C"]].map(([n, c], i) =>
    `<button class="fchip" aria-pressed="${i === 3}">${c ? `<i style="${sw(c)}"></i>` : `<i class="clear"></i>`}${n}</button>`).join("")}</div>`,
  label("Active filter · .fx with Clear all"),
  row(`<button class="fx">Blue<b>×</b></button>`, `<button class="fx">Oxidation<b>×</b></button>`, `<button class="fclear">Clear all</button>`),
  label("Hex chips · .chip"),
  `<div class="chips">${["ACB0AB", "BAABAB", "48333B"].map((h) => `<span class="chip"><i style="${sw(h)}"></i>${h}<button type="button" aria-label="Remove ${h}">×</button></span>`).join("")}</div>`,
  label("Source badges · .srcb"),
  row(`<span class="srcb new">New</span>`, `<span class="srcb glazy">Glazy</span>`, `<span class="srcb mine">Mine</span>`),
  label("Status pills · .pill"),
  row(`<span class="pill have">On hand</span>`, `<span class="pill buy">Needs stain</span>`));
ChipsAndBadges.storyName = "Chips and badges";

export const Inputs = () => stack(
  label("Search box · .askbox"),
  `<form class="askbox" onsubmit="return false"><label class="sr-only" for="sb-q">Search</label><input type="search" id="sb-q" placeholder="Search Glazy and your recipes: celadon, satin black, or a hex like 70626E"><button class="btn" type="submit">Search</button></form>`,
  `<div class="row" style="max-width:520px"><div class="field"><label for="sb-cone">Firing</label><select id="sb-cone"><option>Cone 6 oxidation</option></select></div><div class="field"><label for="sb-batch">Batch (g dry)</label><input type="number" id="sb-batch" value="1000"></div></div>`,
  `<div class="field" style="max-width:520px"><label for="sb-hex">Hex codes</label><textarea id="sb-hex">ACB0AB, BAABAB, 48333B</textarea></div>`,
  label("Sort / small select · .fcount select"), `<div class="fcount" style="max-width:520px;margin:0"><p class="note">471 of 3,309 Glazy recipes</p><label class="fsort"><span class="lbl">Sort</span><select><option>Best match</option><option>Name</option></select></label></div>`);

export const DiscoverResult = () => `<div id="askResults" style="max-width:980px">
  <article class="acard new"><div class="im" style="${sw("70626E")}"></div><div class="body"><span class="srcb new">New</span><h4>Bark satin</h4><div class="meta">Glaze for #70626E · adapted from Glazy #3033</div><p class="note">Satin gray with a plum cast. Add 0.5% red iron oxide if it reads too cool.</p><p class="note warn">Test for leaching before using on food surfaces.</p><details><summary>Recipe</summary>${table(baseRows, 1000)}</details></div><div class="acts"><button class="ghost sm">Save</button></div></article>
  <article class="acard glazy"><div class="im" style="background:repeating-linear-gradient(45deg,#E6E2DB 0 8px,#EFEBE5 8px 16px)"></div><div class="body"><span class="srcb glazy">Glazy</span><h4>AC Semi-Matte Dark Grey</h4><div class="meta">Glazy #3030 · Alisa Liskin Clausen · cone 6 · Semi-matte</div><details><summary>Recipe</summary>${table(baseRows, 1000)}</details></div><div class="acts"><button class="ghost sm">Save</button><a class="note" href="#">View on Glazy</a></div></article>
  <article class="acard store"><div class="im" style="${sw("3E7DA6")}" title="Approximate color, estimated from the product name"></div><div class="body"><span class="srcb store">Premade</span><h4>Amaco PC-26 Blue Lagoon</h4><div class="meta">Glaze · Potter's Choice · cone 5-6</div><p class="note">Color estimated from the name. Check the supplier's photo before you buy.</p><p class="note">Also at The Ceramic Shop, Sheffield Pottery</p></div><div class="acts"><a class="ghost sm" href="#">Buy at Alligator Clay</a></div></article>
</div>`;
DiscoverResult.storyName = "Discover result card";

export const RecipeCard = () => `<div class="savedgrid" style="max-width:700px">
  <article class="rcard"><div class="glaze" style="${sw("D8DAD5")}"></div><div class="in"><input type="text" class="ttl" value="amber celadon" aria-label="Recipe name"><div class="meta">Glaze · Cone 6 · Satin · saved Oct 20, 2026</div><p class="note">From Glazy #9199 by chance taylor · <a href="#">view</a></p><label class="batch">Batch<input type="number" value="1000">g dry glaze</label>${table(baseRows, 1000)}<textarea placeholder="Test notes: how it fired, what to change next…" aria-label="Test notes"></textarea><div class="links"><button class="ghost sm">Copy</button><button class="linkbtn">Delete</button></div></div></article>
  <article class="rcard"><div class="gsw" style="${sw("726A85")}"><span>≈ #726A85 · 2021</span></div><div class="in"><h4>Kittens Clear Purple/Gray</h4><div class="meta">Glazy #10886 · Meghan Yarnell · cone 6 · Glossy · Translucent</div>${table([["Silica *", 32.8], ["Nepheline Syenite *", 24], ["Gerstley Borate *", 16.8], ["Base total", 100, "sub"], ["Cobalt Carbonate *", .25, "add"]], 0)}<div class="links"><button class="ghost sm">Save</button><a href="#">View on Glazy</a></div></div></article>
</div>`;
RecipeCard.storyName = "Recipe card (My Studio, Library)";

export const TestTile = () => `<div class="tiles" style="max-width:640px">
  <article class="tile"><div class="glaze" style="${sw("ACB0AB")}"><span>target</span></div><div class="in"><h4>Clean sage</h4><span class="pill buy">Needs stain</span>${table([["6500 Sage *", 4], ["6020 Manganese Alumina Pink *", .5]], 3629)}<p class="note">6020 warms the green toward bark gray.</p><div class="links"><button class="ghost sm">Save</button><a href="#">Fired results on Glazy</a><button class="ghost sm">Copy</button></div></div></article>
  <article class="tile"><div class="glaze" style="${sw("48333B")}"><span>expected #48333B</span></div><div class="in"><h4>Iron plum</h4><span class="pill have">On hand</span>${table([["6110 Violet Iron", 7], ["6600 Best Black", 2]], 3629)}<div class="links"><button class="ghost sm">Save</button></div></div></article>
</div>`;
TestTile.storyName = "Test tile (Color match)";

export const ShelfItem = () => `<div class="items" style="max-width:720px">
  <div class="item"><span class="sw" style="${sw("1E1E20")}"></span><div><h4>6600 Best Black</h4><div class="meta">Mason</div><a class="note" href="#">View at Sheffield Pottery</a><div class="note">body OK</div><div class="acts"><button class="linkbtn">Remove</button></div></div></div>
  <div class="item"><span class="sw jar" style="${sw("5C6F86")}"></span><div><h4>PC-20 Blue Rutile</h4><div class="meta">Amaco · Potter's Choice · Cone 5–6</div><div class="acts"><button class="linkbtn">Remove</button></div></div></div>
  <div class="item"><span class="sw bag" style="${sw("E6E4DE")}"></span><div><h4>Frit 3134</h4><div class="meta">Ferro</div><div class="acts"><button class="linkbtn">Remove</button></div></div></div>
</div>`;

export const FilterBar = () => `<div style="max-width:1100px">
  <div class="fbar">
    <div class="fddw"><button class="fdd" type="button">Make ▾</button></div>
    <div class="fddw"><button class="fdd set" type="button" aria-expanded="true">Color · 1 ▾</button>
      <div class="fpop" role="dialog" aria-label="Color"><div class="fchips">${[["White", "F2F0EA"], ["Gray", "9A9A9A"], ["Blue", "2C4FA8"], ["Teal", "2C8C8C"], ["Purple", "6A3A82"]].map(([n, c]) => `<button class="fchip" aria-pressed="${n === "Blue"}"><i style="${sw(c)}"></i>${n}</button>`).join("")}</div></div></div>
    <div class="fddw"><button class="fdd" type="button">Surface ▾</button></div>
    <div class="fddw"><button class="fdd" type="button">Opacity ▾</button></div>
    <div class="fddw"><button class="fdd" type="button">Style ▾</button></div>
    <div class="fddw"><button class="fdd" type="button">Colorant ▾</button></div>
    <div class="fddw"><button class="fdd" type="button">More ▾</button></div>
    <div class="factive"><span style="width:1px;height:22px;background:var(--line);margin:0 4px"></span><button class="fx">Blue<b>×</b></button><button class="fx">Oxidation<b>×</b></button><button class="fclear">Clear all</button></div>
  </div>
  <div class="fcount" style="margin-top:10px"><p class="note">471 of 3,309 Glazy recipes</p><label class="fsort"><span class="lbl">Sort</span><select><option>Best match</option></select></label></div>
  <div style="height:220px"></div>
</div>`;
FilterBar.storyName = "Filter bar (open Color dropdown)";

export const AccountMenu = () => `<div class="cw-user" style="display:inline-block;margin-left:300px">
  <button class="cw-avatar" type="button" aria-expanded="true">G</button>
  <div class="cw-menu" style="position:absolute"><div class="who"><span class="cw-avatar" aria-hidden="true">G</span><div><b>grace</b><small>Signed in</small></div></div>
    <div class="cw-spend"><span class="lbl">Spent this week</span><div class="amt">$0.42<span>of $3.00</span></div><span class="cw-meter"><i style="width:14%"></i></span><span class="note">Resets Mon, Oct 26.</span></div>
    <button class="cw-mitem" type="button">Send an idea</button><button class="cw-mitem out" type="button">Log out</button></div></div>`;
AccountMenu.storyName = "Account menu";

export const IdeaDialog = () => `<dialog open class="cw-dialog" style="position:static;margin:0"><div class="cw-dhead"><h2>Send Rachel an idea</h2><button class="linkbtn">Close</button></div>
  <div class="cw-dbody"><form class="cw-ideaform" onsubmit="return false"><label class="lbl" for="sb-idea">Your idea</label><textarea id="sb-idea" rows="5" placeholder="What would make Clayworks better?"></textarea><p class="note">Sent with your name and the page you're on (Discover).</p><div class="links"><button class="btn">Send</button><button class="linkbtn" type="button">Cancel</button></div></form></div></dialog>`;
IdeaDialog.storyName = "Dialog (Send an idea)";

export const EmptyAndNotices = () => stack(
  `<div class="empty"><p style="margin:0">Your studio is empty. Tap Search &amp; add to find stains, glazes, clay bodies and chemicals.</p><button class="ghost" type="button">Add what I have</button></div>`,
  `<div class="banner">Saving to this browser only. Log in to keep your studio on your account.</div>`,
  `<p class="fnote">The Glazy library is glazes only. Stain-in-clay recipes come from your notebook and from new recipes.</p>`,
  `<div class="shop"><h3>Shopping list</h3><p class="note">Stains not in your studio, for the first option of each color, plus about 25% for test tiles.</p><table><tr><td>6500 Sage</td><td class="n">145 g</td><td class="n">0.5 lb</td></tr><tr><td>6020 Manganese Alumina Pink</td><td class="n">18 g</td><td class="n">0.25 lb</td></tr></table></div>`);
EmptyAndNotices.storyName = "Empty states and notices";

export const CheckboxesAndToggles = () => stack(
  label("Checkbox · .check (More filters, Search & add)"),
  row(`<label class="check"><input type="checkbox" checked> Glazy library</label>`, `<label class="check"><input type="checkbox"> No zinc</label>`, `<label class="check"><input type="checkbox" disabled> Disabled</label>`),
  label("Toggle pill · .mtog (Match colors)"),
  row(`<label class="mtog"><input type="checkbox" checked><i aria-hidden="true"></i>Food-safe</label>`, `<label class="mtog"><input type="checkbox"><i aria-hidden="true"></i>Prefer stains I already have</label>`));
CheckboxesAndToggles.storyName = "Checkboxes and toggles";

// Pulled live from app/clayworks.html by scripts/extract_css.py
export const MatchForm = () => {
  const d = document.createElement("div");
  d.id = "matchPanel"; d.style.maxWidth = "880px";
  d.innerHTML = FRAG.matchForm || "<p class='note'>Run npm run sync-css</p>";
  const f = d.querySelector("form"); f.onsubmit = (e) => e.preventDefault();
  const body = d.querySelector("#body"); if (body) body.innerHTML = "<option>White porcelain</option><option>Buff stoneware</option>";
  const chips = d.querySelector("#chips"); if (chips) chips.innerHTML = `<span class="chip"><i style="${sw("ACB0AB")}"></i>ACB0AB<button type="button">×</button></span>`;
  const inv = d.querySelector("#invChips"); if (inv) inv.innerHTML = ["6006", "6363", "6364", "6219"].map((c) => `<span>${c}</span>`).join("");
  const hex = d.querySelector("#hexes"); if (hex) hex.value = "ACB0AB";
  const seg = [...d.querySelectorAll(".seg button")];
  const mode = (m) => { seg.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.mode === m)));
    d.querySelectorAll(".stain-only").forEach((e) => (e.hidden = m !== "stain")); d.querySelectorAll(".glaze-only").forEach((e) => (e.hidden = m !== "glaze")); };
  seg.forEach((b) => (b.onclick = () => mode(b.dataset.mode))); mode("glaze");
  return d;
};
MatchForm.storyName = "Match colors form (live markup)";

export const MatchResults = () => `<div class="board" style="max-width:900px">
  <div class="boardhead"><h2>Test tiles</h2><span class="tag">White porcelain · Cone 6 oxidation · 3629 g dry clay</span></div>
  <section class="color"><div class="colorhead"><span class="target" style="${sw("ACB0AB")}"></span><div><h3>#ACB0AB</h3><p>Sage gray, cool</p></div></div>
    <div class="tiles"><article class="tile"><div class="glaze" style="${sw("A9AEA6")}"><span>expected #A9AEA6</span></div><div class="in"><h4>Clean sage</h4><span class="pill buy">Needs stain</span>${table([["6500 Sage *", 4]], 3629)}<div class="links"><button class="ghost sm">Save</button><a href="#">Fired results on Glazy</a></div></div></article></div></section>
  <div class="shop"><h3>Shopping list</h3><p class="note">Stains not in your studio, plus about 25% for test tiles.</p><table><tr><td>6500 Sage</td><td class="n">145 g</td><td class="n">0.5 lb</td></tr></table></div>
</div>`;
MatchResults.storyName = "Match results (board, tiles, shopping list)";

export const ShelvesPage = () => `<div class="studio" style="max-width:1000px">
  <div class="seg mineseg" role="radiogroup"><button role="radio" aria-checked="false">Recipes</button><button role="radio" aria-checked="true">Shelves</button></div>
  <div class="shelfbar"><div class="filters"><button aria-pressed="true">All<b>6</b></button><button aria-pressed="false">Stains<b>5</b></button><button aria-pressed="false">Clay bodies<b>1</b></button></div><button class="btn" type="button">Search &amp; add</button></div>
  <div class="shelves"><section class="shelf"><div class="shelfhead"><h2>Stains</h2><span>5 items</span></div>
    <div class="items"><div class="item"><span class="sw" style="${sw("8A2A35")}"></span><div><h4>6006 Deep Crimson</h4><div class="meta">Mason</div><div class="acts"><button class="linkbtn">Remove</button></div></div></div>
    <div class="item"><span class="sw" style="${sw("86A6D6")}"></span><div><h4>6363 Sky Blue</h4><div class="meta">Mason</div><div class="acts"><button class="linkbtn">Remove</button></div></div></div></div></section></div>
</div>`;
ShelvesPage.storyName = "Shelves page (switch, filters, shelf)";

export const SearchAndAdd = () => `<div class="addinner" style="padding:0;max-width:1000px">
  <div class="addhead"><h2>Search &amp; add</h2><button class="ghost" type="button">Done</button></div>
  <div class="searchbar"><input type="search" value="blue" aria-label="Search"><button class="btn" type="button">Add from photo</button></div>
  <div class="quick"><select><option>All stores</option></select><select><option>All types</option></select><select><option>Browse a product line…</option></select><button class="ghost" type="button">Paste a list</button></div>
  <div class="bulkbar"><button class="btn" type="button">Add 1 selected</button><button class="linkbtn" type="button">Clear</button></div>
  <div class="results"><div style="display:flex;gap:12px;align-items:center"><h3>203 matches</h3><button class="linkbtn" type="button">Select all shown</button></div>
    <div class="rlist">${[["Laguna SG-98 Blue", "Glaze · ^5 · Laguna Clay", "D6D6D2", false], ["Amaco Celadon C-11 Blue Spark", "Glaze · Cone 5–6 · The Ceramic Shop", "60789F", true], ["Mason 6363 Sky Blue", "Stain · body OK · Sheffield Pottery", "86A6D6", false]].map(([n, m, c, on]) =>
      `<div class="ritem" ${on ? 'style="background:var(--wash)"' : ""}><input type="checkbox" ${on ? "checked" : ""} aria-label="Select"><span class="sw" style="${sw(c)}"></span><div class="nm"><b>${n}</b><small>${m}</small></div><button class="ghost sm" type="button">Add</button></div>`).join("")}</div></div>
</div>`;
SearchAndAdd.storyName = "Search & add panel";

export const StatusMessages = () => stack(
  `<p class="status">Done. Change batch size or water % to recalculate grams.</p>`,
  `<p class="status err">Couldn't reach the recipe service. Try again in a minute.</p>`,
  `<p class="note">Recipes from Glazy contributors, shared under CC BY-NC-SA 4.0.</p>`,
  `<p class="note warn">Test for leaching before using on food surfaces.</p>`);
StatusMessages.storyName = "Status and notes";

export const LoginCard = () => `<div style="display:grid;place-items:center;padding:24px;background:var(--bg)">
  <form class="cw-card" onsubmit="return false"><span class="brand"><span class="mark" aria-hidden="true"></span><span class="brand-name">Clayworks Studio</span></span><h2>Log in</h2>
    <div class="field"><label for="lg-u">Name</label><input type="text" id="lg-u" value="grace"></div><div class="field"><label for="lg-p">Password</label><input type="password" id="lg-p" value="········"></div>
    <button class="btn" type="submit">Log in</button><p class="status err">That name and password don't match.</p></form></div>`;
LoginCard.storyName = "Login card (GitHub build)";

export const PageHeader = () => `<div class="wrap" style="max-width:1000px">
  <div class="intro"><h1>Discover</h1><p class="sub">Search tested Glazy recipes and your own, or switch to Match colors to get new stain and glaze recipes for a palette or photo.</p></div>
  <div class="discbar"><div class="seg dmode" role="radiogroup"><button role="radio" aria-checked="true">Search</button><button role="radio" aria-checked="false">Match colors</button></div>
    <form class="askbox" onsubmit="return false"><input type="search" aria-label="Search" placeholder="Search Glazy and your recipes: celadon, satin black, Frit 3134…"><button class="btn" type="submit">Search</button></form></div>
</div>`;
PageHeader.storyName = "Page header (title, intro, search bar)";

export const PasteAndPhoto = () => stack(
  label("Paste a list · .paste"),
  `<div class="paste"><label for="pl">One item per line</label><textarea id="pl">6600 Best Black
Frit 3134
Amaco PC-20</textarea><div class="links"><button class="btn" type="button">Find these</button><button class="linkbtn" type="button">Cancel</button></div></div>`,
  label("Add from photo · .photo + .found"),
  `<div class="photo"><div style="width:120px;height:120px;border-radius:8px;background:repeating-linear-gradient(45deg,#E6E2DB 0 8px,#EFEBE5 8px 16px)"></div>
    <div class="found">${[["Mason 6363 Sky Blue", "86A6D6", true], ["Amaco PC-20 Blue Rutile", "5C6F86", true], ["Unknown jar", "C9C3B8", false]].map(([n, c, on]) =>
      `<label class="f"><input type="checkbox" ${on ? "checked" : ""}><span class="sw" style="${sw(c)}"></span><span>${n}</span><select><option>Stain</option><option>Glaze</option></select></label>`).join("")}
      <div class="links"><button class="btn" type="button">Add 2 to shelves</button></div></div></div>`);
PasteAndPhoto.storyName = "Paste a list and Add from photo";

export const IdeasInbox = () => `<dialog open class="cw-dialog" style="position:static;margin:0"><div class="cw-dhead"><h2>Ideas inbox</h2><button class="linkbtn">Close</button></div>
  <div class="cw-dbody"><div class="cw-idea"><div class="cw-ideameta"><b>grace</b>Oct 21 · Discover</div><p>Could the shopping list say which store has each stain?</p><button class="ghost sm" type="button">Mark done</button></div>
  <div class="cw-idea done"><div class="cw-ideameta"><b>hannah</b>Oct 20 · My Studio</div><p>Dark mode please!</p></div></div></dialog>`;
IdeasInbox.storyName = "Ideas inbox (admin)";

export const RecipeSummaryCards = () => `<div class="savedgrid" style="max-width:900px">${[
  ["D8DAD5", "Amber celadon", "Glaze · Cone 6 · Satin", "testing", "Testing", true, "Pooled amber in the throwing lines, too thin on rims."],
  ["6E6068", "Satin plum", "Glaze · Cone 6 · Satin, opaque", "keeper", "Keeper", false, "Great on porcelain, 3 pieces."],
  ["A9AEA6", "Sage body", "Stain in clay body · Cone 6", "idea", "Idea", false, ""]].map(([c, t, m, k, l, ok, n]) =>
  `<article class="rcard rsum" tabindex="0" role="link"><div class="glaze" style="${sw(c)}"></div><div class="in"><div class="rhead"><h4>${t}</h4><span class="rst ${k}">${l}</span></div><div class="meta">${m}</div><div class="rshelf ${ok ? "ok" : "miss"}">${ok ? "✓ All on your shelves" : "○ Missing 1: Frit 3134"}</div><p class="rnote">${n ? "“" + n + "”" : "No test notes yet"}</p></div></article>`).join("")}</div>`;
RecipeSummaryCards.storyName = "Recipe summary cards (tap to open)";

export const RecipePage = () => `<div id="recipePage" style="max-width:1100px">
  <div class="rp-head"><div class="rp-sw" style="${sw("D8DAD5")}"></div><div class="rp-id"><button class="linkbtn rp-back" type="button">‹ My Studio · Recipes</button><input type="text" class="rp-title" value="Amber celadon"><div class="meta">Glaze · Cone 6 · Satin · saved Oct 20, 2026 · From Glazy #9199 by chance taylor · <a href="#" target="_blank" rel="noopener">view</a></div></div>
    <div class="rp-acts"><div class="seg rp-status" role="radiogroup"><button role="radio" aria-checked="false">Idea</button><button role="radio" aria-checked="true">Testing</button><button role="radio" aria-checked="false">Keeper</button></div><div class="links"><button class="ghost sm">Copy</button><button class="ghost sm">Print</button><button class="linkbtn">Delete</button></div></div></div>
  <div class="rp-nav" role="tablist"><button role="tab" aria-selected="true">Recipe</button>${["Tests & versions", "Swap", "Lab", "Cost & availability", "Used in"].map((t) => `<button role="tab" aria-selected="false" disabled>${t}<small>soon</small></button>`).join("")}</div>
  <div class="rp-body"><section class="rp-main"><div class="rp-batch"><label class="batch">Batch<input type="number" value="1000">g dry glaze</label><div class="rp-scale"><span class="lbl">Scale</span><button class="fdd">100 g</button><button class="fdd">300 g</button><button class="fdd">1 kg</button><button class="fdd">5 kg</button></div></div>
    <table class="rp-table"><tr class="hd"><th>Material</th><th class="n">%</th><th class="n">Grams</th><th class="n">Shelf</th></tr>${[["Custer Feldspar", 20, 1], ["EP Kaolin", 20, 1], ["Ferro Frit 3134", 20, 0], ["Silica", 20, 1], ["Wollastonite", 20, 1]].map(([n, p, h]) => `<tr><td>${n}</td><td class="n">${p}%</td><td class="n">${p * 10} g</td><td class="n ${h ? "ok" : "miss"}">${h ? "✓" : "○ need"}</td></tr>`).join("")}<tr class="sub"><td>Base total</td><td class="n">100%</td><td class="n">1000 g</td><td></td></tr><tr class="add"><td>+ Yellow Ochre</td><td class="n">8%</td><td class="n">80 g</td><td class="n ok">✓</td></tr></table></section>
  <aside class="rp-side"><div class="rp-box"><span class="lbl">On your shelves</span><p class="rshelf miss">○ Missing 1: Ferro Frit 3134</p><button class="linkbtn">Find them in Search &amp; add</button></div><div class="rp-box"><label class="lbl">Test notes</label><textarea rows="5">Pooled amber in the throwing lines, too thin on rims. Try 2 coats.</textarea></div></aside></div>
</div>`;
RecipePage.storyName = "Recipe page";
