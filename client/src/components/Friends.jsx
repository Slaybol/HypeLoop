import React, { useState, useEffect } from 'react';
import socialService from '../services/SocialService';

const Friends = ({ playerId, onClose }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [socialStats, setSocialStats] = useState({});

  useEffect(() => {
    if (playerId) {
      loadFriendsData();
    }
  }, [playerId]);

  const loadFriendsData = () => {
    setFriends(socialService.getFriends(playerId));
    setFriendRequests(socialService.getFriendRequests(playerId));
    setSocialStats(socialService.getSocialStats(playerId));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = socialService.searchPlayers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = (toPlayerId, message = '') => {
    socialService.sendFriendRequest(playerId, toPlayerId, message);
    alert('Friend request sent!');
  };

  const acceptFriendRequest = (requestId) => {
    const newFriend = socialService.acceptFriendRequest(playerId, requestId);
    if (newFriend) {
      loadFriendsData();
      alert(`You are now friends with ${newFriend.name}!`);
    }
  };

  const rejectFriendRequest = (requestId) => {
    socialService.rejectFriendRequest(playerId, requestId);
    loadFriendsData();
  };

  const removeFriend = (friendId) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      socialService.removeFriend(playerId, friendId);
      loadFriendsData();
    }
  };

  const sendMessage = (friendId, message) => {
    if (message.trim()) {
      socialService.sendMessage(playerId, friendId, message);
      setChatMessage('');
      const chatHistory = socialService.getChatHistory(playerId, friendId);
      setSelectedFriend({ ...selectedFriend, messages: chatHistory });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'playing': return 'text-blue-600 bg-blue-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const tabs = [
    { id: 'friends', name: 'Friends', icon: '👥', count: friends.length },
    { id: 'requests', name: 'Requests', icon: '📨', count: friendRequests.length },
    { id: 'search', name: 'Find Friends', icon: '🔍' },
    { id: 'chat', name: 'Chat', icon: '💬' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">👥 Friends</h2>
              <p className="text-blue-100">Connect and play with friends</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">{socialStats.friendsCount || 0}</div>
              <div className="text-sm text-blue-100">Friends</div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Social Stats */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{socialStats.socialScore || 0}</div>
              <div className="text-sm text-gray-600">Social Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{socialStats.reputation || 'New'}</div>
              <div className="text-sm text-gray-600">Reputation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{socialStats.badges?.length || 0}</div>
              <div className="text-sm text-gray-600">Badges</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{Math.floor((socialStats.totalPlayTime || 0) / 3600)}h</div>
              <div className="text-sm text-gray-600">Play Time</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b bg-white">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Your Friends ({friends.length})</h3>
              {friends.length > 0 ? (
                <div className="grid gap-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                            {friend.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{friend.name}</div>
                            <div className="text-sm text-gray-600">
                              Level {friend.level} • {friend.achievements} achievements
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(friend.status)}`}>
                                {friend.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {friend.status === 'offline' ? formatTimeAgo(friend.lastSeen) : 'Online'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedFriend(friend)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Chat
                          </button>
                          <button
                            onClick={() => removeFriend(friend.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No friends yet</h3>
                  <p className="text-gray-500">Start by searching for friends or accepting friend requests!</p>
                </div>
              )}
            </div>
          )}

          {/* Friend Requests Tab */}
          {activeTab === 'requests' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Friend Requests ({friendRequests.length})</h3>
              {friendRequests.length > 0 ? (
                <div className="grid gap-4">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            {request.from.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{request.from.name}</div>
                            <div className="text-sm text-gray-600">
                              Level {request.from.level} • {request.message || 'Wants to be your friend!'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTimeAgo(request.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => acceptFriendRequest(request.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectFriendRequest(request.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📨</div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No friend requests</h3>
                  <p className="text-gray-500">When someone sends you a friend request, it will appear here!</p>
                </div>
              )}
            </div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Find Friends</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="grid gap-4">
                  {searchResults.map((player) => (
                    <div key={player.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                            {player.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{player.name}</div>
                            <div className="text-sm text-gray-600">
                              Level {player.level} • {player.achievements} achievements
                            </div>
                            <div className="text-xs text-gray-500">
                              {player.status === 'online' ? 'Online' : 'Offline'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => sendFriendRequest(player.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Add Friend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Chat</h3>
              {selectedFriend ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedFriend.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{selectedFriend.name}</div>
                      <div className="text-sm text-gray-600">{selectedFriend.status}</div>
                    </div>
                    <button
                      onClick={() => setSelectedFriend(null)}
                      className="ml-auto px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                  <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
                    {selectedFriend.messages?.map((msg, index) => (
                      <div key={index} className={`mb-2 ${msg.senderId === playerId ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-3 py-2 rounded-lg ${
                          msg.senderId === playerId 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-800'
                        }`}>
                          {msg.text}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(msg.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage(selectedFriend.id, chatMessage)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => sendMessage(selectedFriend.id, chatMessage)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">Select a friend to chat</h3>
                  <p className="text-gray-500">Choose a friend from your friends list to start chatting!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends; 