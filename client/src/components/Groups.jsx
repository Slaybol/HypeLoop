import React, { useState, useEffect } from 'react';
import socialService from '../services/SocialService';

const Groups = ({ playerId, onClose }) => {
  const [activeTab, setActiveTab] = useState('my-groups');
  const [groups, setGroups] = useState([]);
  const [groupInvites, setGroupInvites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPrivate: false,
    maxMembers: 10
  });

  useEffect(() => {
    if (playerId) {
      loadGroupsData();
    }
  }, [playerId]);

  const loadGroupsData = () => {
    setGroups(socialService.getGroups(playerId));
    setGroupInvites(socialService.getGroupInvites(playerId));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = socialService.searchGroups(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const createGroup = () => {
    if (newGroup.name.trim()) {
      const group = socialService.createGroup(playerId, newGroup);
      if (group) {
        setGroups([...groups, group]);
        setShowCreateGroup(false);
        setNewGroup({ name: '', description: '', isPrivate: false, maxMembers: 10 });
      }
    }
  };

  const joinGroup = (groupId) => {
    const success = socialService.joinGroup(playerId, groupId);
    if (success) {
      loadGroupsData();
      alert('Successfully joined the group!');
    }
  };

  const leaveGroup = (groupId) => {
    if (confirm('Are you sure you want to leave this group?')) {
      socialService.leaveGroup(playerId, groupId);
      loadGroupsData();
    }
  };

  const acceptGroupInvite = (inviteId) => {
    const group = socialService.acceptGroupInvite(playerId, inviteId);
    if (group) {
      loadGroupsData();
      alert(`You joined ${group.name}!`);
    }
  };

  const rejectGroupInvite = (inviteId) => {
    socialService.rejectGroupInvite(playerId, inviteId);
    loadGroupsData();
  };

  const getMemberRole = (groupId, memberId) => {
    const group = groups.find(g => g.id === groupId);
    const member = group?.members?.find(m => m.id === memberId);
    return member?.role || 'member';
  };

  const tabs = [
    { id: 'my-groups', name: 'My Groups', icon: '👥', count: groups.length },
    { id: 'invites', name: 'Invites', icon: '📨', count: groupInvites.length },
    { id: 'discover', name: 'Discover', icon: '🔍' },
    { id: 'create', name: 'Create Group', icon: '➕' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">👥 Groups</h2>
              <p className="text-green-100">Join communities and play together</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">{groups.length}</div>
              <div className="text-sm text-green-100">Groups</div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
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
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
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
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* My Groups Tab */}
          {activeTab === 'my-groups' && (
            <div>
              <h3 className="text-xl font-bold mb-4">My Groups ({groups.length})</h3>
              {groups.length > 0 ? (
                <div className="grid gap-4">
                  {groups.map((group) => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            {group.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{group.name}</div>
                            <div className="text-sm text-gray-600">
                              {group.members?.length || 0} members • {group.description}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                getMemberRole(group.id, playerId) === 'admin' 
                                  ? 'bg-red-100 text-red-600' 
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                {getMemberRole(group.id, playerId)}
                              </span>
                              {group.isPrivate && (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                  Private
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedGroup(group)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => leaveGroup(group.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Leave
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No groups yet</h3>
                  <p className="text-gray-500">Join existing groups or create your own!</p>
                </div>
              )}
            </div>
          )}

          {/* Group Invites Tab */}
          {activeTab === 'invites' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Group Invites ({groupInvites.length})</h3>
              {groupInvites.length > 0 ? (
                <div className="grid gap-4">
                  {groupInvites.map((invite) => (
                    <div key={invite.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            {invite.group.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{invite.group.name}</div>
                            <div className="text-sm text-gray-600">
                              Invited by {invite.invitedBy.name} • {invite.group.members?.length || 0} members
                            </div>
                            <div className="text-xs text-gray-500">
                              {invite.message || 'Join our group!'}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => acceptGroupInvite(invite.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectGroupInvite(invite.id)}
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
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No group invites</h3>
                  <p className="text-gray-500">When someone invites you to a group, it will appear here!</p>
                </div>
              )}
            </div>
          )}

          {/* Discover Tab */}
          {activeTab === 'discover' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Discover Groups</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="grid gap-4">
                  {searchResults.map((group) => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            {group.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{group.name}</div>
                            <div className="text-sm text-gray-600">
                              {group.members?.length || 0} members • {group.description}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {group.isPrivate && (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                  Private
                                </span>
                              )}
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                                {group.category || 'Gaming'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => joinGroup(group.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Join Group
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Group Tab */}
          {activeTab === 'create' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Create New Group</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="Enter group name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    placeholder="Describe your group..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Members</label>
                  <input
                    type="number"
                    value={newGroup.maxMembers}
                    onChange={(e) => setNewGroup({...newGroup, maxMembers: parseInt(e.target.value)})}
                    min="2"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="private-group"
                    checked={newGroup.isPrivate}
                    onChange={(e) => setNewGroup({...newGroup, isPrivate: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="private-group" className="text-sm text-gray-700">
                    Private group (invitation only)
                  </label>
                </div>
                <button
                  onClick={createGroup}
                  disabled={!newGroup.name.trim()}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups; 