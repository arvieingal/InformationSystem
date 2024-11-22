const pool = require("../config/db");
const { purokQueries } = require("../queries/query");

const Purok = {
  findAllPurok: async () => {
    try {
      const [rows] = await pool.execute(purokQueries.findAllPurok);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  CountPurokPopulationByTable: async () => {
    try {
      const [rows] = await pool.execute(
        purokQueries.countPurokPopulationByTable
      );
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  CountAllSectoralByPurok: async () => {
    try {
      const [rows] = await pool.execute(purokQueries.countAllSectoralByPurok);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Purok;
