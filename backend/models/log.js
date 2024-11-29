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

  getAll: async () => {
    const query = "SELECT * FROM logs";
    console.log("Executing query:", query);
    const result = await pool.query(query);
    console.log("Result:", result);
    console.log("Database logs:", result.rows);
    return result;
  },
};

module.exports = Log;
