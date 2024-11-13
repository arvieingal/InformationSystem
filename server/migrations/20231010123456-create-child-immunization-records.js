'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('child_immunization_records', {
      record_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      place_of_birth: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      mother_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      father_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      birth_height: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      birth_weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      sex: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: true,
      },
      health_center: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      barangay: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      family_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('child_immunization_records');
  },
}; 