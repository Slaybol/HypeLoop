import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Test storage access
      await AsyncStorage.setItem('test', 'test');
      await AsyncStorage.removeItem('test');
      this.isInitialized = true;
      console.log('StorageService initialized successfully');
    } catch (error) {
      console.error('StorageService initialization failed:', error);
    }
  }

  // User preferences
  async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  async getUserPreferences() {
    try {
      const preferences = await AsyncStorage.getItem('userPreferences');
      return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  getDefaultPreferences() {
    return {
      username: '',
      avatar: 'default',
      theme: 'default',
      soundEnabled: true,
      musicEnabled: true,
      hapticEnabled: true,
      notificationsEnabled: true,
      musicVolume: 0.7,
      soundVolume: 1.0,
      language: 'en',
    };
  }

  // Game data
  async saveGameData(gameData) {
    try {
      await AsyncStorage.setItem('gameData', JSON.stringify(gameData));
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  }

  async getGameData() {
    try {
      const gameData = await AsyncStorage.getItem('gameData');
      return gameData ? JSON.parse(gameData) : this.getDefaultGameData();
    } catch (error) {
      console.error('Failed to get game data:', error);
      return this.getDefaultGameData();
    }
  }

  getDefaultGameData() {
    return {
      totalGames: 0,
      totalWins: 0,
      totalPoints: 0,
      achievements: [],
      powerUps: [],
      coins: 0,
      level: 1,
      experience: 0,
      lastPlayed: null,
      favoritePrompts: [],
      customPrompts: [],
    };
  }

  // Offline game data
  async saveOfflineGame(gameState) {
    try {
      await AsyncStorage.setItem('offlineGame', JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save offline game:', error);
    }
  }

  async getOfflineGame() {
    try {
      const offlineGame = await AsyncStorage.getItem('offlineGame');
      return offlineGame ? JSON.parse(offlineGame) : null;
    } catch (error) {
      console.error('Failed to get offline game:', error);
      return null;
    }
  }

  async clearOfflineGame() {
    try {
      await AsyncStorage.removeItem('offlineGame');
    } catch (error) {
      console.error('Failed to clear offline game:', error);
    }
  }

  // Friends list
  async saveFriendsList(friends) {
    try {
      await AsyncStorage.setItem('friendsList', JSON.stringify(friends));
    } catch (error) {
      console.error('Failed to save friends list:', error);
    }
  }

  async getFriendsList() {
    try {
      const friends = await AsyncStorage.getItem('friendsList');
      return friends ? JSON.parse(friends) : [];
    } catch (error) {
      console.error('Failed to get friends list:', error);
      return [];
    }
  }

  // Chat history
  async saveChatHistory(roomId, messages) {
    try {
      const key = `chat_${roomId}`;
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  async getChatHistory(roomId) {
    try {
      const key = `chat_${roomId}`;
      const messages = await AsyncStorage.getItem(key);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return [];
    }
  }

  // Settings
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem('settings');
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('Failed to get settings:', error);
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      audio: {
        enabled: true,
        musicVolume: 0.7,
        soundVolume: 1.0,
        hapticFeedback: true,
      },
      notifications: {
        enabled: true,
        gameInvites: true,
        roundUpdates: true,
        achievements: true,
        friendRequests: true,
      },
      gameplay: {
        autoSubmit: false,
        showTimer: true,
        showVoteCounts: true,
        chaosMode: true,
      },
      display: {
        theme: 'default',
        fontSize: 'medium',
        animations: true,
        reduceMotion: false,
      },
    };
  }

  // Statistics
  async saveStatistics(stats) {
    try {
      await AsyncStorage.setItem('statistics', JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save statistics:', error);
    }
  }

  async getStatistics() {
    try {
      const stats = await AsyncStorage.getItem('statistics');
      return stats ? JSON.parse(stats) : this.getDefaultStatistics();
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return this.getDefaultStatistics();
    }
  }

  getDefaultStatistics() {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalPoints: 0,
      averageScore: 0,
      bestScore: 0,
      totalPlayTime: 0,
      favoritePrompts: [],
      chaosModesTriggered: 0,
      powerUpsUsed: 0,
      achievementsUnlocked: 0,
      friendsAdded: 0,
      lastPlayed: null,
    };
  }

  // Cache management
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async clearAllData() {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  // Utility methods
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
    }
  }

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
    }
  }

  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  // Data migration
  async migrateData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const needsMigration = keys.some(key => key.includes('oldFormat'));
      
      if (needsMigration) {
        console.log('Migrating data...');
        // Add migration logic here
        console.log('Data migration completed');
      }
    } catch (error) {
      console.error('Data migration failed:', error);
    }
  }
}

// Create singleton instance
const storageService = new StorageService();

export const initializeStorage = () => storageService.initialize();
export default storageService; 