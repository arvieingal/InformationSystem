const pool = require("../config/db");

const { childImmunizationQueries } = require("../queries/query");

const ChildImmunizationRecord = {
  findAllChildImmunizationRecord: async () => {
    try {
      const [rows] = await pool.execute(
        childImmunizationQueries.findAllChildImmunizationRecord
      );
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = ChildImmunizationRecord;
