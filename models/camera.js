const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Camera", {
    cameraId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM("enter", "exit"),
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    main: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    display: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
};
