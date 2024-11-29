const express = require("express");
const router = express.Router();
const Habit = require("../models/habit");

// GET /habits/
router.get("/", async (req, res, next) => {
  let habits = await Habit.find().sort([["startDate", "descending"]]);
  res.render("habits/index", {
    title: "Habit Tracker",
    dataset: habits,
  });
});

// GET /habits/add
router.get("/add", (req, res, next) => {
  res.render("habits/add", { title: "Add a New Habit" });
});

// POST /habits/add
router.post("/add", async (req, res, next) => {
  let newHabit = new Habit({
    name: req.body.name,
    frequency: req.body.frequency,
    priority: req.body.priority,
    notes: req.body.notes
  });
  await newHabit.save();
  res.redirect("/habits");
});

module.exports = router; 


