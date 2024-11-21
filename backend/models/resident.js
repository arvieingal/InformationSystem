const pool = require("../config/db");

const Resident = {
  findAllResident: async () => {
    try {
      const [rows] = await pool.execute("SELECT * FROM resident");
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Resident;
