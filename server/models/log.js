"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      // define association here
    }
  }

  Log.init(
    {
      log_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Log",
      tableName: "logs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Log;
}; 