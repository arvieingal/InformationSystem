const express = require('express');
const router = express.Router();
const db = require('../models'); // Assuming you have a Sequelize model set up

// GET /api/children - Fetch all children
router.get('/children', async (req, res) => {
  try {
    const children = await db.Child.findAll({
      where: {
        status: {
          [db.Sequelize.Op.ne]: 'Archive' // Fetch records where status is not 'Archive'
        }
      }
    });
    console.log("Fetched children:", children); // Log the fetched data
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ error: "An error occurred while fetching children data." });
  }
});

// GET /api/children/:child_id - Fetch a child by ID
router.get('/children/:child_id', async (req, res) => {
  try {
    const child = await db.Child.findByPk(req.params.child_id); 
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
router.post('/add/children', async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body

    const {
      first_name,
      middle_name,
      last_name,
      sex,
      birthdate,
      weightAtBirth,
      heightAtBirth,
      currentAge,
      currentWeight,
      currentHeight,
      address,
      purok,
      heightAgeZ = 0, // Provide a default value if not present
      weightHeightZ = 0,
      family_number,
      mother_name,
      father_name,
      measurementDate = new Date() // Provide a default value if not present
    } = req.body;

    // Transform sex to capitalize the first letter
    const formattedSex = sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase();

    // Calculate nutritional status
    const nutritionalStatus = calculateNutritionalStatus(currentWeight, currentHeight, currentAge);

    const newChild = await db.Child.create({
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      age: currentAge,
      sex: formattedSex, // Use the formatted sex
      birthdate,
      heightCm: currentHeight,
      weightKg: currentWeight,
      nutritionalStatus,
      address,
      purok,
      weightAtBirth,
      heightAtBirth,
      heightAgeZ,
      weightHeightZ,
      measurementDate,
      family_number,
      mother_name,
      father_name,
      sitio_purok,
    });

    res.status(201).json(newChild);
  } catch (error) {
    console.error("Error adding new child:", error);
    res.status(500).json({ error: "An error occurred while adding the child." });
  }
});

// PUT /api/children/:child_id - Update a child by ID
router.put('/children/:child_id', async (req, res) => {
  try {
    const child = await db.Child.findByPk(req.params.child_id);
    if (child) {
      await child.update(req.body);
      res.json(child);
    } else {
      res.status(404).json({ error: "Child not found." });
    }
  } catch (error) {
    console.error("Error updating child:", error);
    res.status(500).json({ error: "An error occurred while updating child data." });
  }
});

// Function to calculate nutritional status
function calculateNutritionalStatus(weight, height, age) {
  // Implement your logic here to determine the nutritional status
  // For example, using BMI or other criteria
  const bmi = weight / ((height / 100) ** 2);
  if (bmi < 16) return "Severely Underweight";
  if (bmi >= 16 && bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
  if (bmi >= 25 && bmi < 29.9) return "Overweight";
  return "Obese";
}

// GET /api/young-children - Fetch children aged 0-6 years
router.get('/young-children', fetchYoungChildren);

// Function to fetch young children aged 0-6 years
async function fetchYoungChildren(req, res) {
  try {
    const youngChildren = await db.Child.findAll({
      where: {
        age: {
          [db.Sequelize.Op.lte]: 6 // Fetch children aged 0-6 years
        },
        status: {
          [db.Sequelize.Op.ne]: 'Archive' // Ensure they are not archived
        }
      }
    });
    res.json(youngChildren);
  } catch (error) {
    console.error("Error fetching young children:", error);
    res.status(500).json({ error: "An error occurred while fetching young children data." });
  }
}

module.exports = router; 