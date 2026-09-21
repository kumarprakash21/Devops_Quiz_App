const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function requireAuth(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return response.status(401).json({ error: "Authentication required." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return response.status(401).json({ error: "User account not found." });
    request.user = user;
    next();
  } catch {
    response.status(401).json({ error: "Your session has expired. Please sign in again." });
  }
}

module.exports = { requireAuth };
