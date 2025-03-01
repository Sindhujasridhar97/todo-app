const mongoose = require("mongoose");

const todolistchema = new mongoose.Schema({
  task: { type: String, required: true },
  dueDate: { type: Date }, // Add the dueDate field
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Todo", todolistchema);
