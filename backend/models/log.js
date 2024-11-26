const pool = require('../config/db');

const Log = {
    create: async (action, timestamp) => {
        const query = 'INSERT INTO logs (action, timestamp) VALUES ($1, $2)';
        await pool.query(query, [action, timestamp]);
    },
    getAll: async () => {
        const query = 'SELECT * FROM logs';
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = Log; 