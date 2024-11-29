const mongoose = require("mongoose");

const dataSchemaObj = {
  name: { type: String, required: true },
  frequency: { type: String, required: true }, // daily, weekly, monthly
  startDate: { type: Date, default: Date.now },
  status: { type: String, default: "Not Started" },
  priority: { type: String, default: "Medium" }, // Low, Medium, High
  notes: { type: String },
  streak: { type: Number, default: 0 },
  lastCompleted: { type: Date }

};
// In the POST /habits/edit/:id route (when marking the habit as complete)
if (habit.status === 'Completed') {
  // Check if the habit was completed yesterday (for streak tracking)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === yesterday.toDateString()) {
    habit.streak++;
  } else {
    habit.streak = 1; // reset streak if there was a break
  }

  habit.lastCompleted = new Date();
}


const habitsSchema = mongoose.Schema(dataSchemaObj);
module.exports = mongoose.model("Habit", habitsSchema); 