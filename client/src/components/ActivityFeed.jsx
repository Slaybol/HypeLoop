import React, { useState, useEffect } from 'react';
import socialService from '../services/SocialService';

const ActivityFeed = ({ playerId, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'status',
    visibility: 'friends'
  });

  useEffect(() => {
    if (playerId) {
      loadActivities();
    }
  }, [playerId]);

  const loadActivities = () => {
    const feed = socialService.getActivityFeed(playerId);
    setActivities(feed);
  };

  const createPost = () => {
    if (newPost.content.trim()) {
      // In a real app, this would save to a database
      const post = {
        id: `post_${Date.now()}`,
        playerId,
        playerName: 'You',
        type: newPost.type,
        content: newPost.content,
        visibility: newPost.visibility,
        timestamp: new Date(),
        likes: 0,
        comments: []
      };
      
      setActivities([post, ...activities]);
      setShowCreatePost(false);
      setNewPost({ content: '', type: 'status', visibility: 'friends' });
    }
  };

  const likePost = (postId) => {
    setActivities(activities.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
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

  const getActivityIcon = (type) => {
    const icons = {
      'achievement': '🏆',
      'game': '🎮',
      'status': '💭',
      'friend': '👥',
      'group': '👥',
      'event': '📅',
      'tournament': '🏅'
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type) => {
    const colors = {
      'achievement': 'bg-yellow-100 text-yellow-800',
      'game': 'bg-blue-100 text-blue-800',
      'status': 'bg-gray-100 text-gray-800',
      'friend': 'bg-green-100 text-green-800',
      'group': 'bg-purple-100 text-purple-800',
      'event': 'bg-orange-100 text-orange-800',
      'tournament': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filters = [
    { id: 'all', name: 'All', icon: '📱' },
    { id: 'achievement', name: 'Achievements', icon: '🏆' },
    { id: 'game', name: 'Games', icon: '🎮' },
    { id: 'friend', name: 'Friends', icon: '👥' },
    { id: 'group', name: 'Groups', icon: '👥' },
    { id: 'event', name: 'Events', icon: '📅' }
  ];

  const filteredActivities = activities.filter(activity => 
    activeFilter === 'all' || activity.type === activeFilter
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📱 Activity Feed</h2>
              <p className="text-purple-100">Stay updated with friends and community</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">{activities.length}</div>
              <div className="text-sm text-purple-100">Activities</div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-white">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Create Post Button */}
        <div className="p-4 border-b bg-gray-50">
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200"
          >
            ✨ Share something with your friends...
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {activity.playerName.charAt(0)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-lg">{activity.playerName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)} {activity.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      
                      <div className="text-gray-800 mb-3">
                        {activity.content || activity.description}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-4 text-sm">
                        <button
                          onClick={() => likePost(activity.id)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <span>❤️</span>
                          <span>{activity.likes || 0}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                          <span>💬</span>
                          <span>{activity.comments?.length || 0}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
                          <span>🔄</span>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📱</div>
              <p>No activities yet</p>
              <p className="text-sm">Start sharing and connect with friends!</p>
            </div>
          )}
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Create Post</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="status">Status Update</option>
                    <option value="achievement">Achievement</option>
                    <option value="game">Game Result</option>
                    <option value="friend">Friend Activity</option>
                    <option value="group">Group Activity</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="What's on your mind?"
                    rows="4"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select
                    value={newPost.visibility}
                    onChange={(e) => setNewPost({ ...newPost, visibility: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="friends">Friends Only</option>
                    <option value="public">Public</option>
                    <option value="group">Group Members</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={createPost}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg"
                >
                  Post
                </button>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed; 