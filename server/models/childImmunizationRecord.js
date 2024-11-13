"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
 
 
    class childImmunizationRecord extends Model {
    static associate(models) {
      // Define associations here
      childImmunizationRecord.hasMany(models.vaccineDose, {
        foreignKey: "record_id",
      });
    }

    // Add a static method to call a stored procedure
     static async fetchWithVaccineDetails() {
      try {
        const results = await sequelize.query(
          "CALL GetAllChildImmunizationRecordsWithVaccineDetails()"
        );

        console.log("results:", results);
        return results;
        
        // Return the fetched results
      } catch (error) {
        console.error("Error fetching data using stored procedure:", error);
        throw error; // Re-throw the error for higher-level handling
      }
    }
  }

  childImmunizationRecord.init(
    {
      record_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      place_of_birth: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mother_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      father_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      birth_height: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      birth_weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      sex: {
        type: DataTypes.ENUM("Male", "Female"),
        allowNull: true,
      },
      health_center: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      barangay: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      family_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      administered_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "childImmunizationRecord",
      tableName: "child_immunization_records",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return childImmunizationRecord;
};