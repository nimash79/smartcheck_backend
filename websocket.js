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

    switch (data.event) {
      case "face_detected":
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
        break;
      case "traffic_detected":
        console.log("received data:", JSON.stringify(data));
        const {personId, camera_url, confidenceFactor} = data;
        if (personId == 0) {
          console.log("Anonymous Person detected!!!");
          break;
        }
        const report = await addReport({personId, camera_url, confidenceFactor});
        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "traffic_detected",
                report
              })
            )
          }
        }
        break;
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