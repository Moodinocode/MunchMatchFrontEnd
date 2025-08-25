import { useState, useEffect, useRef } from "react";
import { getAllUsers } from "../Services/userService";
import { Device } from "@twilio/voice-sdk";

const MakeCallPage = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [twilioDevice, setTwilioDevice] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);
  const [incomingConnection, setIncomingConnection] = useState(null); // For incoming calls
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getAllUsers();
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchContacts();
  }, []);

  // Initialize Twilio Device
  useEffect(() => {
    const token = sessionStorage.getItem("twilioToken");
    if (!token) return;

    const device = new Device(token);

    device.on("ready", () => console.log("Twilio Device Ready"));
    device.on("error", (err) => console.error("Twilio Device Error:", err));

    // Outgoing call connected
    device.on("connect", (conn) => {
      console.log("Call connected");
      setActiveConnection(conn);
      setIncomingConnection(null);
      setCallTime(0);
      timerRef.current = setInterval(() => setCallTime((t) => t + 1), 1000);
    });

    // Call disconnected
    device.on("disconnect", () => {
      console.log("Call disconnected");
      setActiveConnection(null);
      setCallTime(0);
      clearInterval(timerRef.current);
    });

    // Incoming call
    device.on("incoming", (conn) => {
      console.log("Incoming call from", conn.parameters.From);
      setIncomingConnection(conn); // store the incoming connection
    });

    setTwilioDevice(device);

    return () => {
      clearInterval(timerRef.current);
      device.destroy();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (contact) => {
    setSelectedContact(contact);
    setSearch(contact.username || contact.name || "");
    setShowDropdown(false);
  };

  const handleCall = () => {
    if (!selectedContact) {
      alert("Please select a contact to call!");
      return;
    }
    if (!twilioDevice) {
      alert("Twilio Device not ready");
      return;
    }

    twilioDevice.connect({ params: {to: selectedContact.username, from: sessionStorage.getItem("user").username} });
  };

  const handleHangup = () => {
    if (activeConnection) activeConnection.disconnect();
    if (incomingConnection) incomingConnection.reject();
  };

  const handleAccept = () => {
    if (incomingConnection) {
      incomingConnection.accept();
      setActiveConnection(incomingConnection);
      setIncomingConnection(null);
      setCallTime(0);
      timerRef.current = setInterval(() => setCallTime((t) => t + 1), 1000);
    }
  };

  const handleReject = () => {
    if (incomingConnection) {
      incomingConnection.reject();
      setIncomingConnection(null);
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      (c.username && c.username.toLowerCase().includes(search.toLowerCase())) ||
      (c.name && c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Make a Call</h2>

      {!activeConnection && !incomingConnection ? (
        // Search & make call UI
        <div className="mb-4 relative" ref={dropdownRef}>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search and select a contact..."
            className="border p-2 rounded w-full"
          />
          {showDropdown && filteredContacts.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto mt-1 rounded shadow-lg">
              {filteredContacts.map((contact) => (
                <li
                  key={contact.id}
                  onClick={() => handleSelect(contact)}
                  className="p-2 hover:bg-teal-100 cursor-pointer"
                >
                  {contact.name || contact.username} ({contact.username})
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleCall}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Make Call
          </button>
        </div>
      ) : incomingConnection ? (
        // Incoming call UI
        <div className="p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">
            Incoming call from {incomingConnection.parameters.From}
          </h3>
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ) : (
        // Active call UI
        <div className="p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">
            In Call with {selectedContact?.name || selectedContact?.username}
          </h3>
          <p className="mt-1">Duration: {formatTime(callTime)}</p>
          <button
            onClick={handleHangup}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Hang Up
          </button>
        </div>
      )}
    </div>
  );
};

export default MakeCallPage;
