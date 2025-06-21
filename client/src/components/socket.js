import { io } from "socket.io-client";

// Use environment variable for both socket and HTTP requests
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
const API_BASE_URL = SERVER_URL;

const socket = io(SERVER_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});

// Connection state tracking
let isConnected = false;
let connectionCallbacks = [];

// Connection status management
socket.on('connect', () => {
  isConnected = true;
  console.log('Socket connected to server:', socket.id, SERVER_URL);
  
  // Execute any pending callbacks waiting for connection
  connectionCallbacks.forEach(callback => callback());
  connectionCallbacks = [];
});

socket.on('disconnect', (reason) => {
  isConnected = false;
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
});

// Helper function to ensure socket is connected before emitting
const emitWhenConnected = (event, data) => {
  if (isConnected) {
    socket.emit(event, data);
  } else {
    connectionCallbacks.push(() => socket.emit(event, data));
  }
};

// Helper function to get connection state
const getConnectionState = () => isConnected;

export default socket;
export { API_BASE_URL, emitWhenConnected, getConnectionState };