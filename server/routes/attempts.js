const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.post("/", async (request, response, next) => {
  try {
    const section = String(request.body.section || "").trim();
    const correct = Number(request.body.correct);
    const total = Number(request.body.total);
    if (!section || !Number.isInteger(correct) || !Number.isInteger(total) || total < 1 || correct < 0 || correct > total) return response.status(400).json({ error: "Invalid assessment result." });
    const percentage = Math.round((correct / total) * 100);
    request.user.attempts.unshift({ section, correct, total, percentage, passed: percentage >= 70 });
    await request.user.save();
    response.status(201).json({ attempt: request.user.attempts[0], user: { id: request.user._id, name: request.user.name, email: request.user.email, createdAt: request.user.createdAt, attempts: request.user.attempts } });
  } catch (error) { next(error); }
});

module.exports = router;
