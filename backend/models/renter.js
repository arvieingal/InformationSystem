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

  insertRenter: async (data) => {
    try {
      const [rows] = await pool.execute(renterQueries.insertRenter, [
        data.rent_number,
        data.family_name,
        data.given_name,
        data.middle_name || null,
        data.extension || null,
        data.civil_status,
        data.gender,
        data.birthdate,
        data.months_year_of_stay,
        data.work,
        data.sitio_purok,
        data.status,
      ]);
      console.log("Rows inserted into the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing insert query:", error);
      throw error;
    }
  },

  updateRenter: async (data) => {
    try {
      const [rows] = await pool.execute(renterQueries.updateRenter, [
        data.rent_number,
        data.family_name,
        data.given_name,
        data.middle_name || null,
        data.extension || null,
        data.civil_status,
        data.gender,
        data.birthdate,
        data.months_year_of_stay,
        data.work,
        data.sitio_purok,
        data.status,
        data.renter_id,
      ]);
      console.log("Rows inserted into the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing insert query:", error);
      throw error;
    }
  },

  archiveRenter: async (data) => {
    try {
      const [rows] = await pool.execute(renterQueries.archiveRenter, [
        data.renter_id,
      ]);
      console.log("Rows updated in the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  },

  searchRenters: async (term) => {
    try {
      const [rows] = await pool.execute(renterQueries.searchRenter, [
        `%${term}%`,
        `%${term}%`,
        `%${term}%`,
      ]);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  filterRenters: async (params) => {
    try {
      let query = "SELECT * FROM renter WHERE 1=1";
      const queryParams = [];

      if (params.gender) {
        query += " AND gender = ?";
        queryParams.push(params.gender);
      }
      if (params.status) {
        query += " AND status = ?";
        queryParams.push(params.status);
      }

      console.log("Executing Query:", query, "With Params:", queryParams);

      const [results] = await pool.execute(query, queryParams);
      return results;
    } catch (error) {
      console.error("Error executing sorting query:", error);
      throw error;
    }
  },
};

module.exports = Renter;
