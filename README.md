INSERT INTO household_head (household_number, family_name, given_name, middle_name, extension, relationship, gender, civil_status, birthdate, highest_educational_attainment, occupation, monthly_income, block_number, lot_number, sitio_purok, barangay, city, birthplace, religion, sectoral, registered_voter, business_in_area) VALUES
(1, 'Smith', 'John', 'A', NULL, 'Head', 'Male', 'Married', '2024-01-01', 'College Graduate', 'Engineer', 5000.00, 101, 1, 'Zapatera', 'Barangay 1', 'City A', 'City A', 'Christianity', 'Others', 'Yes', 'No'),
(2, 'Doe', 'Jane', NULL, NULL, 'Head', 'Female', 'Single', '2023-02-02', 'High School Graduate', 'Teacher', 3000.00, 102, 2, 'Sto. Nino', 'Barangay 2', 'City B', 'City B', 'Islam', 'PWD', 'No', 'Yes'),
(3, 'Brown', 'Charlie', 'B', 'Jr.', 'Head', 'Male', 'Widowed', '2022-03-03', 'Elementary Graduate', 'Farmer', 2000.00, 103, 3, 'San Roque', 'Barangay 3', 'City C', 'City C', 'Buddhism', 'Senior Citizen', 'Yes', 'No'),
(4, 'Johnson', 'Emily', NULL, NULL, 'Head', 'Female', 'Separated', '2022-04-04', 'College Level', 'Nurse', 4000.00, 104, 4, 'San Antonio', 'Barangay 4', 'City D', 'City D', 'Hinduism', 'Solo Parent', 'No', 'Yes'),
(5, 'Williams', 'Michael', 'C', NULL, 'Head', 'Male', 'Married', '2022-05-05', 'High School Level', 'Driver', 2500.00, 105, 5, 'Lubi', 'Barangay 5', 'City E', 'City E', 'Atheism', 'LGBT', 'Yes', 'No');


INSERT INTO household_member (household_number, family_name, given_name, middle_name, extension, relationship, gender, civil_status, birthdate, highest_educational_attainment, occupation, monthly_income, block_number, lot_number, sitio_purok, barangay, city, birthplace, religion, sectoral, registered_voter, business_in_area) VALUES
(1, 'Smith', 'Anna', NULL, NULL, 'Daughter', 'Female', 'Single', '2005-06-06', 'High School Level', NULL, NULL, 101, 1, 'Zapatera', 'Barangay 1', 'City A', 'City A', 'Christianity', NULL, 'Yes', 'No'),
(2, 'Doe', 'John', 'B', NULL, 'Son', 'Male', 'Single', '2000-07-07', 'College Level', NULL, NULL, 102, 2, 'Sto. Nino', 'Barangay 2', 'City B', 'City B', 'Islam', NULL, 'No', 'Yes'),
(3, 'Brown', 'Emily', NULL, NULL, 'Daughter', 'Female', 'Single', '1998-08-08', 'High School Graduate', NULL, NULL, 103, 3, 'San Roque', 'Barangay 3', 'City C', 'City C', 'Buddhism', NULL, 'Yes', 'No'),
(4, 'Johnson', 'Michael', 'C', NULL, 'Son', 'Male', 'Single', '2003-09-09', 'Elementary Graduate', NULL, NULL, 104, 4, 'San Antonio', 'Barangay 4', 'City D', 'City D', 'Hinduism', NULL, 'No', 'Yes'),
(5, 'Williams', 'Sarah', NULL, NULL, 'Daughter', 'Female', 'Single', '2001-10-10', 'College Level', NULL, NULL, 105, 5, 'Lubi', 'Barangay 5', 'City E', 'City E', 'Atheism', NULL, 'Yes', 'No');


INSERT INTO users (username, email, password, role, status, created_at, updated_at) VALUES
('superadmin', 'superadmin@example.com', 'admin123', 1, 'active', NOW(), NOW()),
('editor', 'editor@example.com', 'editor123', 2, 'active', NOW(), NOW()),
('staff', 'staff@example.com', 'staff123', 2, 'active', NOW(), NOW()),
('viewer', 'viewer@example.com', 'viewer123', 0, 'active', NOW(), NOW());

Admin - Sir Andrew (All permission)
Staff or Editor - one health worker and one GAD Committee secretary ( Permission: Add and Update) Every move ani nila kay mo reflect sa logs
Viewer - Can view

INSERT INTO logs (user_id, action, timestamp) VALUES
(1, 'Login', NOW()),
(2, 'Logout', NOW()),
(3, 'Update Profile', NOW()),
(4, 'Delete Account', NOW()),
(5, 'Change Password', NOW());

INSERT INTO children (member_id, heightCm, weightKg, heightAgeZ, weightHeightZ, nutritionalStatus) VALUES
(1, 120.5, 25.0, -1.0, 0.5, 'Normal'),
(2, 110.0, 20.0, -2.0, 1.0, 'Underweight'),
(3, 130.0, 30.0, 0.0, -0.5, 'Overweight'),
(4, 115.0, 22.0, -1.5, 0.0, 'Normal'),
(5, 125.0, 28.0, 0.5, 0.5, 'Normal');

INSERT INTO child_immunization_records (child_id, dose_number, vaccine_type, dose_description, scheduled_date, health_center, administered_date, administered_by, side_effects, location, created_at, updated_at) VALUES
(1, 1, 'MMR', 'First Dose', '2023-01-01', 'Health Center A', '2023-01-02', 'Nurse A', 'None', 'Location A', NOW(), NOW()),
(2, 2, 'DPT', 'Second Dose', '2023-02-01', 'Health Center B', '2023-02-02', 'Nurse B', 'Fever', 'Location B', NOW(), NOW()),
(3, 1, 'Polio', 'First Dose', '2023-03-01', 'Health Center C', '2023-03-02', 'Nurse C', 'None', 'Location C', NOW(), NOW()),
(4, 3, 'Hepatitis B', 'Third Dose', '2023-04-01', 'Health Center D', '2023-04-02', 'Nurse D', 'Rash', 'Location D', NOW(), NOW()),
(5, 1, 'BCG', 'First Dose', '2023-05-01', 'Health Center E', '2023-05-02', 'Nurse E', 'None', 'Location E', NOW(), NOW());