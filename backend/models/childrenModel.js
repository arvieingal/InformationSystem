const db = require("../config/db");
const { childrenQueries } = require("../queries/query");

const Children = {
  getAllChildren: async () => {
    try {
      const [members] = await db.execute(childrenQueries.findAllChildren);
      return members || [];
    } catch (error) {
      console.error("Error fetching residents:", error);
      throw error;
    }
  },

  getChildById: async (childId) => {
    const [rows] = await db.execute(
      "SELECT * FROM children WHERE child_id = ?",
      [childId]
    );
    return rows[0];
  },

  addChild: async (childData) => {
    const { first_name, last_name, middle_name, gender, birthdate, address } =
      childData;
    const [result] = await db.execute(
      "INSERT INTO children (first_name, last_name, middle_name, gender, birthdate, address) VALUES (?, ?, ?, ?, ?, ?)",
      [first_name, last_name, middle_name, gender, birthdate, address]
    );
    return { child_id: result.insertId, ...childData };
  },

  updateChild: async (childId, childData) => {
    const {
      height_at_birth,
      weight_at_birth,
      height_cm,
      weight_kg,
      height_age_Z,
      weight_age_Z,
      nutritional_status,
      measurement_date
    } = childData;
  
    try {
      await db.execute(
        "UPDATE children SET height_at_birth = ?, weight_at_birth = ?, height_cm = ?, weight_kg = ?, height_age_Z = ?, weight_age_Z = ?, nutritional_status = ?, measurement_date = ? WHERE child_id = ?",
        [
          height_at_birth ,
          weight_at_birth ,
          height_cm ,
          weight_kg,
          height_age_Z ,
          weight_age_Z ,
          nutritional_status ,
          measurement_date ,
          childId,
        ]
      );
    } catch (err) {
      console.error("Database error:", err);
      // throw err; // Rethrow the error to propagate it back to the controller
    }
  },
};

module.exports = Children;
