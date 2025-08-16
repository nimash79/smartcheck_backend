const { Op } = require("sequelize");
const { Alarm, Person } = require("../models");
const { broadcast } = require("../websocket");

exports.addAlarm = async ({personId, description, file}) => {
    const alarm = await Alarm.create({
        personId,
        description,
        file,
    });
    broadcast({
        type: "alarm",
        ...alarm,
    })
    return 1;
}

exports.getAlarms = async ({page, limit, offset, sortBy, order, search}) => {
    const alarms = await Alarm.findAndCountAll({
      where: {},
      include: [
        {
          model: Person,
          attributes: ["name", "phoneNumber"],
          where: search
            ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } },
              ],
            }
            : undefined,
        },
      ],
      order: [[sortBy, order]],
      limit,
      offset,
    });

    return {
      totalItems: alarms.count,
      totalPages: Math.ceil(alarms.count / limit),
      currentPage: page,
      alarms: alarms.rows,
    };
}

exports.deleteAlarms = async ({ alarmIds }) => {
  await Alarm.destroy({
    where: {
      alarmId: {
        [Op.in]: alarmIds,
      },
    },
  });
  return 1;
};