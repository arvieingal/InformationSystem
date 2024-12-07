const Log = require('../models/log');

const logUserAction = async (req, res) => {
    const { username, action, timestamp } = req.body;
    console.log('logUserAction called with:', { username, action, timestamp });
    if (username && action && timestamp) {
        try {
            await Log.create(username, action, timestamp);
            console.log('Action logged successfully');
            res.status(200).send('Action logged successfully');
        } catch (error) {
            console.error('Error logging user action:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        console.log('Invalid log data:', req.body);
        res.status(400).send('Invalid log data');
    }
};

const getLogs = async (req, res) => {
    console.log('getLogs function called');
    try {
        const userId = req.params.userId;
        const logs = await Log.getAll(userId);
        console.log('Fetched logs:', logs);
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    logUserAction,
    getLogs
};