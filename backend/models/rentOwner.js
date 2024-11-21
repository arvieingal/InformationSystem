const pool = require("../config/db");

const RentOwner = {
  findAllRentOwner: async () => {
    try {
      const [rows] = await pool.execute("SELECT * FROM rent_owner");
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = RentOwner;
