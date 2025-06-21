// Social Features System
class SocialService {
  constructor() {
    this.friends = new Map();
    this.friendRequests = new Map();
    this.socialStats = new Map();
    this.chatHistory = new Map();
    this.groups = new Map();
    this.events = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  initializeMockData() {
    // Mock friends
    this.friends.set('player1', [
      { id: 'friend1', name: 'Alex', status: 'online', lastSeen: new Date(), level: 15, achievements: 8 },
      { id: 'friend2', name: 'Sam', status: 'playing', lastSeen: new Date(), level: 12, achievements: 6 },
      { id: 'friend3', name: 'Jordan', status: 'offline', lastSeen: new Date(Date.now() - 3600000), level: 20, achievements: 12 }
    ]);

    // Mock friend requests
    this.friendRequests.set('player1', [
      { id: 'request1', name: 'Taylor', message: 'Hey! Let\'s play together!', timestamp: new Date() },
      { id: 'request2', name: 'Casey', message: 'Great game last time!', timestamp: new Date(Date.now() - 1800000) }
    ]);

    // Mock social stats
    this.socialStats.set('player1', {
      friendsCount: 3,
      gamesPlayed: 25,
      totalPlayTime: 3600, // seconds
      favoriteGameMode: 'Chaos Mode',
      bestFriend: 'Alex',
      socialScore: 850,
      reputation: 'Friendly',
      badges: ['Team Player', 'Helpful', 'Active']
    });

    // Mock chat history
    this.chatHistory.set('player1', [
      { id: 'chat1', friendId: 'friend1', messages: [
        { sender: 'friend1', text: 'Great game!', timestamp: new Date(Date.now() - 300000) },
        { sender: 'player1', text: 'Thanks! You too!', timestamp: new Date(Date.now() - 240000) },
        { sender: 'friend1', text: 'Want to play again?', timestamp: new Date(Date.now() - 180000) }
      ]}
    ]);

    // Mock groups
    this.groups.set('group1', {
      id: 'group1',
      name: 'Chaos Warriors',
      description: 'A group for chaos mode enthusiasts',
      members: ['player1', 'friend1', 'friend2'],
      owner: 'friend1',
      createdAt: new Date(Date.now() - 86400000),
      rules: ['Be respectful', 'No cheating', 'Have fun!'],
      events: ['group1_event1']
    });

    // Mock events
    this.events.set('group1_event1', {
      id: 'group1_event1',
      name: 'Chaos Cup Tournament',
      description: 'Weekly chaos mode tournament for group members',
      groupId: 'group1',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      participants: ['player1', 'friend1'],
      maxParticipants: 16,
      rewards: { coins: 500, experience: 100 },
      status: 'upcoming'
    });
  }

  // Friend Management
  getFriends(playerId) {
    return this.friends.get(playerId) || [];
  }

  getFriendRequests(playerId) {
    return this.friendRequests.get(playerId) || [];
  }

  sendFriendRequest(fromPlayerId, toPlayerId, message = '') {
    const request = {
      id: `request_${Date.now()}`,
      fromPlayerId,
      name: this.getPlayerName(fromPlayerId),
      message,
      timestamp: new Date()
    };

    const requests = this.friendRequests.get(toPlayerId) || [];
    requests.push(request);
    this.friendRequests.set(toPlayerId, requests);

    return request;
  }

  acceptFriendRequest(playerId, requestId) {
    const requests = this.friendRequests.get(playerId) || [];
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      // Add to friends list
      const friends = this.friends.get(playerId) || [];
      const newFriend = {
        id: request.fromPlayerId,
        name: request.name,
        status: 'online',
        lastSeen: new Date(),
        level: this.getPlayerLevel(request.fromPlayerId),
        achievements: this.getPlayerAchievements(request.fromPlayerId)
      };
      friends.push(newFriend);
      this.friends.set(playerId, friends);

      // Remove from requests
      const updatedRequests = requests.filter(r => r.id !== requestId);
      this.friendRequests.set(playerId, updatedRequests);

      // Update social stats
      this.updateSocialStats(playerId, { friendsCount: friends.length });

      return newFriend;
    }
    return null;
  }

