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
};

module.exports = Resident;
