import { useEffect, useRef, useState } from "react";

const SIGNALING_URL = "ws://localhost:8080/webrtc";

const RTC_CONFIGURATION = {
  iceServers: [],
};

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30, max: 30 },
};

export default function App() {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const statsTimerRef = useRef(null);

  const [status, setStatus] = useState("Idle");
  const [transportProtocol, setTransportProtocol] = useState("unknown");
  const [videoStats, setVideoStats] = useState({
    framesEncoded: 0,
    framesPerSecond: 0,
    bytesSent: 0,
  });
  const [error, setError] = useState(null);

  async function startStreaming() {
    setError(null);
    setStatus("Requesting camera permission...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: VIDEO_CONSTRAINTS,
        audio: false,
      });

      localStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStatus("Opening signaling socket...");

      const socket = new WebSocket(SIGNALING_URL);
      socketRef.current = socket;

      socket.addEventListener("open", async () => {
        setStatus("Creating WebRTC peer connection...");

        const peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
        peerConnectionRef.current = peerConnection;

        peerConnection.addEventListener("icecandidate", (event) => {
          if (!event.candidate) {
            return;
          }

          sendSignalingMessage({
            type: "ice-candidate",
            candidate: event.candidate,
          });
        });

        peerConnection.addEventListener("iceconnectionstatechange", () => {
          setStatus(`ICE state: ${peerConnection.iceConnectionState}`);
        });

        peerConnection.addEventListener("connectionstatechange", () => {
          setStatus(`Peer connection: ${peerConnection.connectionState}`);
        });

        for (const track of stream.getVideoTracks()) {
          peerConnection.addTrack(track, stream);
        }

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        sendSignalingMessage({
          type: "offer",
          sdp: peerConnection.localDescription,
        });

        startStatsPolling(peerConnection);
      });

      socket.addEventListener("message", async (event) => {
        const message = JSON.parse(event.data);
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) {
          return;
        }

        if (message.type === "answer") {
          await peerConnection.setRemoteDescription(message.sdp);
          setStatus("Streaming live video to Node backend.");
          return;
        }

        if (message.type === "ice-candidate" && message.candidate) {
          await peerConnection.addIceCandidate(message.candidate);
        }
      });

      socket.addEventListener("close", () => {
        setStatus("Signaling socket closed.");
      });

      socket.addEventListener("error", () => {
        setError("WebSocket signaling failed. Is the Node backend running?");
      });
    } catch (caughtError) {
      console.error(caughtError);
      setError(caughtError.message || "Could not start camera streaming.");
      stopStreaming();
    }
  }

  function stopStreaming() {
    if (statsTimerRef.current) {
      clearInterval(statsTimerRef.current);
      statsTimerRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (localStreamRef.current) {
      for (const track of localStreamRef.current.getTracks()) {
        track.stop();
      }
      localStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setTransportProtocol("unknown");
    setVideoStats({
      framesEncoded: 0,
      framesPerSecond: 0,
      bytesSent: 0,
    });
    setStatus("Stopped");
  }

  function sendSignalingMessage(message) {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify(message));
  }

  function startStatsPolling(peerConnection) {
    if (statsTimerRef.current) {
      clearInterval(statsTimerRef.current);
    }

    statsTimerRef.current = setInterval(async () => {
      const report = await peerConnection.getStats();
      let outboundVideoStats = null;
      let selectedPairStats = null;

      for (const stat of report.values()) {
        if (stat.type === "outbound-rtp" && stat.kind === "video") {
          outboundVideoStats = stat;
        }

        if (stat.type === "candidate-pair" && stat.selected) {
          selectedPairStats = stat;
        }
      }

      if (outboundVideoStats) {
        setVideoStats({
          framesEncoded: outboundVideoStats.framesEncoded ?? 0,
          framesPerSecond: outboundVideoStats.framesPerSecond ?? 0,
          bytesSent: outboundVideoStats.bytesSent ?? 0,
        });
      }

      if (selectedPairStats) {
        const localCandidate = report.get(selectedPairStats.localCandidateId);
        setTransportProtocol(localCandidate?.protocol ?? "unknown");
      }
    }, 1_000);
  }

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const isStreaming = Boolean(peerConnectionRef.current);

  return (
    <main className="page">
      <section className="card">
        <h1>React Camera → Node.js Backend</h1>
        <p>
          This demo sends a live camera video track to Node through WebRTC. The
          media path is selected by ICE and normally uses UDP on localhost.
        </p>

        <video
          ref={videoRef}
          className="preview"
          autoPlay
          muted
          playsInline
        />

        <div className="actions">
          <button type="button" onClick={startStreaming} disabled={isStreaming}>
            Start video stream
          </button>

          <button type="button" onClick={stopStreaming} disabled={!isStreaming}>
            Stop
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <dl className="stats">
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
          <div>
            <dt>Selected transport</dt>
            <dd>{transportProtocol}</dd>
          </div>
          <div>
            <dt>Frames encoded</dt>
            <dd>{videoStats.framesEncoded}</dd>
          </div>
          <div>
            <dt>FPS</dt>
            <dd>{Number(videoStats.framesPerSecond).toFixed(1)}</dd>
          </div>
          <div>
            <dt>Bytes sent</dt>
            <dd>{videoStats.bytesSent.toLocaleString()}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
