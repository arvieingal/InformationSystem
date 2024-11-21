const childModel = require('../models/childrenModel');

exports.getAllChildren = async (req, res) => {
  try {
    const children = await childModel.getAllChildren();
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
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