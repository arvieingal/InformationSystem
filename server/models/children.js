"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Child.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      age: {
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
      birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      purok: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      nutritionalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      heightCm: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      weightKg: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      heightAgeZ: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      weightHeightZ: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      measurementDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Child",
      timestamps: true,
    }
  );

  return Child;
};