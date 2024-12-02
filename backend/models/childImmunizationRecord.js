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
  updateRecord: async (id, updatedData) => {
    try {
      const [result] = await pool.execute(
        "UPDATE child_immunization_record SET vaccine_type = ?, doses = ?, date_vaccinated = ?, remarks = ?, health_center = ? WHERE child_immunization_id = ?",
        [updatedData.vaccine_type, updatedData.doses, updatedData.date_vaccinated, updatedData.remarks, updatedData.health_center, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  },
};

module.exports = ChildImmunizationRecord;
