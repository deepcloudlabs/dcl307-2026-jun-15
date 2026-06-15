# WebRTC Node.js + Vanilla JavaScript Demo

This project implements a minimal two-person WebRTC video call.

## Architecture

```text
Browser A                    Node.js signaling server                    Browser B
---------                    ------------------------                    ---------
getUserMedia()                                                        getUserMedia()
create RTCPeerConnection()                                      create RTCPeerConnection()

createOffer()
setLocalDescription()
        ---------------- offer ---------------->

                                      <---------------- answer ----------------
                                                         createAnswer()
                                                         setLocalDescription()

        ------------- ICE candidates -------------->
        <------------- ICE candidates --------------

======================== peer-to-peer media path ========================
```

The Node.js server does not transmit audio or video. It only forwards signaling messages:
- `offer`
- `answer`
- `ice-candidate`

After negotiation succeeds, media flows directly between browsers through WebRTC.

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Then open two browser windows:

```text
http://localhost:3000
```

Use the same room ID in both windows, for example:

```text
demo-room
```

## Notes

- This demo supports two peers per room.
- `getUserMedia()` works on `localhost`. For deployment on a real domain, use HTTPS.
- The demo uses public Google STUN servers for local development.
- Production deployments should use your own STUN/TURN infrastructure.
- For NAT-restricted enterprise networks, TURN is usually required.
