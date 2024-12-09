const pool = require("../config/db");
const { format } = require("date-fns");

const Log = {
  create: async (username, action, timestamp, userId) => {
    const formattedTimestamp = format(
      new Date(timestamp),
      "yyyy-MM-dd HH:mm:ss"
    );
    try {
      await pool.execute(
        "INSERT INTO logs (username, action, timestamp, user_id) VALUES (?, ?, ?, ?)",
        [username, action, formattedTimestamp, userId]
      );
    } catch (err) {
      console.error("Error creating log entry:", err);
      throw err;
    }
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
