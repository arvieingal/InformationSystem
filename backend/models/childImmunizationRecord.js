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
      console.log("Executing update query with ID:", id);
      const {
        vaccine_type = null,
        doses = null,
        date_vaccinated = null,
        remarks = null,
        health_center = null,
        status = null
      } = updatedData;

      console.log("Update data:", { vaccine_type, doses, date_vaccinated, remarks, health_center, status });

      const [result] = await pool.execute(
        "UPDATE child_immunization_record SET vaccine_type = ?, doses = ?, date_vaccinated = ?, remarks = ?, health_center = ?, status = ? WHERE child_immunization_id = ?",
        [vaccine_type, doses, date_vaccinated, remarks, health_center, status, id]
      );
      console.log("Update result:", result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  },
};

module.exports = ChildImmunizationRecord;
