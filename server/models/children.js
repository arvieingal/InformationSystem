"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      Child.hasMany(models.childImmunizationRecord, {
        foreignKey: "child_id",
        as: "immunizationRecords",
      });
    }
  }

  Child.init(
    {
      child_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      suffix: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
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
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["Male", "Female"]],
        },
      },
      sitio_purok: {
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
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Active", "Inactive", "Archive"],
        allowNull: false,
        defaultValue: "Active",
      },
      placeOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      heightAtBirth: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
        },
      },
      weightAtBirth: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
        },
      },
      mothers_name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      fathers_name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      family_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Child",
      tableName: "children",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Child;
};
