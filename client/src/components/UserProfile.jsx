import React, { useState, useEffect } from 'react';

const UserProfile = ({ playerId, onClose }) => {
  const [profile, setProfile] = useState({
    username: 'Player',
    level: 1,
    experience: 0,
    achievements: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    joinDate: new Date().toLocaleDateString(),
    avatar: '',
    bio: 'No bio yet...'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    // In a real app, this would fetch from an API
    if (playerId) {
      // Simulate loading profile data
      setProfile({
        username: `Player${playerId}`,
        level: Math.floor(Math.random() * 50) + 1,
        experience: Math.floor(Math.random() * 1000),
        achievements: Math.floor(Math.random() * 20),
        gamesPlayed: Math.floor(Math.random() * 100),
        gamesWon: Math.floor(Math.random() * 50),
        totalScore: Math.floor(Math.random() * 10000),
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        avatar: '',
        bio: 'No bio yet...'
      });
    }
  }, [playerId]);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const getLevelProgress = () => {
    const expForNextLevel = profile.level * 100;
    const currentLevelExp = (profile.level - 1) * 100;
    const progress = ((profile.experience - currentLevelExp) / (expForNextLevel - currentLevelExp)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">👤 User Profile</h2>
              <p className="text-purple-100">Manage your profile and stats</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.username.charAt(0)}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="text-xl font-bold text-center bg-white border rounded px-2 py-1 mb-2"
                  />
                ) : (
                  <h3 className="text-xl font-bold mb-2">{profile.username}</h3>
                )}
                <div className="text-sm text-gray-600 mb-4">Level {profile.level}</div>
                
                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Experience</span>
                    <span>{profile.experience} / {profile.level * 100}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Write a short bio..."
                      className="w-full p-2 border rounded text-sm"
                      rows="3"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">{profile.bio}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">📊 Game Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profile.gamesPlayed}</div>
                  <div className="text-sm">Games Played</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profile.gamesWon}</div>
                  <div className="text-sm">Games Won</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profile.achievements}</div>
                  <div className="text-sm">Achievements</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profile.totalScore}</div>
                  <div className="text-sm">Total Score</div>
                </div>
              </div>

              {/* Win Rate */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold mb-2">Win Rate</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Wins</span>
                      <span>{Math.round((profile.gamesWon / Math.max(profile.gamesPlayed, 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(profile.gamesWon / Math.max(profile.gamesPlayed, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-2">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Joined HypeLoop</span>
                    <span className="text-gray-600">{profile.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last game played</span>
                    <span className="text-gray-600">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last achievement</span>
                    <span className="text-gray-600">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;



