const express = require('express');
const router = express.Router();
const { User, Log } = require('../models');

// Helper function to log user actions
async function logAction(userId, action) {
  try {
    await Log.create({ user_id: userId, action });
  } catch (error) {
    console.error('Error logging action:', error);
  }
}

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    await logAction(user.user_id, 'User Created');
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, status } = req.body;

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;
    user.status = status || user.status;

    // Save the updated user
    await user.save();

    // Log the update action
    await logAction(id, 'User Updated');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { user_id: req.params.id }
    });
    if (deleted) {
      await logAction(req.params.id, 'User Deleted');
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset user password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password
    const [updated] = await User.update(
      { password },
      { where: { email } }
    );

    if (updated) {
      res.status(200).json({ success: true, message: 'Password reset successfully' });
    } else {
      res.status(400).json({ error: 'Failed to reset password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/check-email/:email', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.params.email }
    });
    
    res.status(200).json({
      exists: !!user,
      message: user ? 'Email found' : 'Email not found'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
