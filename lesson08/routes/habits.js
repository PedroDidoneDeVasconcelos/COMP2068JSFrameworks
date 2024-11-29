// routes/habits.js
const express = require('express');
const router = express.Router();
const Habit = require('../models/habit');
const isAuthenticated = require('../middlewares/auth');

// Apply middleware to all habit routes
router.use(isAuthenticated);

// GET /habits - Show all habits
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.render('habits/index', { 
      title: 'My Habits',
      dataset: habits
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /habits/add - Display add habit form
router.get('/add', (req, res) => {
  res.render('habits/add', { title: 'Add New Habit' });
});

// POST /habits/add - Handle new habit submission
router.post('/add', async (req, res, next) => {
  try {
    const errors = {};
    if (!req.body.name) errors.name = 'Habit name is required';
    if (!req.body.frequency) errors.frequency = 'Frequency is required';

    if (Object.keys(errors).length > 0) {
      return res.render('habits/add', {
        title: 'Add New Habit',
        habit: req.body,
        errors: errors
      });
    }

    const habit = new Habit({
      ...req.body,
      user: req.user._id
    });
    
    await habit.save();
    res.redirect('/habits');
  } catch (err) {
    res.render('habits/add', {
      title: 'Add New Habit',
      habit: req.body,
      error: 'Error creating habit: ' + err.message
    });
  }
});

// GET /habits/edit/:id - Display edit form
router.get('/edit/:id', async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!habit) {
      return res.status(404).send('Habit not found');
    }
    res.render('habits/edit', { 
      title: 'Edit Habit',
      habit: habit 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /habits/edit/:id - Handle edit submission
router.post('/edit/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!habit) {
      return res.status(404).send('Habit not found');
    }
    res.redirect('/habits');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /habits/delete/:id - Handle deletion
router.get('/delete/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!habit) {
      return res.status(404).send('Habit not found');
    }
    res.redirect('/habits');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /habits/search
router.get('/search', async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    let query = { user: req.user._id };
    
    if (keyword) {
      // Search in name and notes fields
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { notes: { $regex: keyword, $options: 'i' } }
      ];
    }

    const habits = await Habit.find(query);
    
    res.render('habits/index', { 
      title: 'Search Results',
      dataset: habits,
      keyword: keyword
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
