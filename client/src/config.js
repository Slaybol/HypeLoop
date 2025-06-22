// Configuration for different environments
const config = {
  development: {
    backendUrl: "http://localhost:3001"
  },
  production: {
    // Railway backend URL
    backendUrl: "https://soothing-growth-production.up.railway.app"
  }
};

// Get current environment
const env = import.meta.env.MODE || 'development';

export const BACKEND_URL = config[env].backendUrl; 