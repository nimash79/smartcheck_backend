const express = require("express");
const {
  getPersons,
  getPerson,
  editPerson,
  deletePersons,
  addPerson,
  getManagers,
  getFaces,
  getVoices,
} = require("../controllers/personController");
const { broadcast } = require("../websocket");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const persons = await getPersons();
    res.sendResponse({ status: 1, persons });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/create", async (req, res) => {
  try {
    const {
      departmentId,
      name,
      phoneNumber,
      identificationCode,
      verified,
      face,
      voice,
      isManager,
    } = req.body;
    if (
      !name ||
      !phoneNumber ||
      !identificationCode ||
      verified == undefined ||
      !face ||
      !voice ||
      isManager == undefined
    )
      return res.sendError("Required parameters", 400);
    if (!isManager && !departmentId)
      return res.sendError("Required parameters", 400);
    const status = await addPerson({
      departmentId,
      name,
      phoneNumber,
      identificationCode,
      verified,
      face,
      voice,
      isManager,
    });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/edit", async (req, res) => {
  try {
    const {
      personId,
      departmentId,
      name,
      phoneNumber,
      identificationCode,
      verified,
      face,
      voice,
      isManager,
    } = req.body;
    if (
      !personId ||
      !name ||
      !phoneNumber ||
      !identificationCode ||
      verified == undefined ||
      !face ||
      !voice ||
      isManager == undefined
    )
      return res.sendError("Required parameters", 400);
    if (!isManager && !departmentId)
      return res.sendError("Required parameters", 400);
    const status = await editPerson({
      personId,
      departmentId,
      name,
      phoneNumber,
      identificationCode,
      verified,
      face,
      voice,
      isManager,
    });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { personIds } = req.body;
    if (!personIds) return res.sendError("Required parameters", 400);
    const status = await deletePersons({ personIds });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.get("/managers", async (req, res) => {
  try {
    const persons = await getManagers();
    res.sendResponse({ status: 1, persons });
  } catch (err) {
    res.sendError(err, 500);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       properties:
 *         personId:
 *           type: integer
 *           example: 123
 *         name:
 *           type: string
 *           example: John Doe
 *         face:
 *           type: object
 *           description: Face data in JSON format
 *           example: [[[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255]]]

 * /api/persons/faces:
 *   get:
 *     summary: Get all faces
 *     responses:
 *       200:
 *         description: List of persons with their faces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 persons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'
 */
router.get("/faces", getFaces);

/**
 * @swagger
 * components:
 *   schemas:
 *     Person2:
 *       type: object
 *       properties:
 *         personId:
 *           type: integer
 *           example: 123
 *         name:
 *           type: string
 *           example: John Doe
 *         voice:
 *           type: object
 *           description: Voice data in JSON format
 *           example: [[[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255]]]

 * /api/persons/voices:
 *   get:
 *     summary: Get all voices
 *     responses:
 *       200:
 *         description: List of persons with their voices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 persons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person2'
 */
router.get("/voices", getVoices);

/**
 * @swagger
 * /api/persons/face-detected:
 *   post:
 *     summary: When a face detected for adding person
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                face:
 *                  type: json
 *                  example: [[[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255]]]
 *     responses:
 *       200:
 *         description: When a face detected for adding person
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    status:
 *                      type: integer
 *                      example: 1
 *                      description: status of the request
 */
router.post("/face-detected", async (req, res) => {
  try {
    const { face } = req.body;
    broadcast({
      type: "face_detected",
      face: JSON.stringify(face),
    });
    res.sendResponse({status: 1});
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.get("/:personId", async (req, res) => {
  try {
    const person = await getPerson(req.params.personId);
    res.sendResponse({ status: 1, person });
  } catch (err) {
    res.sendError(err, 500);
  }
});

module.exports = router;
