const pool = require("../config/db");
const { residentQueries } = require("../queries/query");

const Resident = {
  findAllResident: async () => {
    try {
      const [rows] = await pool.execute(residentQueries.findAllResident);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  findHouseHoldHead: async () => {
    try {
      const [rows] = await pool.execute(residentQueries.findHouseholdHead);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Resident;
