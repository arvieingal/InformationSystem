const pool = require("../config/db");

const Log = {
  create: async (username, action, timestamp) => {
    const query =
      "INSERT INTO logs (username, action, timestamp) VALUES (?, ?, ?)";
    console.log("Executing query:", query, "with values:", [
      username,
      action,
      timestamp,
    ]);
    await pool.query(query, [username, action, timestamp]);
  },

  getAll: async (userId) => {
    const query = "SELECT * FROM logs WHERE user_id = ?";
    console.log("Executing query:", query);
    const [rows] = await pool.query(query, [userId]); // Destructure to get only rows
    console.log("Database logs:", rows);
    return rows; // Return only the rows
  },
};

module.exports = Log;
