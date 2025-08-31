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
    const list = await schedule.find().sort({
      date: -1, // Descending by date (newest first)
      startTime: 1, // Ascending by startTime (earliest first for same date)
    });

    // Format the date before sending to frontend
    const formattedList = list.map(item => ({
      ...item._doc,
      date: item.date ? item.date.toISOString().split('T')[0] : undefined
    }));

    res.json(formattedList);
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
