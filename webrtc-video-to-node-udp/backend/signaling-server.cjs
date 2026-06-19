const http = require("node:http");
const { WebSocketServer } = require("ws");

let wrtc;
try {
  wrtc = require("@roamhq/wrtc");
} catch (error) {
  console.error("Could not load @roamhq/wrtc.");
  console.error("Install dependencies with: npm install");
  throw error;
}

const {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  nonstandard,
} = wrtc;

const { RTCVideoSink } = nonstandard;

const PORT = Number(process.env.PORT || 8080);
const RTC_CONFIGURATION = {
  iceServers: [],
};

const server = http.createServer((request, response) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify({ status: "ok", service: "webrtc-signaling" }));
});

const wss = new WebSocketServer({ server, path: "/webrtc" });

wss.on("connection", (socket) => {
  console.log("[signaling] client connected");

  let peerConnection = null;
  const cleanups = [];

  socket.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "offer") {
        peerConnection = createPeerConnection(socket, cleanups);

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message.sdp)
        );

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        send(socket, {
          type: "answer",
          sdp: peerConnection.localDescription,
        });

        return;
      }

      if (message.type === "ice-candidate" && message.candidate) {
        if (!peerConnection) {
          return;
        }

        await peerConnection.addIceCandidate(
          new RTCIceCandidate(message.candidate)
        );
      }
    } catch (error) {
      console.error("[signaling] message handling failed", error);
      send(socket, {
        type: "error",
        message: error.message,
      });
    }
  });

  socket.on("close", () => {
    console.log("[signaling] client disconnected");

    for (const cleanup of cleanups) {
      cleanup();
    }

    if (peerConnection) {
      peerConnection.close();
    }
  });
});

server.listen(PORT, () => {
  console.log(`[server] WebRTC signaling is listening on ws://localhost:${PORT}/webrtc`);
  console.log("[server] Waiting for browser camera video track...");
});

function createPeerConnection(socket, cleanups) {
  const peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);

  peerConnection.onicecandidate = (event) => {
    if (!event.candidate) {
      return;
    }

    send(socket, {
      type: "ice-candidate",
      candidate: event.candidate,
    });
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log(`[webrtc] ICE state: ${peerConnection.iceConnectionState}`);
  };

  peerConnection.onconnectionstatechange = () => {
    console.log(`[webrtc] connection state: ${peerConnection.connectionState}`);
  };

  peerConnection.ontrack = (event) => {
    const { track } = event;

    console.log(`[media] remote track received: kind=${track.kind}, id=${track.id}`);

    if (track.kind !== "video") {
      return;
    }

    const videoSink = new RTCVideoSink(track);
    let frameCount = 0;
    let lastReportAt = Date.now();

    const onFrame = ({ frame }) => {
      frameCount += 1;
      const now = Date.now();
      const elapsedMs = now - lastReportAt;

      if (elapsedMs >= 1_000) {
        const fps = (frameCount * 1_000) / elapsedMs;
        const payloadSize = frame.data?.byteLength ?? frame.data?.length ?? 0;

        console.log(
          `[media] video stream: ${frame.width}x${frame.height}, fps=${fps.toFixed(1)}, rawI420Bytes=${payloadSize}`
        );

        frameCount = 0;
        lastReportAt = now;
      }
    };

    videoSink.addEventListener("frame", onFrame);

    cleanups.push(() => {
      try {
        videoSink.removeEventListener("frame", onFrame);
        videoSink.stop();
      } catch (error) {
        console.error("[media] video sink cleanup failed", error);
      }
    });
  };

  return peerConnection;
}

function send(socket, message) {
  if (socket.readyState !== socket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(message));
}
