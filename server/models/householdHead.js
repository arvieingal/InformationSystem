"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HouseholdHead extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  HouseholdHead.init(
    {
      head_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      household_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      family_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      given_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      extension: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      relationship: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      civil_status: {
        type: DataTypes.ENUM('Married', 'Separated', 'Single', 'Widowed'),
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      age: {
        type: DataTypes.VIRTUAL,
        get() {
          const birthdate = this.getDataValue('birthdate');
          if (!birthdate) return null;
          const ageDifMs = Date.now() - new Date(birthdate).getTime();
          const ageDate = new Date(ageDifMs); // miliseconds from epoch
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        },
      },
      highest_educational_attainment: {
        type: DataTypes.ENUM(
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
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      monthly_income: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      block_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lot_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sitio_purok: {
        type: DataTypes.ENUM(
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
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      birthplace: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      religion: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      sectoral: {
        type: DataTypes.ENUM(
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
        type: DataTypes.ENUM('Yes', 'No'),
        allowNull: false,
      },
      business_in_area: {
        type: DataTypes.ENUM('Yes', 'No'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "HouseholdHead",
      tableName: "household_head",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return HouseholdHead;
};