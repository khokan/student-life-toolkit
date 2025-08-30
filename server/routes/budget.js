const express = require("express");
const Budget = require("../models/Budget");
const validate = require("../middlewares/validate");
const { budgetCreate } = require("../validators/zodSchemas");
const router = express.Router();

// CREATE
router.post("/", validate(budgetCreate), async (req, res, next) => {
  try {
    console.log("Creating budget:", req.validated);
    const doc = await Budget.create(req.validated);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

// READ ALL
router.get("/", async (req, res, next) => {
  try {
    const docs = await Budget.find();
    console.log("Fetched budgets:", docs);
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// READ ONE
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Budget.findById(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put("/:id", validate(budgetCreate), async (req, res, next) => {
  try {
    const doc = await Budget.findByIdAndUpdate(req.params.id, req.validated, {
      new: true,
    });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
