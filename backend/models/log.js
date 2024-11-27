const pool = require('../config/db');

const Log = {
    create: async (username, action, timestamp) => {
        const query = 'INSERT INTO logs (username, action, timestamp) VALUES ($1, $2, $3)';
        await pool.query(query, [username, action, timestamp]);
    },
    getAll: async () => {
        const query = 'SELECT * FROM logs';
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = Log; 