  rejectFriendRequest(playerId, requestId) {
    const requests = this.friendRequests.get(playerId) || [];
    const updatedRequests = requests.filter(r => r.id !== requestId);
    this.friendRequests.set(playerId, updatedRequests);
  }

  removeFriend(playerId, friendId) {
    const friends = this.friends.get(playerId) || [];
    const updatedFriends = friends.filter(f => f.id !== friendId);
    this.friends.set(playerId, updatedFriends);
    this.updateSocialStats(playerId, { friendsCount: updatedFriends.length });
  }

  // Chat System
  getChatHistory(playerId, friendId) {
    const chats = this.chatHistory.get(playerId) || [];
    const chat = chats.find(c => c.friendId === friendId);
    return chat ? chat.messages : [];
  }

  sendMessage(playerId, friendId, message) {
    const chats = this.chatHistory.get(playerId) || [];
    let chat = chats.find(c => c.friendId === friendId);
    
    if (!chat) {
      chat = { id: `chat_${Date.now()}`, friendId, messages: [] };
      chats.push(chat);
    }

    const newMessage = {
      sender: playerId,
      text: message,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    this.chatHistory.set(playerId, chats);

    return newMessage;
  }

  // Group System
  getGroups(playerId) {
    const groups = Array.from(this.groups.values());
    return groups.filter(group => group.members.includes(playerId));
  }

  createGroup(playerId, name, description, rules = []) {
    const group = {
      id: `group_${Date.now()}`,
      name,
      description,
      members: [playerId],
      owner: playerId,
      createdAt: new Date(),
      rules,
      events: []
    };

    this.groups.set(group.id, group);
    return group;
  }

  joinGroup(playerId, groupId) {
    const group = this.groups.get(groupId);
    if (group && !group.members.includes(playerId)) {
      group.members.push(playerId);
      return group;
    }
    return null;
  }

  leaveGroup(playerId, groupId) {
    const group = this.groups.get(groupId);
    if (group) {
      group.members = group.members.filter(m => m !== playerId);
      if (group.members.length === 0) {
        this.groups.delete(groupId);
      }
      return true;
    }
    return false;
  }

  // Event System
  getEvents(playerId) {
    const events = Array.from(this.events.values());
    return events.filter(event => {
      const group = this.groups.get(event.groupId);
      return group && group.members.includes(playerId);
    });
  }

  createEvent(playerId, groupId, name, description, startTime, endTime, maxParticipants, rewards) {
    const event = {
      id: `event_${Date.now()}`,
      name,
      description,
      groupId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      participants: [playerId],
      maxParticipants,
      rewards,
      status: 'upcoming',
      createdAt: new Date()
    };

    this.events.set(event.id, event);
    
    // Add to group events
    const group = this.groups.get(groupId);
    if (group) {
      group.events.push(event.id);
    }

    return event;
  }

  joinEvent(playerId, eventId) {
    const event = this.events.get(eventId);
    if (event && !event.participants.includes(playerId) && event.participants.length < event.maxParticipants) {
      event.participants.push(playerId);
      return event;
    }
    return null;
  }

  leaveEvent(playerId, eventId) {
    const event = this.events.get(eventId);
    if (event) {
      event.participants = event.participants.filter(p => p !== playerId);
      return event;
    }
    return null;
  }

  // Social Stats
  getSocialStats(playerId) {
    return this.socialStats.get(playerId) || {
      friendsCount: 0,
      gamesPlayed: 0,
      totalPlayTime: 0,
      favoriteGameMode: 'None',
      bestFriend: 'None',
      socialScore: 0,
      reputation: 'New',
      badges: []
    };
  }

  updateSocialStats(playerId, updates) {
    const stats = this.getSocialStats(playerId);
    Object.assign(stats, updates);
    this.socialStats.set(playerId, stats);
  }

  // Reputation System
  giveReputation(fromPlayerId, toPlayerId, type) {
    const stats = this.getSocialStats(toPlayerId);
    const reputationPoints = {
      'positive': 10,
      'negative': -5,
      'helpful': 15,
      'friendly': 8
    };

    stats.socialScore += reputationPoints[type] || 0;
    this.updateSocialStats(toPlayerId, stats);

    return {
      fromPlayerId,
      toPlayerId,
      type,
      points: reputationPoints[type] || 0,
      timestamp: new Date()
    };
  }

  // Badge System
  awardBadge(playerId, badgeType) {
    const stats = this.getSocialStats(playerId);
    const badges = {
      'Team Player': { requirement: 'Play 10 games with friends', icon: '👥' },
      'Helpful': { requirement: 'Help 5 new players', icon: '🤝' },
      'Active': { requirement: 'Play for 7 days in a row', icon: '🔥' },
      'Friendly': { requirement: 'Make 10 friends', icon: '😊' },
      'Leader': { requirement: 'Create a group with 5+ members', icon: '👑' },
      'Event Organizer': { requirement: 'Host 3 events', icon: '📅' },
      'Chaos Master': { requirement: 'Win 5 chaos mode games', icon: '🌀' },
      'Social Butterfly': { requirement: 'Chat with 20 different players', icon: '🦋' }
    };

    if (!stats.badges.includes(badgeType) && badges[badgeType]) {
      stats.badges.push(badgeType);
      this.updateSocialStats(playerId, stats);
      return badges[badgeType];
    }
    return null;
  }

  // Utility Methods
  getPlayerName(playerId) {
    // This would normally fetch from a player database
    const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn'];
    return names[Math.floor(Math.random() * names.length)];
  }

  getPlayerLevel(playerId) {
    // This would normally calculate from player stats
    return Math.floor(Math.random() * 25) + 1;
  }

  getPlayerAchievements(playerId) {
    // This would normally fetch from achievement system
    return Math.floor(Math.random() * 15);
  }

  // Search and Discovery
  searchPlayers(query) {
    // Mock player search
    const mockPlayers = [
      { id: 'search1', name: 'Alex', level: 15, achievements: 8, status: 'online' },
      { id: 'search2', name: 'Sam', level: 12, achievements: 6, status: 'playing' },
      { id: 'search3', name: 'Jordan', level: 20, achievements: 12, status: 'offline' },
      { id: 'search4', name: 'Taylor', level: 8, achievements: 3, status: 'online' },
      { id: 'search5', name: 'Casey', level: 18, achievements: 10, status: 'online' }
    ];

    return mockPlayers.filter(player => 
      player.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  getRecommendedFriends(playerId) {
    // Mock friend recommendations
    return [
      { id: 'rec1', name: 'Morgan', level: 14, mutualFriends: 2, commonInterests: ['Chaos Mode'] },
      { id: 'rec2', name: 'Riley', level: 16, mutualFriends: 1, commonInterests: ['Tournaments'] },
      { id: 'rec3', name: 'Quinn', level: 11, mutualFriends: 3, commonInterests: ['Achievements'] }
    ];
  }

  // Activity Feed
  getActivityFeed(playerId) {
    const friends = this.getFriends(playerId);
    const activities = [];

    friends.forEach(friend => {
      activities.push({
        id: `activity_${Date.now()}_${friend.id}`,
        playerId: friend.id,
        playerName: friend.name,
        type: 'achievement',
        description: `${friend.name} unlocked the "Chaos Master" achievement!`,
        timestamp: new Date(Date.now() - Math.random() * 86400000)
      });
    });

    return activities.sort((a, b) => b.timestamp - a.timestamp);
  }
}

// Create singleton instance
const socialService = new SocialService();

export default socialService; 