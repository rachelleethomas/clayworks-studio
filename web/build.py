"""Build the GitHub Pages version of Clayworks Studio from the artifact page.
usage: python3 build.py <API_BASE>   → writes docs/index.html
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
rep("<h1>Your Studio</h1>", "<h1>Clayworks Studio</h1>")
rep('<meta name="claude:viewport-fit-sides" content="cover">\n', "")
rep("Open Your Studio in claude.ai while signed in to keep your studio on your account across devices.",
    "Log in to sync your shelves across devices.")
rep('function saveLocal(){try{localStorage.setItem("stainlab-studio",JSON.stringify(studio))}catch{}}',
    'function saveLocal(){try{localStorage.setItem("stainlab-studio",JSON.stringify(studio))}catch{};cwQueueSync()}')
rep('if(storeMode==="local"){n.hidden=false;', 'if(storeMode==="local"&&!CW.token){n.hidden=false;')
rep("Recipe generation isn't available here. Open the page in claude.ai while signed in.", "Log in to get recipes.")
# header user box + login overlay
rep('<div class="tabs" role="tablist">', '<div class="cw-head"><div class="cw-user" id="cwUser"></div><div class="tabs" role="tablist">')
rep('aria-controls="view-studio">Shelves</button>\n    </div>', 'aria-controls="view-studio">Shelves</button>\n    </div></div>')
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
.cw-head{display:grid;gap:8px;justify-items:end}
@media (max-width:560px){.cw-head{justify-items:start}}
.cw-user{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.cw-user b{color:var(--ink)}
.cw-meter{width:70px;height:6px;border-radius:3px;background:var(--line);overflow:hidden;display:inline-block}
.cw-meter i{display:block;height:100%;background:var(--ok)}.cw-meter i.full{background:var(--warn)}
.cw-login{position:fixed;inset:0;z-index:50;background:var(--bg);display:grid;place-items:center;
  padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
.cw-card{width:min(360px,100%);display:grid;gap:14px;background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:22px}
.cw-card input[type=password]{width:100%;font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:8px 10px}
.cw-card h2{font-family:var(--display);font-weight:700;font-size:28px}
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
os.makedirs(os.path.join(D, "..", "docs"), exist_ok=True)
open(os.path.join(D, "..", "docs", "index.html"), "w").write(s)
open(os.path.join(D, "..", "docs", ".nojekyll"), "w").write("")
print("wrote docs/index.html", len(s), "bytes, API_BASE =", api)
