"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Immunization extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Immunization.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      ageMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      vaccineType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      doseNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      sex: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["Male", "Female"]],
        },
      },
      scheduledDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      administeredBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      sideEffects: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Immunization",
      tableName: "immunizations",
      timestamps: false,
    }
  );

  return Immunization;
}; 