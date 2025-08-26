import React, { useState, useRef, useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import Navbar from "../Components/Navbar";

function MakeCall2() {
  const [status, setStatus] = useState("Idle");
  const [callTo, setCallTo] = useState("");
  const [device, setDevice] = useState(null);
  const [incomingConnection, setIncomingConnection] = useState(null);
  const connectionRef = useRef(null);
  const ringAudio = useRef(new Audio("/ringtone.mp3"));


  useEffect(() => {
    setupDevice();
  }, []);

  const setupDevice = () => {
    try {
      const twilioToken = sessionStorage.getItem("twilioToken");
      const user = JSON.parse(sessionStorage.getItem("user"));

      if (!twilioToken || !user?.username) {
        setStatus("Missing Twilio token or user identity");
        return;
      }

      const identity = user.username;
      const twilioDevice = new Device(twilioToken, { debug: true });

      twilioDevice.on("ready", () => {
        setStatus(`✅ Ready as ${identity}`);
      });

      twilioDevice.on("error", (error) => {
        setStatus("❌ Error: " + error.message);
        console.error(error);
      });

      twilioDevice.on("incoming", (connection) => {
        setStatus("📞 Incoming call from " + connection.parameters.From.slice(8));
        ringAudio.current.loop = true;
        ringAudio.current.play().catch(() => {});
        setIncomingConnection(connection);
      });

      twilioDevice.register();
      setDevice(twilioDevice);
    } catch (e) {
      setStatus("Error setting up device: " + e.message);
      console.error(e);
    }
  };

  const makeCall = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const identity = user?.username;

    if (!device) {
      setStatus("Device not ready");
      return;
    }
    if (!callTo) {
      setStatus("Enter the identity to call");
      return;
    }

    setStatus(`📞 Calling ${callTo}...`);
    ringAudio.current.loop = true;
    ringAudio.current.play().catch(() => {});

    const connection = await device.connect({ params: { to: callTo, from: identity } });
    connectionRef.current = connection;

    connection.on("stateChange", () => {
      const state = connection.state;
      if (state === "connected") {
        ringAudio.current.pause();
        setStatus(`✅ Call with ${callTo} connected`);
      } else if (state === "disconnected") {
        ringAudio.current.pause();
        setStatus("❌ Call ended");
        connectionRef.current = null;
      }
    });
  };

  const acceptCall = () => {
    if (incomingConnection) {
      ringAudio.current.pause();
      incomingConnection.accept();
      connectionRef.current = incomingConnection;
      setIncomingConnection(null);

      connectionRef.current.on("stateChange", () => {
        const state = connectionRef.current.state;
        if (state === "connected") setStatus(`✅ Call connected`);
        else if (state === "disconnected") setStatus("❌ Call ended");
      });
    }
  };

  const rejectCall = () => {
    if (incomingConnection) {
      ringAudio.current.pause();
      incomingConnection.reject();
      setIncomingConnection(null);
      setStatus("🚫 Call rejected");
    }
  };

  const hangupCall = () => {
    if (connectionRef.current) {
      connectionRef.current.disconnect();
    } else {
      setStatus("No active call to hang up");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
        <Navbar/>
        <div className="min-h-screen bg-base-200 flex flex-col gap-2 items-center justify-center p-6"> 
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">📱 Twilio Voice</h2>
          <p className="text-center text-sm opacity-70">{status}</p>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter identity to call..."
              className="input input-bordered w-full"
              value={callTo}
              onChange={(e) => setCallTo(e.target.value)}
            />
            <button
              className="btn btn-success w-full mt-2"
              onClick={makeCall}
            >
              📞 Call
            </button>
          </div>

          {incomingConnection && (
            <div className="mt-4 p-4 border rounded-lg bg-base-200">
              <p className="text-lg font-semibold">
                Incoming call from {incomingConnection.parameters.From}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  className="btn btn-success flex-1"
                  onClick={acceptCall}
                >
                  ✅ Accept
                </button>
                <button
                  className="btn btn-error flex-1"
                  onClick={rejectCall}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          )}

          <button
            className="btn btn-warning w-full mt-4"
            onClick={hangupCall}
          >
            ⛔ Hang Up
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default MakeCall2;
