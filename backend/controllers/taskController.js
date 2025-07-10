const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

// @desc    Get all tasks of logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
      const sortOption = req.query.sort;
  
      let sortBy = {};
  
      if (sortOption === 'priority') {
        // High > Medium > Low
        sortBy = {
          priority: 1 // ascending: High > Medium > Low (alphabetically)
        };
      } else if (sortOption === 'dueDate') {
        sortBy = {
          dueDate: 1 // sort by upcoming dates
        };
      } else {
        // Default: show most recent first
        sortBy = {
          createdAt: -1
        };
      }
  
      const tasks = await Task.find({ user: req.user._id }).sort(sortBy);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
  };
  
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // return the updated document
      );
  
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update task', error });
    }
  };
  
  // @desc    Delete a task
  // @route   DELETE /api/tasks/:id
  // @access  Private
  const deleteTask = async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task', error });
    }
  };

  module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
  };
  
