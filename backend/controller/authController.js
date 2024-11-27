const Log = require('../models/Log');

exports.login = async (req, res) => {
  try {
    const user = await authenticateUser(req.body); // Your authentication logic
    if (user) {
      req.user = user; // Set user in request
      await Log.create({
        username: user.username,
        action: 'User logged in',
        timestamp: new Date().toISOString(),
      });
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 