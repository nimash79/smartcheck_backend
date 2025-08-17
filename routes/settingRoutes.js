const express = require("express");
const {getSetting, addSetting, editSetting} = require("../controllers/settingController");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const setting = await getSetting();
    res.sendResponse({ status: 1, setting });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/create", async (req, res) => {
  try {
    const {deviceIp, deviceName} = req.body;
    if (!deviceIp || !deviceName)
      return res.sendError("Required parameters", 400);
    const status = await addSetting({deviceIp, deviceName});
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/edit", async (req, res) => {
  try {
    const {deviceIp, deviceName, keyWords} = req.body;
    if (!deviceIp || !deviceName)
      return res.sendError("Required parameters", 400);
    const status = await editSetting({deviceIp, deviceName, keyWords});
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});


module.exports = router;
