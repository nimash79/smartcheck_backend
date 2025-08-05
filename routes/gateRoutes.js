const express = require("express");
const {getGates, getGate, addGate, editGate, deleteGates} = require("../controllers/gateController");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const gates = await getGates();
    res.sendResponse({ status: 1, gates });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.get("/:gateId", async (req, res) => {
  try {
    const {gateId} = req.params;
    const gate = await getGate({gateId});
    res.sendResponse({status: 1, gate});
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, departmentId} = req.body;
    if (!name || !departmentId)
      return res.sendError("Required parameters", 400);
    const status = await addGate({ name, departmentId });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/edit", async (req, res) => {
  try {
    const { gateId, name, departmentId, open} = req.body;
    if (!gateId || !name || !departmentId || open === undefined)
      return res.sendError("Required parameters", 400);
    const status = await editGate({ gateId, name, departmentId });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { gateIds } = req.body;
    if (!gateIds)
      return res.sendError("Required parameters", 400);
    const status = await deleteGates({ gateIds });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});


module.exports = router;
