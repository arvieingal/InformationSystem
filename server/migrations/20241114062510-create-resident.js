'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('resident', {
      resident_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      household_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      family_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      given_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      middle_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      extension: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      relationship: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: false,
      },
      civil_status: {
        type: Sequelize.ENUM('Married', 'Separated', 'Single', 'Widowed'),
        allowNull: false,
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      highest_educational_attainment: {
        type: Sequelize.ENUM(
          'Elementary Level', 
          'Elementary Graduate', 
          'High School Level', 
          'High School Graduate', 
          'College Level', 
          'College Graduate'
        ),
        allowNull: true,
      },
      occupation: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      monthly_income: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      block_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lot_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sitio_purok: {
        type: Sequelize.ENUM(
          'Zapatera', 
          'Sto. Nino', 
          'San Roque', 
          'San Antonio', 
          'Lubi', 
          'Regla', 
          'Sta.Cruz', 
          'Abellana', 
          'San Vicente', 
          'Mabuhay', 
          'Kalinao', 
          'Nangka'
        ),
        allowNull: false,
      },
      barangay: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      birthplace: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      religion: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      sectoral: {
        type: Sequelize.ENUM(
          'LGBT', 
          'PWD', 
          'Senior Citizen', 
          'Solo Parent', 
          'Habal - Habal', 
          'Erpat', 
          'Others'
        ),
        allowNull: true,
      },
      registered_voter: {
        type: Sequelize.ENUM('Yes', 'No'),
        allowNull: false,
      },
      business_owner: {
        type: Sequelize.ENUM('Yes', 'No'),
        allowNull: false,
      },
      household_head: {
        type: Sequelize.ENUM('Yes', 'No'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('resident');
  }
};