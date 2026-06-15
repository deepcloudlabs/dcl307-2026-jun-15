import express from "express";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3000);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "webrtc-signaling-server"
  });
});

const server = http.createServer(app);

const wss = new WebSocketServer({
  server,
  path: "/ws"
});

const rooms = new Map();

function send(ws, message) {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(message));
}

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }

  return rooms.get(roomId);
}

function broadcastToRoom(roomId, message, exceptClientId = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const [clientId, clientWs] of room.entries()) {
    if (clientId === exceptClientId) continue;
    send(clientWs, message);
  }
}

function leaveRoom(ws) {
  const clientId = ws.clientId;
  const roomId = ws.roomId;

  if (!roomId || !rooms.has(roomId)) return;

  const room = rooms.get(roomId);
  room.delete(clientId);

  broadcastToRoom(roomId, {
    type: "peer-left",
    peerId: clientId
  });

  if (room.size === 0) {
    rooms.delete(roomId);
  }

  ws.roomId = null;
  ws.role = null;
}

wss.on("connection", (ws) => {
  ws.clientId = randomUUID();
  ws.roomId = null;
  ws.role = null;

  console.log(`Client connected: ${ws.clientId}`);

  send(ws, {
    type: "connected",
    clientId: ws.clientId
  });

  ws.on("message", (raw) => {
    let message;

    try {
      message = JSON.parse(raw.toString());
    } catch {
      send(ws, {
        type: "error",
        message: "Invalid JSON message."
      });
      return;
    }

    switch (message.type) {
      case "join": {
        const roomId = String(message.roomId ?? "").trim();

        if (!roomId) {
          send(ws, {
            type: "error",
            message: "roomId is required."
          });
          return;
        }

        const room = getRoom(roomId);

        if (room.size >= 2) {
          send(ws, {
            type: "room-full",
            roomId
          });
          return;
        }

        leaveRoom(ws);

        const role = room.size === 0 ? "initiator" : "receiver";

        ws.roomId = roomId;
        ws.role = role;

        room.set(ws.clientId, ws);

        console.log(`Client ${ws.clientId} joined room ${roomId} as ${role}`);

        send(ws, {
          type: "joined",
          roomId,
          clientId: ws.clientId,
          role,
          peerCount: room.size
        });

        broadcastToRoom(
            roomId,
            {
              type: "peer-joined",
              peerId: ws.clientId,
              peerCount: room.size
            },
            ws.clientId
        );

        if (room.size === 2) {
          broadcastToRoom(roomId, {
            type: "ready"
          });
        }

        break;
      }

      case "offer":
      case "answer":
      case "ice-candidate": {
        if (!ws.roomId) {
          send(ws, {
            type: "error",
            message: "Join a room before sending signaling messages."
          });
          return;
        }

        broadcastToRoom(
            ws.roomId,
            {
              ...message,
              from: ws.clientId
            },
            ws.clientId
        );

        break;
      }

      case "leave": {
        leaveRoom(ws);
        send(ws, {
          type: "left"
        });
        break;
      }

      default: {
        send(ws, {
          type: "error",
          message: `Unsupported message type: ${message.type}`
        });
      }
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ${ws.clientId}`);
    leaveRoom(ws);
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error for client ${ws.clientId}:`, error.message);
    leaveRoom(ws);
  });
});

server.listen(PORT, () => {
  console.log(`HTTP server: http://localhost:${PORT}`);
  console.log(`WebSocket signaling: ws://localhost:${PORT}/ws`);
});