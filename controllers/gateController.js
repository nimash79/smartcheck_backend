const { Op } = require("sequelize");
const { Gate, Department } = require("../models");

exports.getGates = async () => {
  const gates = await Gate.findAll({
    include: [
      {
        model: Department,
        attributes: ["departmentId", "name"],
      },
    ],
  });
  return gates;
};

exports.getGate = async ({gateId}) => {
  const gate = await Gate.findOne({
    where: {
      gateId,
    },
    include: [
      {
        model: Department,
        attributes: ["departmentId", "name"],
      },
    ],
  });
  return gate;
};

exports.addGate = async ({ name, departmentId }) => {
  let gate = await Gate.findOne({
    where: { name },
  });
  if (gate) return 2;
  const departmentExists = await Department.findByPk(departmentId);
  if (!departmentExists) return 3;
  await Gate.create({ name, departmentId });
  return 1;
};

exports.editGate = async ({ gateId, name, departmentId, open }) => {
  let gate = await Gate.findOne({
    where: {
      gateId: {
        [Op.not]: gateId,
      },
      name,
    },
  });
  if (gate) return 2;
  gate = await Gate.findByPk(gateId);
  if (!gate) return 4;
  const departmentExists = await Department.findByPk(departmentId);
  if (!departmentExists) return 3;
  await gate.update({name, departmentId, open});
  return 1;
};


exports.deleteGates = async ({gateIds}) => {
  await Gate.destroy({
    where: {
      gateId: {
        [Op.in]: gateIds,
      },
    },
  });
  return 1;
};
