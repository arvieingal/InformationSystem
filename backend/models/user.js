const pool = require("../config/db");

const User = {
  findAll: async () => {
    try {
      const [rows] = await pool.execute("SELECT * FROM users");
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = User;
