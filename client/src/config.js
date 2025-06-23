// Configuration for different environments
const config = {
  development: {
    backendUrl: "http://localhost:3001"
  },
  production: {
    // Use the same domain since Railway serves frontend and backend together
    backendUrl: window.location.origin
  }
};

// Get current environment
const env = import.meta.env.MODE || 'development';

export const BACKEND_URL = config[env].backendUrl; 