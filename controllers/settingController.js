const { Op } = require("sequelize");
const { Setting } = require("../models");

exports.getSetting = async () => {
  const setting = await Setting.findOne();
  return setting;
};

exports.addSetting = async ({ deviceIp, deviceName }) => {
  let setting = await Setting.findOne();
  if (setting) return 2;
  await Setting.create({ deviceIp, deviceName });
  return 1;
};

exports.editSetting = async ({ deviceIp, deviceName }) => {
  let setting = await Setting.findOne();
  await setting.update({ deviceIp, deviceName });
  return 1;
};