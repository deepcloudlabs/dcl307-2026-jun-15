const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");
const leaveBtn = document.getElementById("leaveBtn");
const muteBtn = document.getElementById("muteBtn");
const cameraBtn = document.getElementById("cameraBtn");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const statusElement = document.getElementById("status");
const logElement = document.getElementById("log");

let socket;
let socketOpenPromise;

let localStream;
let remoteStream;
let peerConnection;

let role;
let isInitiator = false;
let roomId;

let pendingIceCandidates = [];

const rtcConfig = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302"
      ]
    }
  ]
};

function setStatus(message) {
  statusElement.textContent = message;
}

function log(message, payload) {
  const time = new Date().toLocaleTimeString();
  const text = payload
    ? `[${time}] ${message}\n${JSON.stringify(payload, null, 2)}`
    : `[${time}] ${message}`;

  logElement.textContent = `${text}\n${logElement.textContent}`;
}

function connectSignaling() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return Promise.resolve();
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//localhost:3000/ws`;
  alert(url)
  socket = new WebSocket(url);

  socketOpenPromise = new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      log("Signaling socket opened.");
      resolve();
    });

    socket.addEventListener("error", () => {
      reject(new Error("Could not connect to signaling server."));
    });
  });

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);
    await handleSignalingMessage(message);
  });

  socket.addEventListener("close", () => {
    log("Signaling socket closed.");
    setStatus("Signaling server disconnected.");
  });

  return socketOpenPromise;
}

function sendSignal(message) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    log("Cannot send signaling message because socket is not open.", message);
    return;
  }

  socket.send(JSON.stringify(message));
}

async function startLocalMedia() {
  if (localStream) return localStream;

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  localVideo.srcObject = localStream;

  log("Local media stream started.");

  return localStream;
}

function createPeerConnection() {
  if (peerConnection) return peerConnection;

  peerConnection = new RTCPeerConnection(rtcConfig);

  peerConnection.addEventListener("icecandidate", (event) => {
    if (!event.candidate) return;

    sendSignal({
      type: "ice-candidate",
      candidate: event.candidate
    });
  });

  peerConnection.addEventListener("track", (event) => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
    }

    remoteStream.addTrack(event.track);
    log("Remote media track received.");
  });

  peerConnection.addEventListener("connectionstatechange", () => {
    log(`Peer connection state: ${peerConnection.connectionState}`);
    setStatus(`Peer connection: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener("iceconnectionstatechange", () => {
    log(`ICE connection state: ${peerConnection.iceConnectionState}`);
  });

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  return peerConnection;
}

async function createAndSendOffer() {
  const pc = createPeerConnection();

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  sendSignal({
    type: "offer",
    sdp: pc.localDescription
  });

  log("Offer sent.");
}

async function handleOffer(message) {
  const pc = createPeerConnection();

  await pc.setRemoteDescription(message.sdp);
  await flushPendingIceCandidates();

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  sendSignal({
    type: "answer",
    sdp: pc.localDescription
  });

  log("Answer sent.");
}

async function handleAnswer(message) {
  if (!peerConnection) return;

  await peerConnection.setRemoteDescription(message.sdp);
  await flushPendingIceCandidates();

  log("Answer received and applied.");
}

async function handleRemoteIceCandidate(message) {
  if (!message.candidate) return;

  if (!peerConnection || !peerConnection.remoteDescription) {
    pendingIceCandidates.push(message.candidate);
    return;
  }

  await peerConnection.addIceCandidate(message.candidate);
  log("Remote ICE candidate added.");
}

async function flushPendingIceCandidates() {
  if (!peerConnection || !peerConnection.remoteDescription) return;

  for (const candidate of pendingIceCandidates) {
    await peerConnection.addIceCandidate(candidate);
  }

  if (pendingIceCandidates.length > 0) {
    log(`Flushed ${pendingIceCandidates.length} queued ICE candidates.`);
  }

  pendingIceCandidates = [];
}

async function handleSignalingMessage(message) {
  switch (message.type) {
    case "connected": {
      log("Connected to signaling server.", {
        clientId: message.clientId
      });
      break;
    }

    case "joined": {
      role = message.role;
      isInitiator = role === "initiator";

      setStatus(
        `Joined room "${message.roomId}" as ${role}. Waiting for peer...`
      );

      log("Joined room.", message);
      break;
    }

    case "peer-joined": {
      log("Peer joined.", message);
      break;
    }

    case "ready": {
      setStatus("Peer is ready. Starting WebRTC negotiation.");
      log("Room is ready.");

      if (isInitiator) {
        await createAndSendOffer();
      }

      break;
    }

    case "offer": {
      log("Offer received.");
      await handleOffer(message);
      break;
    }

    case "answer": {
      log("Answer received.");
      await handleAnswer(message);
      break;
    }

    case "ice-candidate": {
      await handleRemoteIceCandidate(message);
      break;
    }

    case "peer-left": {
      log("Peer left.");
      setStatus("Peer left the room.");
      resetPeerConnection();
      break;
    }

    case "room-full": {
      setStatus(`Room "${message.roomId}" is full.`);
      log("Room is full.", message);
      break;
    }

    case "error": {
      setStatus(message.message);
      log("Server error.", message);
      break;
    }

    default: {
      log("Unknown signaling message.", message);
    }
  }
}

async function joinRoom() {
  try {
    roomId = roomInput.value.trim();

    if (!roomId) {
      setStatus("Please enter a room ID.");
      return;
    }

    setStatus("Starting local media...");

    await startLocalMedia();
    createPeerConnection();
    await connectSignaling();

    sendSignal({
      type: "join",
      roomId
    });

    joinBtn.disabled = true;
    leaveBtn.disabled = false;
    muteBtn.disabled = false;
    cameraBtn.disabled = false;
    roomInput.disabled = true;
  } catch (error) {
    console.error(error);
    setStatus(error.message);
    log("Join failed.", {
      message: error.message
    });
  }
}

function resetPeerConnection() {
  if (peerConnection) {
    peerConnection.ontrack = null;
    peerConnection.onicecandidate = null;
    peerConnection.close();
    peerConnection = null;
  }

  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
    remoteStream = null;
  }

  remoteVideo.srcObject = null;
  pendingIceCandidates = [];
}

function leaveRoom() {
  sendSignal({
    type: "leave"
  });

  resetPeerConnection();

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }

  localVideo.srcObject = null;

  joinBtn.disabled = false;
  leaveBtn.disabled = true;
  muteBtn.disabled = true;
  cameraBtn.disabled = true;
  roomInput.disabled = false;

  role = null;
  isInitiator = false;
  roomId = null;

  setStatus("Left the room.");
}

function toggleMute() {
  if (!localStream) return;

  const audioTracks = localStream.getAudioTracks();

  for (const track of audioTracks) {
    track.enabled = !track.enabled;
  }

  const enabled = audioTracks.some((track) => track.enabled);
  muteBtn.textContent = enabled ? "Mute Mic" : "Unmute Mic";
}

function toggleCamera() {
  if (!localStream) return;

  const videoTracks = localStream.getVideoTracks();

  for (const track of videoTracks) {
    track.enabled = !track.enabled;
  }

  const enabled = videoTracks.some((track) => track.enabled);
  cameraBtn.textContent = enabled ? "Disable Camera" : "Enable Camera";
}

joinBtn.addEventListener("click", joinRoom);
leaveBtn.addEventListener("click", leaveRoom);
muteBtn.addEventListener("click", toggleMute);
cameraBtn.addEventListener("click", toggleCamera);

window.addEventListener("beforeunload", () => {
  sendSignal({
    type: "leave"
  });
});
