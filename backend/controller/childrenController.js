const childModel = require('../models/childrenModel');

exports.getAllChildren = async (req, res) => {
  try {
    const householdId = req.params.household_id;
    if (!householdId) {
      return res.status(400).json({ error: "Household ID is required." });
    }

    const children = await childModel.getYoungHouseholdMembers(householdId);
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error.message, error.stack);
    res.status(500).json({ error: "An error occurred while fetching children data." });
  }
};

exports.getChildById = async (req, res) => {
  try {
    const child = await childModel.getChildById(req.params.child_id);
    if (child) {
      res.json(child);
    } else {
      res.status(404).json({ error: "Child not found." });
    }
  } catch (error) {
    console.error("Error fetching child by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching child data." });
  }
};

exports.addChild = async (req, res) => {
  try {
    const newChild = await childModel.addChild(req.body);
    res.status(201).json(newChild);
  } catch (error) {
    console.error("Error adding new child:", error);
    res.status(500).json({ error: "An error occurred while adding the child." });
  }
};

exports.updateChild = async (req, res) => {
  try {
    const updatedChild = await childModel.updateChild(req.params.child_id, req.body);
    res.json(updatedChild);
  } catch (error) {
    console.error("Error updating child:", error);
    res.status(500).json({ error: "An error occurred while updating child data." });
  }
}; 


exports.getAllResidents = async (req, res) => {
  try {
    const residents = await childModel.getAllResidents();
    res.json(residents);
  } catch (error) {
    console.error("Error fetching residents:", error);
    res.status(500).json({ error: "An error occurred while fetching residents data." });
  }
};

exports.getChildrenByHouseholdId = async (req, res) => {
  const { household_id } = req.params;

  try {
    const children = await childModel.getChildrenByHouseholdId(household_id);
    res.json(children);
  } catch (error) {
    console.error("Error fetching children by household ID:", error);
    res.status(500).json({ error: "An error occurred while fetching children data." });
  }
};