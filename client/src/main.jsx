// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import OverlayPage from './OverlayPage';

// Import your global stylesheets
import './index.css'; // Assuming you have a base index.css
import './App.css'; // Assuming you have your main app styling in App.css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/overlay" element={<OverlayPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);