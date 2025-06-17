import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './components/Game'; // Assuming Game.jsx is the main component

// If App.css is your main global stylesheet, ensure it's imported somewhere,
// e.g., in App.jsx or main.jsx. For simplicity, it can also be imported here if it's truly global.
// import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);