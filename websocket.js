const WebSocket = require("ws");
const { addReport } = require("./controllers/reportController");

const { WS_PORT } = process.env;

const wss = new WebSocket.Server({ port: WS_PORT });
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected");
  });

  ws.on("message", async (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      return console.error("Invalid JSON", err);
    }

    if (data.event === "face_detected") {
      for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "face_detected",
                camera_url: data.camera_url,
                face: data.face,
                exists: data.exists,
              })
            );
          }
        }
    }
  });
});

const broadcast = (message) => {
  const stringified = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(stringified);
    }
  }
}

module.exports = { broadcast };