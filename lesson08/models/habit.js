const mongoose = require('mongoose');

const dataSchemaObj = {
  name: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Not Started' },
  priority: { type: String, default: 'Medium' },
  notes: { type: String },
  streak: { type: Number, default: 0 },
  lastCompleted: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
};

const habitsSchema = mongoose.Schema(dataSchemaObj);
module.exports = mongoose.model('Habit', habitsSchema);
