import React from 'react';
import Button from './Button';
import Badge from './Badge';

const GameHeader = ({ 
  user, 
  gameState, 
  room, 
  playerCount, 
  onAuth, 
  onProfile, 
  onLeave,
  className = '' 
}) => {
  const getGameStateColor = (state) => {
    switch (state) {
      case 'join': return 'info';
      case 'waiting': return 'warning';
      case 'answering': return 'primary';
      case 'voting': return 'secondary';
      case 'results': return 'success';
      default: return 'default';
    }
  };

  const getGameStateText = (state) => {
    switch (state) {
      case 'join': return 'Join Game';
      case 'waiting': return 'Waiting for Players';
      case 'answering': return 'Answering';
      case 'voting': return 'Voting';
      case 'results': return 'Results';
      default: return 'Unknown';
    }
  };

  return (
    <header className={`bg-white/95 backdrop-blur-md border-b border-white/20 shadow-soft ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Game Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HL</span>
              </div>
              <h1 className="text-xl font-bold text-neutral-900">HypeLoop</h1>
            </div>
            
            {room && (
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-neutral-500">Room:</span>
                <Badge variant="primary" size="sm">{room}</Badge>
              </div>
            )}
            
            {gameState !== 'join' && (
              <Badge 
                variant={getGameStateColor(gameState)} 
                size="sm"
                className="animate-pulse-glow"
              >
                {getGameStateText(gameState)}
              </Badge>
            )}
          </div>

          {/* Player Count and Game Stats */}
          <div className="hidden md:flex items-center space-x-4">
            {playerCount > 0 && (
              <div className="flex items-center space-x-2 text-neutral-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="font-medium">{playerCount} players</span>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.profile?.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-neutral-900">
                      {user.profile?.displayName || user.username}
                    </p>
                    <p className="text-xs text-neutral-500">Level {user.stats?.level || 1}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onProfile}
                  className="hidden sm:flex"
                >
                  Profile
                </Button>
                
                {gameState !== 'join' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLeave}
                  >
                    Leave Game
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onAuth}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader; 