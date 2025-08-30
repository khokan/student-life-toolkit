const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  instructor: { type: String },
  date: { type: Date }, // For the specific class date. NO default.
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  colorCode: { type: String, default: "#2196F3" },
  // The field for when the document was created is usually called something else:
  createdAt: { type: Date, default: Date.now }, // <- Good practice
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
