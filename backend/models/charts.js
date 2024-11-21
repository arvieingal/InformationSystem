const pool = require("../config/db");
const { getAllCharts } = require("../queries/query");

const Charts = {
  CountGender: async () => {
    try {
      const [rows] = await pool.execute(getAllCharts.countGender);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  CountRegisteredVoter: async () => {
    try {
      const [rows] = await pool.execute(getAllCharts.countRegisteredVoter);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  CountAllAgeGroup: async () => {
    try {
      const [rows] = await pool.execute(getAllCharts.countAllAgeGroup);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  CountPurokPopulation: async () => {
    try {
      const [rows] = await pool.execute(getAllCharts.countPurokPopulation);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Charts;
