const express = require("express");
const { requireAuth } = require("../middleware/auth");
const questionSections = require("../../questions");

const router = express.Router();
router.use(requireAuth);

function randomQuestion(items) {
  return items[Math.floor(Math.random() * items.length)];
}

router.post("/next", (request, response) => {
  const sectionName = String(request.body.section || "");
  const excludedIds = new Set(Array.isArray(request.body.excludeIds) ? request.body.excludeIds.map(String) : []);
  const section = questionSections.find(item => item.shortTitle === sectionName);
  if (!section) return response.status(400).json({ error: "Unknown AZ-104 section." });

  const available = section.questions.filter((question, index) => !excludedIds.has(`${sectionName}-${index}`));
  const pool = available.length ? available : section.questions;
  const index = section.questions.indexOf(randomQuestion(pool));
  const question = section.questions[index];
  response.json({
    question: {
      id: `${sectionName}-${index}`,
      section: section.shortTitle,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation
    }
  });
});

module.exports = router;
