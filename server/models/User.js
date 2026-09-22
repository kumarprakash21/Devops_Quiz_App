const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  course: { type: String, required: true, default: "AZ-104" },
  section: { type: String, required: true },
  correct: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 1 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  passed: { type: Boolean, required: true },
  durationSeconds: { type: Number, required: true, min: 0, default: 0 },
  completedAt: { type: Date, default: Date.now }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  attempts: { type: [attemptSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
