const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// Create a new Todo
router.post("/", async (req, res) => {
  try {
    const { task, dueDate, completed } = req.body;
    const newTodo = new Todo({ task, dueDate, completed });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all todolist
router.get("/", async (req, res) => {
  try {
    const todolist = await Todo.find();
    res.json(todolist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Todo
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
