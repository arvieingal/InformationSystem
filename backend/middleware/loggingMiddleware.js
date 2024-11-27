const Log = require('../models/Log'); // Assuming you have a Log model

const loggingMiddleware = async (req, res, next) => {
  try {
    const logEntry = {
      username: req.user ? req.user.username : 'Anonymous',
      action: `${req.method} ${req.originalUrl}`,
      timestamp: new Date().toISOString(),
    };
    await Log.create(logEntry); 
  } catch (error) {
    console.error('Error logging user action:', error);
  }
  next();
};

module.exports = loggingMiddleware; 