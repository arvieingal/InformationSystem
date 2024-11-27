//user queries
const userQueries = {
  findAllUser: "SELECT * FROM users WHERE status = 'Active'",
  findById: "SELECT * FROM users WHERE user_id = ?",
  insert:
    "INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
  update:
    "UPDATE users SET username = ?, email = ?, password = ?, role = ?, status = ? WHERE user_id = ?",
  delete: "UPDATE users SET status = 'Inactive' WHERE user_id = ?",
  updatePassword: "UPDATE users SET password = ? WHERE id = ?",
};

//resident queries
const residentQueries = {
  findAllResident: "SELECT * FROM resident WHERE status = 'Active'",
  findById: "SELECT * FROM resident WHERE resident_id = ?",
  insertHouseholdMember: `INSERT INTO resident (
    household_number, family_name, given_name, middle_name, extension, relationship,
    gender, civil_status, birthdate, block_number, lot_number, sitio_purok, barangay, city,
    birthplace, religion, sectoral, is_registered_voter, is_business_owner, is_household_head,
    status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
  insertHouseholdHead: `INSERT INTO resident (
  household_number, 
  family_name, 
  given_name, 
  relationship, 
  gender, 
  civil_status, 
  birthdate, 
  block_number, 
  lot_number, 
  sitio_purok, 
  barangay, 
  city, 
  birthplace, 
  religion, 
  sectoral, 
  is_household_head
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Yes');
`,
  update:
    "UPDATE resident SET given_name = ?, family_name = ?, is_household_head = ? WHERE resident_id = ?",
  delete: "UPDATE resident SET status = 'Inactive' WHERE resident_id = ?",
  findHouseholdHead: `SELECT 
        household_number,
        family_name,
        given_name,
        middle_name,
        sitio_purok,
        is_business_owner,
        block_number,
        lot_number,
        barangay,
        city
    FROM 
        resident
    WHERE 
        is_household_head = 'Yes';`,
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

const purokQueries = {
  findAllPurok: "SELECT * FROM purok",
  findById: "SELECT * FROM purok WHERE purok_id = ?",
  insert: "INSERT INTO purok (name, age, address) VALUES (?, ?, ?)",
  update: "UPDATE purok SET name = ?, age = ?, address = ? WHERE purok_id = ?",
  delete: "UPDATE purok SET status = 'Inactive' WHERE purok_id = ?",
  countPurokPopulationByTable: `SELECT 
        sp.sitio_purok,
        sp.total_count,
        COALESCE(resident_count, 0) AS resident,
        COALESCE(renter_count, 0) AS renter
    FROM (
        SELECT 
            sitio_purok,
            COUNT(*) AS total_count
        FROM (
            SELECT sitio_purok FROM resident
            WHERE sitio_purok IN ('Abellana', 'City Central', 'Kalinao', 'Lubi', 'Mabuhay', 'Nangka', 'Regla', 'San Antonio', 'San Roque', 'San Vicente', 'Sta. Cruz', 'Sto. Nino 1', 'Sto. Nino 2', 'Sto. Nino 3', 'Zapatera')
            UNION ALL
            SELECT sitio_purok FROM renter
            WHERE sitio_purok IN ('Abellana', 'City Central', 'Kalinao', 'Lubi', 'Mabuhay', 'Nangka', 'Regla', 'San Antonio', 'San Roque', 'San Vicente', 'Sta. Cruz', 'Sto. Nino 1', 'Sto. Nino 2', 'Sto. Nino 3', 'Zapatera')
        ) combined
        GROUP BY sitio_purok
    ) sp
    LEFT JOIN (
        SELECT 
            sitio_purok, 
            COUNT(*) AS resident_count
        FROM resident
        WHERE sitio_purok IN ('Abellana', 'City Central', 'Kalinao', 'Lubi', 'Mabuhay', 'Nangka', 'Regla', 'San Antonio', 'San Roque', 'San Vicente', 'Sta. Cruz', 'Sto. Nino 1', 'Sto. Nino 2', 'Sto. Nino 3', 'Zapatera')
        GROUP BY sitio_purok
    ) r ON sp.sitio_purok = r.sitio_purok
    LEFT JOIN (
        SELECT 
            sitio_purok, 
            COUNT(*) AS renter_count
        FROM renter
        WHERE sitio_purok IN ('Abellana', 'City Central', 'Kalinao', 'Lubi', 'Mabuhay', 'Nangka', 'Regla', 'San Antonio', 'San Roque', 'San Vicente', 'Sta. Cruz', 'Sto. Nino 1', 'Sto. Nino 2', 'Sto. Nino 3', 'Zapatera')
        GROUP BY sitio_purok
    ) rr ON sp.sitio_purok = rr.sitio_purok
    ORDER BY sp.total_count DESC;
    `,
  countAllSectoralByPurok: `SELECT 
        p.purok_id, -- Fetch the purok_id
        p.purok_name AS sitio_purok,
        CAST(COALESCE(SUM(CASE WHEN r.sectoral = 'LGBT' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS LGBT,
        CAST(COALESCE(SUM(CASE WHEN r.sectoral = 'PWD' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS PWD,
        CAST(COALESCE(SUM(CASE WHEN r.sectoral = 'Senior Citizen' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS Senior_Citizen,
        CAST(COALESCE(SUM(CASE WHEN r.sectoral = 'Solo Parent' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS Solo_Parent,
        CAST(COALESCE(SUM(CASE WHEN r.sectoral = 'Habal - Habal' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS Habal_Habal,
        CAST(COALESCE(SUM(CASE WHEN r.sectoral = 'Erpat' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS Erpat,
        CAST(COALESCE(SUM(CASE WHEN r.sectoral = 'Others' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS Others
    FROM purok p
    LEFT JOIN resident r ON p.purok_name = r.sitio_purok
    GROUP BY p.purok_id, p.purok_name
    ORDER BY p.purok_name;
    `,
};

const childrenQueries = {
  findAllChildren: "SELECT * FROM children",
  findById: "SELECT * FROM children WHERE child_id = ?",
  insert: "INSERT INTO children (name, age, address) VALUES (?, ?, ?)",
  update:
    "UPDATE children SET name = ?, age = ?, address = ? WHERE child_id = ?",
  delete: "UPDATE children SET status = 'Inactive' WHERE child_id = ?",
};

module.exports = {
  userQueries,
  renterQueries,
  residentQueries,
  getAllCharts,
  purokQueries,
  childrenQueries,
};
