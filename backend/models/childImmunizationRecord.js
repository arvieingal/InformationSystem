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
        "UPDATE child_immunization_record SET vaccine_type = ?, other_vaccine_type =?, doses = ?, other_doses =?, date_vaccinated = ?, remarks = ?, health_center = ? WHERE child_immunization_id = ?",
        [
          updatedData.vaccine_type,
          updatedData.other_vaccine_type,
          updatedData.doses,
          updatedData.other_doses,
          updatedData.date_vaccinated,
          updatedData.remarks,
          updatedData.health_center,
          id,
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  },

  filterImmunizationRecords: async (params) => {
    try {
      let query = "SELECT * FROM child_immunization_record WHERE 1=1";
      const queryParams = [];

      if (params.sex) {
        query += " AND sex = ?";
        queryParams.push(params.sex);
      }
      if (params.status) {
        query += " AND status = ?";
        queryParams.push(params.status);
      }
      if (params.vaccine_type) {
        query += " AND vaccine_type = ?";
        queryParams.push(params.vaccine_type);
      }
      if (params.doses) {
        query += " AND doses = ?";
        queryParams.push(params.doses);
      }

      const [results] = await pool.execute(query, queryParams);
      return results;
    } catch (error) {
      console.error("Error executing sorting query:", error);
      throw error;
    }
  },

  archiveRecord: async (data) => {
    try {
      const [rows] = await pool.execute(
        childImmunizationQueries.archiveRecord,
        [data.child_immunization_id]
      );
      console.log("Rows updated in the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  },
};

module.exports = ChildImmunizationRecord;
