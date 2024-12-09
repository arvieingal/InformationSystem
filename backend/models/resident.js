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

  checkDuplicateHouseholdMember: async (data) => {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM resident 
         WHERE household_number = ? 
           AND family_name = ? 
           AND given_name = ? 
           AND birthdate = ?`,
        [
          data.household_number,
          data.family_name,
          data.given_name,
          data.birthdate,
        ]
      );

      // If rows exist, it means a duplicate was found
      return rows.length > 0;
    } catch (error) {
      console.error("Error checking for duplicate household member:", error);
      throw error;
    }
  },

  insertHouseholdMember: async (data) => {
    try {
      const [rows] = await pool.execute(residentQueries.insertHouseholdMember, [
        data.household_number,
        data.family_name,
        data.given_name,
        data.middle_name || null,
        data.extension || null,
        data.relationship,
        data.other_relationship,
        data.gender,
        data.civil_status,
        data.birthdate,
        data.block_number || 0,
        data.lot_number || 0,
        data.sitio_purok,
        data.barangay,
        data.city,
        data.birthplace,
        data.religion,
        data.highest_educational_attainment,
        data.occupation,
        data.monthly_income,
        data.sectoral,
        data.other_sectoral,
        data.is_registered_voter || "No",
        data.is_business_owner || "No",
        data.is_household_head || "No",
        data.status,
      ]);
      console.log("Rows inserted into the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing insert query:", error);
      throw error;
    }
  },

  updateHouseholdMember: async (data) => {
    try {
      const [rows] = await pool.execute(residentQueries.updateHouseholdMember, [
        data.household_number,
        data.family_name,
        data.given_name,
        data.middle_name || null,
        data.extension || null,
        data.relationship,
        data.other_relationship,
        data.gender,
        data.civil_status,
        data.birthdate,
        data.block_number || 0,
        data.lot_number || 0,
        data.sitio_purok,
        data.barangay,
        data.city,
        data.birthplace,
        data.religion,
        data.highest_educational_attainment,
        data.occupation,
        data.monthly_income,
        data.sectoral,
        data.other_sectoral,
        data.is_registered_voter || "No",
        data.is_business_owner || "No",
        data.is_household_head || "No",
        data.status,
        data.resident_id,
      ]);
      console.log("Rows updated in the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  },

  insertHouseholdHead: async (data) => {
    try {
      const [rows] = await pool.execute(residentQueries.insertHouseholdHead, [
        data.household_number,
        data.family_name,
        data.given_name,
        data.middle_name || null,
        data.extension || null,
        data.relationship,
        data.other_relationship,
        data.gender,
        data.civil_status,
        data.birthdate,
        data.block_number || 0,
        data.lot_number || 0,
        data.sitio_purok,
        data.barangay,
        data.city,
        data.birthplace,
        data.religion,
        data.highest_educational_attainment,
        data.occupation,
        data.monthly_income,
        data.sectoral,
        data.other_sectoral,
        data.is_registered_voter || "No",
        data.is_business_owner || "No",
        data.is_household_head || "No",
        data.status,
      ]);
      console.log("Rows inserted into the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing insert query:", error);
      throw error;
    }
  },
  archiveHouseholdMember: async (data) => {
    try {
      if (!data.resident_id) {
        throw new Error("Resident ID is required");
      }

      const [rows] = await pool.execute(
        residentQueries.archiveHouseholdMember,
        [data.resident_id]
      );
      console.log("Rows updated in the database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing update query:", error);
      throw error;
    }
  },

  searchResident: async (term) => {
    try {
      const [rows] = await pool.execute(residentQueries.searchResident, [
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

  filterResidents: async (params) => {
    try {
      let query = "SELECT * FROM resident WHERE 1=1";
      const queryParams = [];

      if (params.gender) {
        query += " AND gender = ?";
        queryParams.push(params.gender);
      }
      if (params.status) {
        query += " AND status = ?";
        queryParams.push(params.status);
      }
      if (params.is_business_owner) {
        query += " AND is_business_owner = ?";
        queryParams.push(params.is_business_owner);
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

module.exports = Resident;
