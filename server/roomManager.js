// server/roomManager.js
const rooms = {}; // In-memory store for room states

const roomManager = {
  getRoom: (roomId) => {
    return rooms[roomId];
  },

  joinRoom: (playerId, playerName, roomId, theme) => {
    if (!rooms[roomId]) {
      // Create new room if it doesn't exist
      rooms[roomId] = {
        id: roomId,
        players: {},
        currentPrompt: null,
        answers: [],
        votes: {},
        round: 0,
        theme: { name: theme || "general" },
        currentPhase: "waiting", // waiting, answering, voting, results
        hostId: playerId, // First player to join is the host
      };
      console.log(`Created new room: ${roomId}`);
    }

    const room = rooms[roomId];

    // Check if player already in room
    if (room.players[playerId]) {
      return { success: true, message: "Already in room", roomState: room };
    }

    // Add player to room
    room.players[playerId] = {
      id: playerId,
      name: playerName,
      score: 0,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${playerName}`, // Dynamic avatar
    };

    console.log(`Player ${playerName} (${playerId}) joined room ${roomId}`);
    return { success: true, message: "Joined room successfully", roomState: room };
  },

  leaveRoom: (playerId, roomId) => {
    if (rooms[roomId] && rooms[roomId].players[playerId]) {
      delete rooms[roomId].players[playerId];
      console.log(`Player ${playerId} left room ${roomId}`);
      if (Object.keys(rooms[roomId].players).length === 0) {
        delete rooms[roomId]; // Delete room if empty
        console.log(`Room ${roomId} is now empty and deleted.`);
      }
      return true;
    }
    return false;
  },

  handleDisconnect: (playerId, io) => {
    // Find all rooms the player was in and remove them
    for (const roomId in rooms) {
      if (rooms[roomId].players[playerId]) {
        roomManager.leaveRoom(playerId, roomId);
        io.to(roomId).emit("room-updated", rooms[roomId]); // Notify remaining players
      }
    }
  },

  updateRoomState: (roomId, newState) => {
    if (rooms[roomId]) {
      Object.assign(rooms[roomId], newState);
      return rooms[roomId];
    }
    return null;
  },
};

module.exports = roomManager;