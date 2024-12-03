const pool = require("../config/db");

const {
  nutritionalStatusHistoryQueries,
  immunizationRecordHistoryQueries,
} = require("../queries/query");

const History = {
  findAllNutritionalStatusHistory: async () => {
    try {
      const [rows] = await pool.execute(
        nutritionalStatusHistoryQueries.findAllNutritionalStatusHistory
      );
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  findAllImmunizationRecordHistory: async () => {
    try {
      const [rows] = await pool.execute(
        immunizationRecordHistoryQueries.findAllImmunizationRecordHistory
      );
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = History;
