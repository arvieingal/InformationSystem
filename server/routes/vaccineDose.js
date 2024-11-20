const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /api/vaccineDoses - Fetch all vaccine doses
router.get('/vaccineDoses', async (req, res) => {
  try {
    const doses = await db.VaccineDose.findAll();
    res.json(doses);
  } catch (error) {
    console.error("Error fetching vaccine doses:", error);
    res.status(500).json({ error: "An error occurred while fetching vaccine doses." });
  }
});

// POST /api/vaccineDoses - Create a new vaccine dose
router.post('/vaccineDoses', async (req, res) => {
  try {
    const newDose = await db.VaccineDose.create(req.body);
    res.status(201).json(newDose);
  } catch (error) {
    console.error("Error creating vaccine dose:", error);
    res.status(500).json({ error: "An error occurred while creating a vaccine dose." });
  }
});

// PUT /api/vaccineDoses/:id - Update a vaccine dose
router.put('/vaccineDoses/:id', async (req, res) => {
  try {
    const updatedDose = await db.VaccineDose.update(req.body, {
      where: { dose_id: req.params.id }
    });
    res.json(updatedDose);
  } catch (error) {
    console.error("Error updating vaccine dose:", error);
    res.status(500).json({ error: "An error occurred while updating the vaccine dose." });
  }
});

// DELETE /api/vaccineDoses/:id - Delete a vaccine dose
router.delete('/vaccineDoses/:id', async (req, res) => {
  try {
    await db.VaccineDose.destroy({
      where: { dose_id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting vaccine dose:", error);
    res.status(500).json({ error: "An error occurred while deleting the vaccine dose." });
  }
});

module.exports = router;
