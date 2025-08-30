const express = require("express");
const Planner = require("../models/Planner");
const validate = require("../middlewares/validate");
const { plannerCreate } = require("../validators/zodSchemas");

const router = express.Router();

// CREATE
router.post("/", validate(plannerCreate), async (req, res, next) => {
  try {
    const doc = await Planner.create(req.validated);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

// READ ALL
router.get("/", async (req, res, next) => {
  try {
    const docs = await Planner.find();
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// READ ONE
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Planner.findById(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put("/:id", validate(plannerCreate), async (req, res, next) => {
  try {
    const doc = await Planner.findByIdAndUpdate(req.params.id, req.validated, {
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
    await Planner.findByIdAndDelete(req.params.id);
    res.json({ message: "Planner deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
