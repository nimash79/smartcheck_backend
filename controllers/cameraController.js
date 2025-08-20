const { Op } = require("sequelize");
const { Camera, Gate } = require("../models");

exports.addCamera = async ({ name, direction, ip, microphone, main, display, gateId }) => {
  if (direction !== "enter" && direction !== "exit") return 2;
  let camera = await Camera.findOne({
    where: { name },
  });
  if (camera) return 3;
  camera = await Camera.findOne({
    where: { ip },
  });
  if (camera) return 4;
  if (!main) {
    const gateExists = await Gate.findByPk(gateId);
    if (!gateExists) return 5;
  }
  camera = await Camera.create({
    name,
    direction,
    ip,
    microphone,
    main,
    display,
    gateId,
  });
  if (main) {
    await Camera.update(
      { main: false },
      {
        where: {
          cameraId: {
            [Op.not]: camera.cameraId,
          },
          main: true,
        },
      }
    );
  }
  return 1;
};

exports.getCameras = () => {
  return Camera.findAll({
    include: {
      model: Gate,
    },
  });
};

exports.getCamera = (cameraId) => {
  return Camera.findByPk(cameraId);
};

exports.editCamera = async ({
  cameraId,
  name,
  direction,
  ip,
  microphone,
  main,
  display,
  gateId,
}) => {
  if (direction !== "enter" && direction !== "exit") return 6;
  let camera = await Camera.findOne({
    where: {
      cameraId: { [Op.not]: cameraId },
      name,
    },
  });
  if (camera) return 2;
  camera = await Camera.findOne({
    where: {
      cameraId: { [Op.not]: cameraId },
      ip,
    },
  });
  if (camera) return 3;
  camera = await Camera.findByPk(cameraId);
  if (!camera) return 4;
  if (!main) {
    const gateExists = await Gate.findByPk(gateId);
    if (!gateExists) return 5;
  }
  await camera.update({
    name,
    direction,
    ip,
    microphone,
    main,
    display,
    gateId,
  });
  if (main) {
    await Camera.update(
      { main: false },
      {
        where: {
          cameraId: {
            [Op.not]: cameraId,
          },
          main: true,
        },
      }
    );
  }
  return 1;
};

exports.deleteCameras = async ({ cameraIds }) => {
  await Camera.destroy({
    where: {
      cameraId: {
        [Op.in]: cameraIds,
      },
    },
  });
  return 1;
};

exports.getMainCamera = async () => {
  const camera = await Camera.findOne({ where: { main: true } });
  return camera;
};

exports.getDisplyingCameras = () => {
  return Camera.findAll({
    where: {
      display: true,
    },
    include: {
      model: Gate,
    },
  });
};