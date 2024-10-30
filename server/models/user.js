"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 100],
        },
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
        validate: {
          isIn: [["active", "inactive"]],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
    }
  );

  return User;
};
