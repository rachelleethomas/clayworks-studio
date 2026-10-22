"""Build the GitHub Pages version of Clayworks Studio from the artifact page.
usage: python3 build.py <API_BASE> [OUT_DIR]   → writes OUT_DIR/index.html (default docs/; local dev uses .local-site/)
"""
import os, sys
D = os.path.dirname(os.path.abspath(__file__))
api = sys.argv[1] if len(sys.argv) > 1 else "__API_BASE__"
s = open(os.path.join(D, "..", "app", "clayworks.html")).read()
shim = open(os.path.join(D, "shim.js")).read().replace("__API_BASE__", api.rstrip("/"))

def rep(a, b, count=1):
    global s
    assert s.count(a) == count, (a[:70], s.count(a))
    s = s.replace(a, b)

rep("<title>Your Studio</title>", "<title>Clayworks Studio</title>")
rep('<span class="brand-name">Your Studio</span>', '<span class="brand-name">Clayworks Studio</span>')
rep('aria-label="Your Studio, home"', 'aria-label="Clayworks Studio, home"')
rep('<meta name="claude:viewport-fit-sides" content="cover">\n', "")
rep("Open Your Studio in claude.ai while signed in to keep your studio on your account across devices.",
    "Log in to sync your shelves across devices.")
rep('function saveLocal(){try{localStorage.setItem("stainlab-studio",JSON.stringify(allDocs()))}catch{}}',
    'function saveLocal(){try{localStorage.setItem("stainlab-studio",JSON.stringify(allDocs()))}catch{};cwQueueSync()}')
rep('if(storeMode==="local"){n.hidden=false;', 'if(storeMode==="local"&&!CW.token){n.hidden=false;')
rep("Recipe generation isn't available here. Open the page in claude.ai while signed in.", "Log in to get recipes.")
# header user box + login overlay
rep('<div class="acct" id="acct"></div>', '<div class="acct" id="acct"><div class="cw-user" id="cwUser"></div></div>')
login = '''<div class="cw-login" id="cwLogin" hidden>
  <form class="cw-card" id="cwForm">
    <h2>Clayworks Studio</h2>
    <p class="note">Log in to your studio.</p>
    <div class="field"><label for="cwName">Username</label><input type="text" id="cwName" autocomplete="username" autocapitalize="none" required></div>
    <div class="field"><label for="cwPass">Password</label><input type="password" id="cwPass" autocomplete="current-password" required></div>
    <button class="btn" type="submit">Log in</button>
    <p class="status err" id="cwMsg" role="alert"></p>
  </form>
</div>
'''
css = '''
.cw-user{position:relative}
.cw-avatar{width:38px;height:38px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;cursor:pointer;
  font:600 15px var(--body);color:var(--tint-purple-ink);background:var(--tint-purple);border:1px solid var(--tint-purple-line);transition:box-shadow .15s}
.cw-avatar:hover,.cw-avatar[aria-expanded="true"]{box-shadow:0 0 0 3px var(--purple-200)}
.cw-menu{position:absolute;right:0;top:calc(100% + 10px);width:min(280px,calc(100vw - 32px));z-index:30;display:grid;gap:14px;padding:16px;
  background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.14)}
.cw-menu .who{display:flex;gap:12px;align-items:center}
.cw-menu .who .cw-avatar{cursor:default;box-shadow:none}
.cw-menu .who b{display:block;font:500 20px/1.1 var(--display);letter-spacing:-.01em}
.cw-menu .who small{color:var(--muted);font-size:12px}
.cw-spend{display:grid;gap:6px;background:var(--purple-50);border-radius:12px;padding:12px}
.cw-spend .lbl{font-family:var(--mono)}
.cw-spend .amt{font:400 28px/1 var(--display);letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.cw-spend .amt span{font:400 13px var(--body);color:var(--muted);letter-spacing:0;margin-left:4px}
.cw-spend .note{font-size:12px}
.cw-mitem{display:flex;align-items:center;width:100%;border:0;background:none;text-align:left;font:500 15px var(--body);color:var(--accent);padding:9px 10px;margin:0 -6px;width:calc(100% + 12px);border-radius:10px;cursor:pointer;transition:background .15s}
.cw-mitem:hover{background:var(--wash)}
.cw-mitem.out{color:var(--muted);border-top:1px solid var(--line);border-radius:0 0 10px 10px;margin-top:2px;padding-top:12px}
.cw-mitem.out:hover{color:var(--ink)}
.cw-menu{gap:4px!important}
.cw-menu .cw-spend{margin:10px 0 8px}
.cw-meter{width:100%;height:6px;border-radius:999px;background:var(--line);overflow:hidden;display:block}
.cw-dialog{width:min(520px,calc(100vw - 32px));max-height:calc(100vh - 64px);border:1px solid var(--line);border-radius:18px;padding:0;background:var(--surface);color:var(--ink);box-shadow:0 30px 80px rgba(0,0,0,.18)}
.cw-dialog::backdrop{background:rgba(20,18,24,.35)}
.cw-dhead{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:18px 20px 0}
.cw-dhead h2{margin:0;font:400 26px/1.1 var(--display);letter-spacing:-.02em}
.cw-dbody{padding:14px 20px 20px;display:grid;gap:12px;overflow:auto}
.cw-ideaform{display:grid;gap:10px}
.cw-ideaform textarea{width:100%;font:inherit;min-height:120px;border-radius:12px}
.cw-idea{display:grid;gap:6px;border:1px solid var(--line);border-radius:12px;padding:12px;background:var(--bg)}
.cw-idea.done{opacity:.6}
.cw-idea p{margin:0;white-space:pre-wrap}
.cw-idea .ghost{justify-self:start}
.cw-ideameta{display:flex;gap:8px;align-items:baseline;font-size:12.5px;color:var(--muted)}
.cw-ideameta b{color:var(--ink);font-size:14px}
.cw-meter i{display:block;height:100%;background:var(--ok)}.cw-meter i.full{background:var(--warn)}
.cw-login{position:fixed;inset:0;z-index:50;background:var(--bg);display:grid;place-items:center;
  padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
.cw-card{width:min(380px,100%);display:grid;gap:16px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.08)}

.cw-card h2{font-family:var(--display);font-weight:400;font-size:36px;letter-spacing:-.03em;line-height:1}
</style>'''
rep("</style>", css)
i = s.index("<script")
s = s[:i] + login + s[i:]
# bridge runs before the app script (window.claude must exist at boot)
i = s.index("<script>\n/* ---------- Catalog")
s = s[:i] + "<script>\n" + shim + "\n</script>\n" + s[i:]
# standalone document skeleton
j = s.index("</style>") + len("</style>")
s = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
     '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
     '<style>[hidden]{display:none!important}img{max-width:100%}body{margin:0}</style>\n'
     + s[:j] + "\n</head>\n<body>\n" + s[j:] + "\n</body>\n</html>\n")
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(D, "..", "docs")
os.makedirs(out, exist_ok=True)
open(os.path.join(out, "index.html"), "w").write(s)
open(os.path.join(out, ".nojekyll"), "w").write("")
print("wrote", os.path.join(os.path.relpath(out, os.path.join(D, "..")), "index.html"), len(s), "bytes, API_BASE =", api)
