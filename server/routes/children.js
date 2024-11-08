const express = require('express');
const router = express.Router();
const db = require('../models'); // Assuming you have a Sequelize model set up

// GET /api/children - Fetch all children
router.get('/children', async (req, res) => {
  try {
    const children = await db.Child.findAll(); // Ensure the model name is correct
    console.log("Fetched children:", children); // Log the fetched data
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ error: "An error occurred while fetching children data." });
  }
});

// GET /api/children/:id - Fetch a child by ID
router.get('/children/:id', async (req, res) => {
  try {
    const child = await db.Child.findByPk(req.params.id); 
    if (child) {
      res.json(child);
    } else {
      res.status(404).json({ error: "Child not found." });
    }
  } catch (error) {
    console.error("Error fetching child by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching child data." });
  }
});

// POST /api/children - Add a new child
router.post('/children', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      sex,
      birthdate,
      weightAtBirth,
      heightAtBirth,
      currentAge,
      currentWeight,
      currentHeight,
      address,
      purok,
      email,
      phoneNumber
    } = req.body;

    // Calculate nutritional status
    const nutritionalStatus = calculateNutritionalStatus(currentWeight, currentHeight, currentAge);

    const newChild = await db.Child.create({
      name: `${firstName} ${middleName} ${lastName}`,
      age: currentAge,
      sex,
      birthdate,
      heightCm: currentHeight,
      weightKg: currentWeight,
      nutritionalStatus,
      address,
      email,
      purok,
      phoneNumber,
      weightAtBirth,
      heightAtBirth
    });

    res.status(201).json(newChild);
  } catch (error) {
    console.error("Error adding new child:", error);
    res.status(500).json({ error: "An error occurred while adding the child." });
  }
});

// Function to calculate nutritional status
function calculateNutritionalStatus(weight, height, age) {
  // Implement your logic here to determine the nutritional status
  // For example, using BMI or other criteria
  const bmi = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
  if (bmi >= 25 && bmi < 29.9) return "Overweight";
  return "Obesity";
}

module.exports = router; 