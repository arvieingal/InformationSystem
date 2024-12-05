const db = require("../config/db");
const { childrenQueries } = require("../queries/query");

const Children = {
  // getAllChildren: async () => {
  //   try {
  //     const [members] = await db.execute(childrenQueries.findAllChildren);
  //     return members || [];
  //   } catch (error) {
  //     console.error("Error fetching residents:", error);
  //     throw error;
  //   }
  // },


  getAllChildren: async () => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM children WHERE status != 'Inactive'"
      );
      return rows;
    } catch (error) {
      console.error("Error fetching inactive children:", error);
      throw error;
    }
  },

  getAllChildrenInactive: async () => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM children WHERE status = 'Inactive'"
      );
      return rows;
    } catch (error) {
      console.error("Error fetching inactive children:", error);
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

  archiveChild: async (childId) => {
    try {
      const [result] = await db.execute(
        "UPDATE children SET status = 'Inactive' WHERE child_id = ?",
        [childId]
      );
      if (result.affectedRows > 0) {
        console.log(`Child with ID ${childId} archived successfully.`);
      } else {
        console.warn(`No child found with ID ${childId}.`);
      }
    } catch (error) {
      console.error("Error archiving child:", error);
      throw error;
    }
  },

  updateChild: async (childId, childData) => {
    const {
      height_at_birth,
      weight_at_birth,
      height_cm,
      weight_kg,
      height_age_Z,
      weight_age_Z,
      weight_height_Z,
      nutritional_status,
      measurement_date
    } = childData;
  
    try {
      await db.execute(
        "UPDATE children SET height_at_birth = ?, weight_at_birth = ?, height_cm = ?, weight_kg = ?, height_age_Z = ?, weight_age_Z = ?, weight_height_Z = ?, nutritional_status = ?, measurement_date = ? WHERE child_id = ?",
        [
          height_at_birth ?? null,
          weight_at_birth ?? null,
          height_cm ?? null,
          weight_kg ?? null,
          height_age_Z ?? null,
          weight_age_Z ?? null,
          weight_height_Z ?? null,
          nutritional_status ?? null,
          measurement_date ?? null,
          childId,
        ]
      );
    } catch (err) {
      console.error("Database error:", err);
      throw err; 
    }
  },

  getCategorizedChildren: async () => {
    const query = `
      SELECT 
        CASE 
          WHEN FLOOR(age) * 12 + (age - FLOOR(age)) * 10 BETWEEN 0 AND 5 THEN '0-5 Months'
          WHEN FLOOR(age) * 12 + (age - FLOOR(age)) * 10 BETWEEN 6 AND 11 THEN '6-11 Months'
          WHEN FLOOR(age) * 12 + (age - FLOOR(age)) * 10 BETWEEN 12 AND 23 THEN '12-23 Months'
          WHEN FLOOR(age) * 12 + (age - FLOOR(age)) * 10 BETWEEN 24 AND 35 THEN '24-35 Months'
          WHEN FLOOR(age) * 12 + (age - FLOOR(age)) * 10 BETWEEN 36 AND 47 THEN '36-47 Months'
          WHEN FLOOR(age) * 12 + (age - FLOOR(age)) * 10 BETWEEN 48 AND 59 THEN '48-59 Months'
          WHEN FLOOR(age) * 12 + (age - FLOOR(age)) * 10 BETWEEN 60 AND 71 THEN '60-71 Months'
          ELSE 'Other'
        END AS age_group,
        sex,
        nutritional_status
      FROM children;
    `;
    const [rows] = await db.execute(query);
    console.log("Query results:", rows); 
    return rows;
  },

  getStatusByPurok: async () => {
    const query = `
      SELECT 
        sitio_purok,
        nutritional_status,
        COUNT(*) as count
      FROM children
      GROUP BY sitio_purok, nutritional_status;
    `;
    const [rows] = await db.execute(query);
    console.log("Query results:", rows); 
    return rows;
  },
};




module.exports = Children;
