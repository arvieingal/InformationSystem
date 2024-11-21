//user queries
const userQueries = {
  findAllUser: "SELECT * FROM users",
  findById: "SELECT * FROM users WHERE user_id = ?",
  insert:
    "INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
  update:
    "UPDATE users SET username = ?, email = ?, password = ?, role = ?, status = ? WHERE user_id = ?",
  delete: "UPDATE users SET status = 'Inactive' WHERE user_id = ?",
};

//resident queries
const residentQueries = {
  findAllResident: "SELECT * FROM resident",
  findById: "SELECT * FROM resident WHERE resident_id = ?",
  insert:
    "INSERT INTO resident (given_name, family_name, is_household_head) VALUES (?, ?, ?)",
  update:
    "UPDATE resident SET given_name = ?, family_name = ?, is_household_head = ? WHERE resident_id = ?",
  delete: "UPDATE resident SET status = 'Inactive' WHERE resident_id = ?",
};

//renter queries
const renterQueries = {
  findAllRenter: "SELECT * FROM renter",
  findById: "SELECT * FROM renter WHERE renter_id = ?",
  insert: "INSERT INTO renter (name, age, address) VALUES (?, ?, ?)",
  update:
    "UPDATE renter SET name = ?, age = ?, address = ? WHERE renter_id = ?",
  delete: "UPDATE renter SET status = 'Inactive' WHERE renter_id = ?",
};

const getAllCharts = {
  countGender: `SELECT gender, COUNT(*) AS count FROM (SELECT gender FROM resident WHERE gender IN ('Male', 'Female') UNION ALL SELECT gender FROM renter WHERE gender IN ('Male', 'Female')) AS combined GROUP BY gender;`,
  countRegisteredVoter: `SELECT is_registered_voter, COUNT(*) AS count FROM resident WHERE is_registered_voter IN ('Yes', 'No') GROUP BY is_registered_voter;`,
  countAllAgeGroup: `SELECT 
        age_groups.age_group,
        COALESCE(counts.count, 0) AS count
    FROM (
        SELECT '0 - 1' AS age_group
        UNION ALL
        SELECT '2 - 12'
        UNION ALL
        SELECT '13 - 19'
        UNION ALL
        SELECT '20 - 34'
        UNION ALL
        SELECT '35 - 59'
        UNION ALL
        SELECT '60 - 74'
        UNION ALL
        SELECT '75+'
    ) AS age_groups
    LEFT JOIN (
        SELECT 
            CASE
                WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 0 AND 1 THEN '0 - 1'
                WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 2 AND 12 THEN '2 - 12'
                WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 13 AND 19 THEN '13 - 19'
                WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 20 AND 34 THEN '20 - 34'
                WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 35 AND 59 THEN '35 - 59'
                WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 60 AND 74 THEN '60 - 74'
                WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) >= 75 THEN '75+'
            END AS age_group,
            COUNT(*) AS count
        FROM resident
        GROUP BY age_group
    ) AS counts
    ON age_groups.age_group = counts.age_group
    ORDER BY FIELD(age_groups.age_group, '0 - 1', '2 - 12', '13 - 19', '20 - 34', '35 - 59', '60 - 74', '75+');
    `,
  countPurokPopulation: `SELECT sitio_purok, COUNT(*) AS total_count
    FROM (
        SELECT sitio_purok 
        FROM resident 
        WHERE sitio_purok IN ('Abellana', 'City Central', 'Kalinao', 'Lubi', 'Mabuhay', 'Nangka', 'Regla', 'San Antonio', 'San Roque', 'San Vicente', 'Sta. Cruz', 'Sto. Nino 1', 'Sto. Nino 2', 'Sto. Nino 3', 'Zapatera')
  
        UNION ALL

        SELECT sitio_purok 
        FROM renter 
        WHERE sitio_purok IN ('Abellana', 'City Central', 'Kalinao', 'Lubi', 'Mabuhay', 'Nangka', 'Regla', 'San Antonio', 'San Roque', 'San Vicente', 'Sta. Cruz', 'Sto. Nino 1', 'Sto. Nino 2', 'Sto. Nino 3', 'Zapatera')
    ) combined
    GROUP BY sitio_purok
    ORDER BY total_count DESC;
    `,
};

module.exports = {
  userQueries,
  renterQueries,
  residentQueries,
  getAllCharts,
};
