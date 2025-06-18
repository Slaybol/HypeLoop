import { io } from "socket.io-client";

// Use an environment variable for the server URL
// For Vite, environment variables prefixed with VITE_ are exposed via import.meta.env
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

const socket = io(SERVER_URL, {
  // Optional: add connection options if needed, e.g., for CORS
  // autoConnect: false // If you want to manually connect later in your app
});

// Optional: Add basic connection status logging for debugging and user feedback
socket.on('connect', () => {
  console.log('Socket connected to server:', socket.id, SERVER_URL);
  // Optionally update a UI element to show connected status
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
  // Inform the user about disconnection, e.g., "Lost connection to game server."
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
  // Alert the user or display an error message in the UI
  // alert('Could not connect to the game server. Please try again later.');
});

export default socket;