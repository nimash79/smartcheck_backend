const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Person", {
    personId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    identificationCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    face: {
      type: DataTypes.JSON,
      allowNull: true
    },
    voice: {
      type: DataTypes.JSON,
      allowNull: true
    },
    isManager: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
};
