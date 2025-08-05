const express = require("express");
const {
  addCamera,
  getCameras,
  deleteCameras,
  editCamera,
  getCamera,
  getMainCamera,
  getDisplyingCameras,
} = require("../controllers/cameraController");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cameras = await getCameras();
    res.sendResponse({ status: 1, cameras });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.get("/main", async (req, res) => {
  try {
    const camera = await getMainCamera();
    res.sendResponse({ status: 1, camera });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.get("/displaying-cameras", async (req, res) => {
  try {
    const cameras = await getDisplyingCameras();
    res.sendResponse({ status: 1, cameras });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.get("/:cameraId", async (req, res) => {
  try {
    const camera = await getCamera(req.params.cameraId);
    res.sendResponse({ status: 1, camera });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, direction, ip, main, display, gateId } = req.body;
    if (!name || !direction || !ip || main == undefined || display == undefined)
      return res.sendError("Required parameters", 400);
    if (!main && !gateId)
      return res.sendError("Required parameters", 400);
    const status = await addCamera({ name, direction, ip, main, display, gateId });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/edit", async (req, res) => {
  try {
    const { cameraId, name, direction, ip, main, display, gateId } = req.body;
    if (!cameraId || !name || !direction || !ip || main == undefined || display == undefined)
      return res.sendError("Required parameters", 400);
    if (!main && !gateId)
      return res.sendError("Required parameters", 400);
    const status = await editCamera({ cameraId, name, direction, ip, main, display, gateId });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { cameraIds } = req.body;
    const status = await deleteCameras({cameraIds});
    res.sendResponse({status});
  } catch (err) {
    res.sendError(err, 500);
  }
});



module.exports = router;
