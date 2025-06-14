import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from './socket';

export default function JoinGame() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name && room) {
      socket.emit('join_game', { room, player: name });
      navigate(`/game/${room}`, { state: { name, room } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Join HypeLoop</h1>
      <input className="mb-4 p-2 rounded text-black" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
      <input className="mb-4 p-2 rounded text-black" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room Code" />
      <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500" onClick={handleJoin}>Join Game</button>
    </div>
  );
}
