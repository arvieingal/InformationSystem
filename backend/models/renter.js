const pool = require("../config/db");

const Renter = {
  findAllRenter: async () => {
    try {
      const [rows] = await pool.execute("SELECT * FROM renter");
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Renter;
