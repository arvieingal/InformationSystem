const Children = require("../models/childrenModel");

const childrenController = {
  getAllChildren: async (req, res) => {
    try {
      const resident = await Children.getAllChildren();
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

  getChildById: async (req, res) => {
    try {
      const child = await Children.getChildById(req.params.child_id);
      if (child) {
        res.json(child);
      } else {
        res.status(404).json({ error: "Child not found." });
      }
    } catch (error) {
      console.error("Error fetching child by ID:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching child data." });
    }
  },

  addChild: async (req, res) => {
    try {
      const newChild = await Children.addChild(req.body);
      res.status(201).json(newChild);
    } catch (error) {
      console.error("Error adding new child:", error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the child." });
    }
  },
  updateChild: async (req, res) => {
    console.log("Request body:", req.body); // Log incoming request data
    console.log("Child ID:", req.params.child_id); // Log child ID
    try {
      const updatedChild = await Children.updateChild(req.params.child_id, req.body);
      res.json(updatedChild);
    } catch (error) {
      console.error("Error updating child:", error);
      res.status(500).json({ error: "An error occurred while updating child data." });
    }
  },

  getAllResidents: async (req, res) => {
    // Implementation
  },

  getChildrenByHouseholdId: async (req, res) => {
    // Implementation
  },
};

module.exports = childrenController;
