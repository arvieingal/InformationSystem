const pool = require("../config/db");
const { renterQueries } = require("../queries/query");

const Renter = {
  findAllRenter: async () => {
    try {
      const [rows] = await pool.execute(renterQueries.findAllRenter);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Renter;
