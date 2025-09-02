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

// PATCH - Toggle isCompleted
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;
    
    // Validate that isCompleted is a boolean
    if (typeof isCompleted !== 'boolean') {
      return res.status(400).json({ message: "isCompleted must be a boolean value" });
    }

    const doc = await Planner.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true }
    );
    
    if (!doc) {
      return res.status(404).json({ message: "Planner task not found" });
    }
    
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
