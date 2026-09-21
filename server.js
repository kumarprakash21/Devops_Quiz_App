const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 8080;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "users.json");
const sessions = new Map();
const staticFiles = new Set(["/", "/index.html", "/styles.css", "/questions.js", "/app.js"]);

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8");

function readUsers() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}

function writeUsers(users) {
  const temporary = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(users, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, DATA_FILE);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}

function verifyPassword(password, user) {
  const candidate = Buffer.from(hashPassword(password, user.passwordSalt).hash, "hex");
  const stored = Buffer.from(user.passwordHash, "hex");
  return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    joinedAt: user.joinedAt,
    attempts: user.attempts || []
  };
}

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) request.destroy();
    });
    request.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    request.on("error", reject);
  });
}

function authenticatedUser(request) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const userId = sessions.get(token);
  if (!userId) return null;
  return readUsers().find(user => user.id === userId) || null;
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, userId);
  return token;
}

function serveStatic(request, response, pathname) {
  if (!staticFiles.has(pathname)) { json(response, 404, { error: "Not found" }); return; }
  const relative = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.join(ROOT, relative);
  const extensions = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
  fs.readFile(filePath, (error, content) => {
    if (error) { json(response, 404, { error: "Not found" }); return; }
    response.writeHead(200, { "Content-Type": extensions[path.extname(filePath)] || "application/octet-stream", "Cache-Control": "no-cache" });
    response.end(content);
  });
}

async function handleApi(request, response, pathname) {
  if (request.method === "POST" && pathname === "/api/register") {
    const { name = "", email = "", password = "" } = await readBody(request);
    const normalizedEmail = String(email).trim().toLowerCase();
    if (String(name).trim().length < 2) return json(response, 400, { error: "Please enter your full name." });
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return json(response, 400, { error: "Please enter a valid email address." });
    if (String(password).length < 6) return json(response, 400, { error: "Password must contain at least 6 characters." });
    const users = readUsers();
    if (users.some(user => user.email === normalizedEmail)) return json(response, 409, { error: "An account with this email already exists." });
    const credentials = hashPassword(String(password));
    const user = {
      id: crypto.randomUUID(),
      name: String(name).trim(),
      email: normalizedEmail,
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash,
      joinedAt: new Date().toISOString(),
      attempts: []
    };
    users.push(user);
    writeUsers(users);
    return json(response, 201, { token: createSession(user.id), user: publicUser(user) });
  }

  if (request.method === "POST" && pathname === "/api/login") {
    const { email = "", password = "" } = await readBody(request);
    const user = readUsers().find(account => account.email === String(email).trim().toLowerCase());
    if (!user || !verifyPassword(String(password), user)) return json(response, 401, { error: "The email or password is incorrect." });
    return json(response, 200, { token: createSession(user.id), user: publicUser(user) });
  }

  if (request.method === "POST" && pathname === "/api/logout") {
    const token = (request.headers.authorization || "").replace(/^Bearer /, "");
    sessions.delete(token);
    return json(response, 200, { ok: true });
  }

  const user = authenticatedUser(request);
  if (!user) return json(response, 401, { error: "Please sign in again." });

  if (request.method === "GET" && pathname === "/api/me") {
    return json(response, 200, { user: publicUser(user) });
  }

  if (request.method === "POST" && pathname === "/api/attempts") {
    const { section = "", correct, total } = await readBody(request);
    const safeCorrect = Number(correct);
    const safeTotal = Number(total);
    if (!section || !Number.isInteger(safeCorrect) || !Number.isInteger(safeTotal) || safeTotal < 1 || safeCorrect < 0 || safeCorrect > safeTotal) {
      return json(response, 400, { error: "Invalid assessment result." });
    }
    const percentage = Math.round((safeCorrect / safeTotal) * 100);
    const attempt = {
      id: crypto.randomUUID(),
      section: String(section),
      correct: safeCorrect,
      total: safeTotal,
      percentage,
      passed: percentage >= 70,
      completedAt: new Date().toISOString()
    };
    const users = readUsers();
    const index = users.findIndex(account => account.id === user.id);
    users[index].attempts = [attempt, ...(users[index].attempts || [])];
    writeUsers(users);
    return json(response, 201, { attempt, user: publicUser(users[index]) });
  }

  json(response, 404, { error: "API route not found" });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(request, response, url.pathname);
    else serveStatic(request, response, url.pathname);
  } catch (error) {
    console.error(error);
    json(response, error.message === "Invalid JSON" ? 400 : 500, { error: error.message === "Invalid JSON" ? error.message : "Unexpected server error." });
  }
});

server.listen(PORT, () => console.log(`CloudPrep running at http://localhost:${PORT}`));
