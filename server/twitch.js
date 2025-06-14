// server/twitch.js
export function initTwitchVoting(socket, room) {
  // placeholder to simulate Twitch chat vote
  socket.on('twitch_vote', ({ vote }) => {
    // broadcast mock vote
    socket.to(room).emit('twitch_vote_update', vote);
  });
}
