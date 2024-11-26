const Log = require('../models/Log');

const logUserAction = async (req, res) => {
    const { action, timestamp } = req.body;
    if (action && timestamp) {
        try {
            await Log.create(action, timestamp);
            res.status(200).send('Action logged successfully');
        } catch (error) {
            console.error('Error logging user action:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        res.status(400).send('Invalid log data');
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await Log.getAll();
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    logUserAction,
    getLogs
};