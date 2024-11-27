const Children = require("../models/childrenModel");
const Log = require("../models/Log");

// Function to categorize children
const categorizeChildren = (children) => {
  return children.map(child => {
    const ageInMonths = Math.floor(child.age) * 12 + (child.age - Math.floor(child.age)) * 10;
    let ageGroup = 'Other';

    if (ageInMonths >= 0 && ageInMonths <= 5) ageGroup = '0-5 Months';
    else if (ageInMonths >= 6 && ageInMonths <= 11) ageGroup = '6-11 Months';
    else if (ageInMonths >= 12 && ageInMonths <= 23) ageGroup = '12-23 Months';
    else if (ageInMonths >= 24 && ageInMonths <= 35) ageGroup = '24-35 Months';
    else if (ageInMonths >= 36 && ageInMonths <= 47) ageGroup = '36-47 Months';
    else if (ageInMonths >= 48 && ageInMonths <= 59) ageGroup = '48-59 Months';
    else if (ageInMonths >= 60 && ageInMonths <= 71) ageGroup = '60-71 Months';

    return { ...child, age_group: ageGroup };
  });
};

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
      
      // Log the action
      await logUserAction({
        username: req.user.username, // Assuming you have user info in req.user
        action: `User ${req.user.username} updated child_no ${req.params.child_id}`,
        timestamp: new Date().toISOString()
      });

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

  getCategorizedChildren: async (req, res) => {
    try {
      console.log("Fetching children data...");
      const children = await Children.getAllChildren();
      console.log("Children data fetched:", children);
      if (!children || children.length === 0) {
        console.error("No children found in the database.");
        return res.status(404).json({ error: "Child not found." });
      }
      const categorizedData = categorizeChildren(children);
      res.status(200).json(categorizedData);
    } catch (error) {
      console.error("Error fetching categorized children:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = childrenController;
