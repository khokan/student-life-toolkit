const express = require("express");
const { scheduleCreate } = require("../validators/zodSchemas");
const validate = require("../middlewares/validate");
const schedule = require("../models/schedule");

const router = express.Router();

router.post("/", validate(scheduleCreate), async (req, res, next) => {
  try {
    const data = req.validated;
    const doc = await schedule.create(data);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const list = await schedule.find().sort("day startTime");
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", validate(scheduleCreate), async (req, res, next) => {
  try {
    const doc = await schedule.findByIdAndUpdate(req.params.id, req.validated, {
      new: true,
    });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await schedule.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
