"use strict";
const { Model, DataTypes } = require("sequelize");
const { Database } = require("sqlite3");
const bcrypt = require("bcrypt");

//create User model

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First Name is required.",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Last Name is required.",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Email Address is required.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password is required.",
          },
        },
        set(val) {
            const hashPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hashPassword);
          },
      },
    },
    { sequelize }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        as: "user",
        allowNull: false,
      },
    });
  };

  return User;
};
