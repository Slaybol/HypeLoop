import React from 'react';
import GameHeader from './GameHeader';

const GameLayout = ({ 
  children, 
  user, 
  gameState, 
  room, 
  playerCount, 
  onAuth, 
  onProfile, 
  onLeave,
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 ${className}`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #667eea 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #764ba2 0%, transparent 50%)`,
        }} />
      </div>
      
      {/* Header */}
      <GameHeader
        user={user}
        gameState={gameState}
        room={room}
        playerCount={playerCount}
        onAuth={onAuth}
        onProfile={onProfile}
        onLeave={onLeave}
      />
      
      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-20 md:hidden">
        <button className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-large hover:shadow-glow transition-all duration-200 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Layout variants for different game states
GameLayout.Join = ({ children, ...props }) => (
  <GameLayout {...props}>
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  </GameLayout>
);

GameLayout.Waiting = ({ children, ...props }) => (
  <GameLayout {...props}>
    <div className="space-y-6">
      {children}
    </div>
  </GameLayout>
);

GameLayout.Game = ({ children, ...props }) => (
  <GameLayout {...props}>
    <div className="space-y-8">
      {children}
    </div>
  </GameLayout>
);

export default GameLayout; 