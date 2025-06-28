import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Badge from './Badge';

const JoinScreen = ({ 
  onJoin, 
  onAuth, 
  user, 
  loading = false,
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    name: user?.profile?.displayName || user?.username || '',
    room: '',
    theme: 'general'
  });
  const [errors, setErrors] = useState({});

  const themes = [
    { id: 'general', name: 'General', icon: '🎯' },
    { id: '1990s', name: '90s Nostalgia', icon: '📼' },
    { id: 'adult', name: 'Adult Humor', icon: '🍷' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.room.trim()) {
      newErrors.room = 'Room name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onJoin(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, room: code }));
  };

  return (
    <div className={`animate-fade-in ${className}`}>
      <Card variant="elevated" className="p-8">
        <Card.Header>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
              <span className="text-white text-2xl">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome to HypeLoop
            </h1>
            <p className="text-neutral-600 text-lg">
              Join the ultimate party game experience
            </p>
          </div>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Name */}
            <Input
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Enter your name"
              leftIcon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            {/* Room Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Room Code
              </label>
              <div className="flex space-x-2">
                <Input
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  error={errors.room}
                  placeholder="Enter room code"
                  className="flex-1"
                  leftIcon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRoomCode}
                  className="px-4"
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Game Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.theme === theme.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{theme.icon}</span>
                      <span className="font-medium">{theme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Join Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Join Game
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">or</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            {!user ? (
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={onAuth}
              >
                Sign in to save progress
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  Signed in as <span className="font-medium">{user.profile?.displayName || user.username}</span>
                </p>
              </div>
            )}
          </div>
        </Card.Body>

        <Card.Footer>
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-4 text-sm text-neutral-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>2-8 players</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>5-10 min</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2">
              <Badge variant="success" size="sm">Family Friendly</Badge>
              <Badge variant="info" size="sm">Real-time</Badge>
              <Badge variant="secondary" size="sm">Multiplayer</Badge>
            </div>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default JoinScreen; 