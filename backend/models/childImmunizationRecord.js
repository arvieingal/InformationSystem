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
        other_vaccine_type = null,
        doses = null,
        other_doses = null,
        date_vaccinated = null,
        remarks = null,
        health_center = null,
        status = null
      } = updatedData;

      console.log("Update data:", { vaccine_type, doses, date_vaccinated, remarks, health_center, status });

      const [result] = await pool.execute(
        "UPDATE child_immunization_record SET vaccine_type = ?, other_vaccine_type = ?, doses = ?, other_doses = ?, date_vaccinated = ?, remarks = ?, health_center = ?, status = ? WHERE child_immunization_id = ?",
        [
          vaccine_type,
          other_vaccine_type,
          doses,
          other_doses,
          date_vaccinated,
          remarks,
          health_center,
          status,
          id,
        ]
      );
      console.log("Update result:", result);
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
      if (params.other_vaccine_type) {
        query += " AND other_vaccine_type = ?";
        queryParams.push(params.other_vaccine_type);
      }

      const [results] = await pool.execute(query, queryParams);
      return results;
    } catch (error) {
      console.error("Error executing sorting query:", error);
      throw error;
    }
  },
};

module.exports = ChildImmunizationRecord;
