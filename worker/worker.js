// Clayworks Studio API — Cloudflare Worker
// Login, per-person weekly spend caps, Claude proxy, and shelf sync.
//
// Bindings (Cloudflare dashboard → Worker → Settings):
//   KV namespace:  USAGE
//   Secrets:       ANTHROPIC_API_KEY, SESSION_SECRET, USERS
//   Variable:      ALLOWED_ORIGIN  (e.g. https://rachelleethomas.github.io)
//
// USERS is JSON: {"rachel":{"hash":"<pbkdf2 hex>","salt":"<hex>","cap":null},
//                 "grace": {"hash":"...","salt":"...","cap":3}}
// cap = weekly dollar limit; null = no limit.

const MODELS = {
  recipe:   { id: "claude-sonnet-5-5", inPerM: 2.0,  outPerM: 10.0, maxTokens: 4000 },
  default:  { id: "claude-haiku-5-5",  inPerM: 0.10, outPerM: 0.50, maxTokens: 2000 },
};
const SESSION_DAYS = 60;
const MAX_STUDIO_BYTES = 400_000;

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : (allowed[0] || ""),
      "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Vary": "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    try {
      const url = new URL(req.url);
      const users = JSON.parse(env.USERS || "{}");

      if (url.pathname === "/login" && req.method === "POST") {
        const { user, password } = await req.json();
        const name = String(user || "").trim().toLowerCase();
        const u = users[name];
        // constant-ish work whether or not the user exists
        const hash = await pbkdf2(String(password || ""), u ? u.salt : "00");
        if (!u || !timingSafeEqual(hash, u.hash)) return json({ error: "Wrong username or password." }, 401);
        const token = await sign(env, { u: name, exp: Date.now() + SESSION_DAYS * 864e5 });
        return json({ token, ...(await usage(env, name, u)) });
      }

      // everything below needs a session
      const auth = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/, "");
      const session = await verify(env, auth);
      if (!session || !users[session.u]) return json({ error: "Please log in again." }, 401);
      const name = session.u, u = users[name];

      if (url.pathname === "/me" && req.method === "GET") return json(await usage(env, name, u));

      if (url.pathname === "/studio" && req.method === "GET") {
        const data = await env.USAGE.get("studio:" + name);
        return json({ items: data ? JSON.parse(data) : [] });
      }
      if (url.pathname === "/studio" && req.method === "PUT") {
        const body = await req.text();
        if (body.length > MAX_STUDIO_BYTES) return json({ error: "Shelves are too large to sync." }, 413);
        const { items } = JSON.parse(body);
        if (!Array.isArray(items)) return json({ error: "Bad shelf data." }, 400);
        await env.USAGE.put("studio:" + name, JSON.stringify(items));
        return json({ ok: true });
      }

      if (url.pathname === "/claude" && req.method === "POST") {
        const before = await usage(env, name, u);
        if (before.cap != null && before.spent >= before.cap)
          return json({ error: `You've used your $${before.cap} for this week. It resets ${before.resetLabel}.`, code: "cap_reached", ...before }, 429);

        const { prompt, images = [], task = "default" } = await req.json();
        if (typeof prompt !== "string" || !prompt || prompt.length > 60_000) return json({ error: "Bad request." }, 400);
        if (images.length > 2) return json({ error: "Send at most two images." }, 400);
        const model = MODELS[task] || MODELS.default;
        const content = [
          ...images.map(im => ({ type: "image", source: { type: "base64", media_type: im.type, data: im.data } })),
          { type: "text", text: prompt },
        ];
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ model: model.id, max_tokens: model.maxTokens, messages: [{ role: "user", content }] }),
        });
        const out = await r.json();
        if (!r.ok) return json({ error: out?.error?.message || "Claude request failed.", code: "upstream" }, 502);
        const inTok = out.usage?.input_tokens || 0, outTok = out.usage?.output_tokens || 0;
        const cost = (inTok * model.inPerM + outTok * model.outPerM) / 1e6;
        await addSpend(env, name, cost);
        const text = (out.content || []).filter(b => b.type === "text").map(b => b.text).join("");
        return json({ text, truncated: out.stop_reason === "max_tokens", cost, ...(await usage(env, name, u)) });
      }

      return json({ error: "Not found." }, 404);
    } catch (e) {
      return json({ error: "Server error: " + (e?.message || e) }, 500);
    }
  },
};

/* ---- weekly spend (resets Monday 00:00 America/Chicago) ---- */
function weekStart(now = new Date()) {
  // shift to Chicago wall clock (approximate DST: UTC-5 Mar–Oct, UTC-6 otherwise)
  const m = now.getUTCMonth();
  const offset = m >= 2 && m <= 9 ? 5 : 6;
  const local = new Date(now.getTime() - offset * 36e5);
  const day = (local.getUTCDay() + 6) % 7; // Monday = 0
  const start = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - day));
  return { key: start.toISOString().slice(0, 10), resetsAt: new Date(start.getTime() + 7 * 864e5 + offset * 36e5) };
}
async function usage(env, name, u) {
  const w = weekStart();
  const spent = parseFloat((await env.USAGE.get(`spend:${name}:${w.key}`)) || "0");
  const resetLabel = "Monday " + w.resetsAt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Chicago" });
  return { user: name, spent: Math.round(spent * 10000) / 10000, cap: u.cap ?? null, resetsAt: w.resetsAt.toISOString(), resetLabel };
}
async function addSpend(env, name, cost) {
  const w = weekStart(), k = `spend:${name}:${w.key}`;
  const cur = parseFloat((await env.USAGE.get(k)) || "0");
  await env.USAGE.put(k, String(cur + cost), { expirationTtl: 60 * 864e2 });
}

/* ---- crypto ---- */
const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
const unhex = h => new Uint8Array((h.match(/../g) || []).map(x => parseInt(x, 16)));
async function pbkdf2(password, saltHex) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unhex(saltHex), iterations: 100000 }, key, 256));
}
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
async function hmac(env, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
async function sign(env, payload) {
  const body = btoa(JSON.stringify(payload));
  return body + "." + (await hmac(env, body));
}
async function verify(env, token) {
  const [body, sig] = String(token).split(".");
  if (!body || !sig || !timingSafeEqual(await hmac(env, body), sig)) return null;
  try { const p = JSON.parse(atob(body)); return p.exp > Date.now() ? p : null; } catch { return null; }
}
