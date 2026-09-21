const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt, attempts: user.attempts || [] });
const createToken = user => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (request, response, next) => {
  try {
    const name = String(request.body.name || "").trim();
    const email = String(request.body.email || "").trim().toLowerCase();
    const password = String(request.body.password || "");
    if (name.length < 2) return response.status(400).json({ error: "Please enter your full name." });
    if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ error: "Please enter a valid email address." });
    if (password.length < 6) return response.status(400).json({ error: "Password must contain at least 6 characters." });
    if (await User.exists({ email })) return response.status(409).json({ error: "An account with this email already exists." });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    response.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post("/login", async (request, response, next) => {
  try {
    const email = String(request.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(String(request.body.password || ""), user.passwordHash))) return response.status(401).json({ error: "The email or password is incorrect." });
    response.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, (request, response) => response.json({ user: publicUser(request.user) }));

module.exports = router;
