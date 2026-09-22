const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.post("/", async (request, response, next) => {
  try {
    const course = String(request.body.course || "AZ-104").trim();
    const section = String(request.body.section || "").trim();
    const correct = Number(request.body.correct);
    const total = Number(request.body.total);
    const durationSeconds = Number(request.body.durationSeconds || 0);
    if (!course || !section || !Number.isInteger(correct) || !Number.isInteger(total) || !Number.isInteger(durationSeconds) || total < 1 || correct < 0 || correct > total || durationSeconds < 0) return response.status(400).json({ error: "Invalid assessment result." });
    const percentage = Math.round((correct / total) * 100);
    request.user.attempts.unshift({ course, section, correct, total, percentage, passed: percentage >= 70, durationSeconds });
    await request.user.save();
    response.status(201).json({ attempt: request.user.attempts[0], user: { id: request.user._id, name: request.user.name, email: request.user.email, createdAt: request.user.createdAt, attempts: request.user.attempts } });
  } catch (error) { next(error); }
});

module.exports = router;
