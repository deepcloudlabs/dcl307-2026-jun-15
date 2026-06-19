# React camera video stream to Node.js over WebRTC UDP media path

This is a JavaScript-only React + Node.js demo that sends a live camera **video stream** from the browser to a Node.js backend.

It does **not** send still images. It does **not** use canvas JPEG extraction. It does **not** write `latest.jpg`.

The browser captures the camera with `getUserMedia()`, publishes the video track with `RTCPeerConnection`, and the Node.js backend terminates the WebRTC connection using `@roamhq/wrtc`. The backend consumes the incoming continuous video track with `RTCVideoSink` and logs live frame-rate information.

## Why WebRTC instead of raw UDP from React?

Browsers do not expose a general-purpose raw UDP socket API to JavaScript applications. Therefore, a React application cannot directly call something like `udp.send(...)` from the browser.

For real-time camera video, the correct browser-native transport is WebRTC. WebRTC carries media using RTP/SRTP and typically uses UDP when ICE selects UDP candidates. The signaling channel is WebSocket, but the media stream itself is not WebSocket payload data.

So the architecture is:

```text
Browser camera
  -> getUserMedia()
  -> MediaStreamTrack
  -> RTCPeerConnection
  -> WebRTC media path, normally UDP on localhost/LAN
  -> Node.js RTCPeerConnection
  -> RTCVideoSink continuous video-frame consumption
```

## Project structure

```text
react-webrtc-video-to-node-udp/
  package.json
  README.md
  client/
    index.html
    src/
      App.jsx
      main.jsx
      styles.css
  backend/
    signaling-server.cjs
```

## Install

```bash
npm install
```

`@roamhq/wrtc` is a native WebRTC binding for Node.js. It downloads a platform-specific native binary during installation.

## Run

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

Click **Start video stream** and allow camera access.

## Expected backend output

The backend should log the incoming live video stream approximately once per second:

```text
[server] WebRTC signaling is listening on ws://localhost:8080/webrtc
[server] Waiting for browser camera video track...
[signaling] client connected
[media] remote track received: kind=video, id=...
[webrtc] ICE state: connected
[webrtc] connection state: connected
[media] video stream: 1280x720, fps=29.8, rawI420Bytes=1382400
[media] video stream: 1280x720, fps=30.1, rawI420Bytes=1382400
```

This proves that the backend is receiving a continuous video stream, not individual still images.

## Run services separately

Terminal 1:

```bash
npm run backend
```

Terminal 2:

```bash
npm run client
```

## Notes for production

This is an educational minimal implementation.

For production, you would normally add:

- HTTPS/WSS, because camera access requires a secure context outside localhost.
- STUN/TURN servers for NAT traversal.
- Authentication and session authorization on the signaling channel.
- Backpressure and telemetry.
- Media recording, SFU routing, or ML inference depending on the backend objective.
- Explicit bitrate/resolution control via `RTCRtpSender.setParameters()`.

If you need the backend to forward the received media to another UDP/RTP service, the next step is not canvas capture; it is RTP forwarding, SFU design, or an FFmpeg/GStreamer integration after the WebRTC ingest boundary.
