
import React, { useState } from "react";

function Join({ onJoin }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const handleJoin = () => {
    if (name && room) {
      onJoin(name, room);
    }
  };

  return (
    <div className="app-container">
      <h1>Join HypeLoop</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room code" />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

export default Join;
