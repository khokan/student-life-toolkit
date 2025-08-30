const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "short", "tf"], required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  prompt: { type: String, required: true },
  options: { type: [String], default: [] },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exam", ExamSchema);
