const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const sequelize = require("./models");

const { PORT } = process.env;

const logger = require("./logger");
const { swaggerUi, swaggerSpec } = require('./swagger');
const {
  personRoutes,
  cameraRoutes,
  departmentRoutes,
  gateRoutes,
  settingRoutes,
  reportRoutes,
} = require("./routes");
const {
  apiMiddleWare,
  userMiddleWare,
} = require("./middlewares/api_middleware");
const { authRoutes } = require("./utils/constants");

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json({ extended: false, limit: "50mb" }));
// Request + Response logger middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    if (req.method === "OPTIONS") return;
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${
      res.statusCode
    } - ${duration}ms - ${
      req.method === "GET"
        ? `params: ${JSON.stringify(req.params)}`
        : `body: ${JSON.stringify(req.body)}`
    } ${req.user ? `- user: ${req.user.mobile}` : ""}`;
    logger.info(logMessage);
  });

  next();
});
app.use(apiMiddleWare);
app.use(authRoutes, userMiddleWare);

app.use("/api/persons", personRoutes);
app.use("/api/cameras", cameraRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/gates", gateRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/", (req, res) => res.send("SmartCheck"));
app.use((req, res) => res.sendResponse("api not found", 404));

app.listen(PORT, async () => {
  try {
    await sequelize.sequelize.authenticate();
    console.log("Connected to PostgreSQL");
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    require("./websocket");
    console.log("websocket started on port 3001");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});
