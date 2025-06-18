// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './components/Game'; // <--- Make sure this path is correct!

// Import your global stylesheets
import './index.css'; // Assuming you have a base index.css
import './App.css'; // Assuming you have your main app styling in App.css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game /> {/* Render your main Game component */}
  </React.StrictMode>,
);