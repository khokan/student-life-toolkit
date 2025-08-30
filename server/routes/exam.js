const express = require("express");
const Exam = require("../models/Exam");
const validate = require("../middlewares/validate");
const { examCreate } = require("../validators/zodSchemas");

const router = express.Router();

// CREATE
router.post("/", validate(examCreate), async (req, res, next) => {
  try {
    const doc = await Exam.create(req.validated);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

// READ ALL
router.get("/", async (req, res, next) => {
  try {
    const docs = await Exam.find();
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// READ ONE
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Exam.findById(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put("/:id", validate(examCreate), async (req, res, next) => {
  try {
    const doc = await Exam.findByIdAndUpdate(req.params.id, req.validated, {
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
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: "Exam deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
