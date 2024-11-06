# InformationSystem

Health db
1.Nutritional status:
CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    sex ENUM('Male', 'Female') NOT NULL,
    birthdate DATE NOT NULL,
    purok VARCHAR(255),
    nutritionalStatus VARCHAR(50),
    heightCm FLOAT,
    weightKg FLOAT,
    heightAgeZ FLOAT,
    weightAgeZ FLOAT,
    weightHeightZ FLOAT,
    measurementDate DATE,
    address VARCHAR(255),
    email VARCHAR(255),
    phoneNumber VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
