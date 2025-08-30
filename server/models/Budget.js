const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String }, // rename 'note' to 'description' to match frontend
  date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Budget", BudgetSchema);
