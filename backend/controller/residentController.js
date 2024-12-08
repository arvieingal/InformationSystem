const Resident = require("../models/resident");
const pool = require("../config/db");

const residentController = {
  getAllResident: async (req, res) => {
    try {
      const resident = await Resident.findAllResident();
      if (resident.length > 0) {
        res.status(200).json(resident);
      } else {
        res.status(404).json({ message: "No resident found in the database" });
      }
    } catch (error) {
      console.error("Error in resident controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving resident",
        error: error.message,
      });
    }
  },

  getHouseholdHead: async (req, res) => {
    try {
      const householdHead = await Resident.findHouseHoldHead();
      if (householdHead.length > 0) {
        res.status(200).json(householdHead);
      } else {
        res
          .status(404)
          .json({ message: "No household head found in the database" });
      }
    } catch (error) {
      console.error("Error in household head controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving household head",
        error: error.message,
      });
    }
  },

  insertHouseholdMember: async (req, res) => {
    try {
      const householdMemberData = req.body;

      console.log("household member data", householdMemberData);

      const result = await Resident.insertHouseholdMember(householdMemberData);

      if (result && result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Household member added successfully", result });
      } else {
        res.status(400).json({ message: "Failed to add household member" });
      }
    } catch (error) {
      console.error("Error in insertHouseholdMember controller:", error);
      res.status(500).json({
        message: "Internal server error while adding household member",
        error: error.message,
      });
    }
  },

  updateHouseholdMember: async (req, res) => {
    try {
      const householdMemberData = req.body;

      const result = await Resident.updateHouseholdMember(householdMemberData);

      if (result && result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Household member updated successfully", result });
      } else {
        res
          .status(404)
          .json({ message: "Household member not found or no changes made" });
      }
    } catch (error) {
      console.error("Error in updateHouseholdMember controller:", error);
      res.status(500).json({
        message: "Internal server error while updating household member",
        error: error.message,
      });
    }
  },

  insertHouseholdHead: async (req, res) => {
    try {
      const { household_number } = req.body;
      console.log("Incoming data:", req.body);

      // Check if the request body is valid
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }

      // Check if household_number with is_household_head = 'Yes' exists
      const [existingHousehold] = await pool.query(
        "SELECT * FROM resident WHERE household_number = ? AND is_household_head = 'Yes'",
        [household_number]
      );

      console.log("Existing household head check result:", existingHousehold);

      if (existingHousehold.length > 0) {
        return res
          .status(400)
          .json({ message: "Household number is already taken by a head" });
      }

      // Proceed with the insertion
      const result = await Resident.insertHouseholdHead(req.body);

      console.log("Insert result:", result);

      if (result && result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Household head added successfully", result });
      } else {
        res.status(400).json({ message: "Failed to add household head" });
      }
    } catch (error) {
      console.error("Error in insertHouseholdHead controller:", error);
      res.status(500).json({
        message: "Internal server error while adding household head",
        error: error.message,
      });
    }
  },

  archiveHouseholdMember: async (req, res) => {
    try {
      const householdMemberData = req.body;

      const result = await Resident.archiveHouseholdMember(householdMemberData);

      if (result && result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Household member updated successfully", result });
      } else {
        res
          .status(404)
          .json({ message: "Household member not found or no changes made" });
      }
    } catch (error) {
      console.error("Error in updateHouseholdMember controller:", error);
      res.status(500).json({
        message: "Internal server error while updating household member",
        error: error.message,
      });
    }
  },

  searchResidents: async (req, res) => {
    const { term } = req.query; // Get the search term from query parameters

    if (!term) {
      return res.status(400).json({ message: "Search term is required." });
    }

    try {
      const resident = await Resident.searchResident(term); // Pass term to searchResident method
      if (resident.length > 0) {
        res.status(200).json(resident);
      } else {
        res.status(404).json({ message: "No resident found in the database" });
      }
    } catch (error) {
      console.error("Error in resident controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving resident",
        error: error.message,
      });
    }
  },

  filterResidentsRecord: async (req, res) => {
    try {
      const { gender, status, is_business_owner } = req.query;
      console.log("Received Query:", { gender, status, is_business_owner });

      const results = await Resident.filterResidents({
        gender,
        status,
        is_business_owner,
      });

      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching resident records:", error);
      res.status(500).send("Server Error");
    }
  },
};

module.exports = residentController;
