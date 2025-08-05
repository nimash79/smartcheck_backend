const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Gate", {
    gateId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    open: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
