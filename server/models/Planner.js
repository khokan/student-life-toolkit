const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true }, // e.g. "Mathematics"
    topic: { type: String }, // e.g. "Chapter 5 - Algebra"
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: { type: Date }, // final due date
    slots: [
      {
        day: { type: String, required: true }, // e.g. "Monday"
        startTime: { type: String, required: true }, // "09:00"
        endTime: { type: String, required: true }, // "10:30"
      },
    ], // multiple slots for study allocation
    isCompleted: { type: Boolean, default: false }, // mark as done
  },
  { timestamps: true }
);

module.exports = mongoose.model("Planner", plannerSchema);
