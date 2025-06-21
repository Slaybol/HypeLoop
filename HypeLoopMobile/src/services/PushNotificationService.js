import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

class PushNotificationService {
  constructor() {
    this.isInitialized = false;
    this.channelId = 'hypeloop-channel';
    this.channelName = 'HypeLoop Notifications';
    this.channelDescription = 'Game notifications for HypeLoop';
  }

  async initialize() {
    try {
      this.configurePushNotifications();
      this.createNotificationChannel();
      this.isInitialized = true;
      console.log('PushNotificationService initialized successfully');
    } catch (error) {
      console.error('PushNotificationService initialization failed:', error);
    }
  }

  configurePushNotifications() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        
        // Process the notification
        this.processNotification(notification);
        
        // Required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotification.FetchResult.NoData);
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - false: it will not be called (iOS) and the notification will not be shown (Android)
       * - true: it will be called (iOS) and the notification will be shown (Android)
       */
      requestPermissions: Platform.OS === 'ios',
    });

    // Must be outside the configure function
    PushNotification.createChannel(
      {
        channelId: this.channelId,
        channelName: this.channelName,
        channelDescription: this.channelDescription,
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }

  createNotificationChannel() {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: this.channelId,
          channelName: this.channelName,
          channelDescription: this.channelDescription,
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }
  }

  processNotification(notification) {
    const {data, message, title} = notification;
    
    // Handle different notification types
    switch (data?.type) {
      case 'game_invite':
        this.handleGameInvite(data);
        break;
      case 'round_update':
        this.handleRoundUpdate(data);
        break;
      case 'achievement':
        this.handleAchievement(data);
        break;
      case 'friend_request':
        this.handleFriendRequest(data);
        break;
      default:
        console.log('Unknown notification type:', data?.type);
    }
  }

  handleGameInvite(data) {
    // Navigate to game or show invite dialog
    console.log('Game invite received:', data);
  }

  handleRoundUpdate(data) {
    // Update game state or show round info
    console.log('Round update received:', data);
  }

  handleAchievement(data) {
    // Show achievement notification
    console.log('Achievement unlocked:', data);
  }

  handleFriendRequest(data) {
    // Show friend request dialog
    console.log('Friend request received:', data);
  }

  // Local notifications
  showLocalNotification(title, message, data = {}) {
    if (!this.isInitialized) return;

    PushNotification.localNotification({
      channelId: this.channelId,
      title: title,
      message: message,
      data: data,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: message,
      subText: 'HypeLoop',
      color: '#667eea',
      number: 10,
    });
  }

  // Game-specific notifications
  showGameInvite(fromUser, roomId) {
    this.showLocalNotification(
      'Game Invite',
      `${fromUser} invited you to play HypeLoop!`,
      {
        type: 'game_invite',
        fromUser,
        roomId,
      }
    );
  }

  showRoundStart(roomId, roundNumber) {
    this.showLocalNotification(
      'Round Started',
      `Round ${roundNumber} has begun!`,
      {
        type: 'round_update',
        roomId,
        roundNumber,
      }
    );
  }

  showVotingTime(roomId) {
    this.showLocalNotification(
      'Voting Time!',
      'Time to vote for the best answer!',
      {
        type: 'round_update',
        roomId,
        action: 'voting',
      }
    );
  }

  showRoundEnd(roomId, winner) {
    this.showLocalNotification(
      'Round Complete!',
      `${winner} won the round!`,
      {
        type: 'round_update',
        roomId,
        winner,
      }
    );
  }

  showAchievement(achievementName, points) {
    this.showLocalNotification(
      'Achievement Unlocked!',
      `${achievementName} (+${points} points)`,
      {
        type: 'achievement',
        name: achievementName,
        points,
      }
    );
  }

  showFriendRequest(fromUser) {
    this.showLocalNotification(
      'Friend Request',
      `${fromUser} wants to be your friend!`,
      {
        type: 'friend_request',
        fromUser,
      }
    );
  }

  showChaosMode(roomId, chaosType) {
    this.showLocalNotification(
      'Chaos Mode!',
      `${chaosType} has been triggered!`,
      {
        type: 'round_update',
        roomId,
        chaosType,
      }
    );
  }

  showGameEnd(roomId, winner) {
    this.showLocalNotification(
      'Game Over!',
      `${winner} won the game!`,
      {
        type: 'game_end',
        roomId,
        winner,
      }
    );
  }

  // Scheduled notifications
  scheduleNotification(title, message, date, data = {}) {
    if (!this.isInitialized) return;

    PushNotification.localNotificationSchedule({
      channelId: this.channelId,
      title: title,
      message: message,
      date: date,
      data: data,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: message,
      subText: 'HypeLoop',
      color: '#667eea',
    });
  }

  // Reminder notifications
  scheduleGameReminder(roomId, reminderTime) {
    this.scheduleNotification(
      'Game Reminder',
      'Your HypeLoop game is starting soon!',
      reminderTime,
      {
        type: 'game_reminder',
        roomId,
      }
    );
  }

  scheduleDailyReminder() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0); // 8 PM

    this.scheduleNotification(
      'Daily HypeLoop',
      'Ready for some fun? Play HypeLoop today!',
      tomorrow,
      {
        type: 'daily_reminder',
      }
    );
  }

  // Cancel notifications
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  cancelNotification(notificationId) {
    PushNotification.cancelLocalNotification(notificationId);
  }

  // Get scheduled notifications
  getScheduledNotifications() {
    return new Promise((resolve, reject) => {
      PushNotification.getScheduledLocalNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  // Get delivered notifications
  getDeliveredNotifications() {
    return new Promise((resolve, reject) => {
      PushNotification.getDeliveredNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  // Remove delivered notifications
  removeDeliveredNotifications(identifiers) {
    PushNotification.removeDeliveredNotifications(identifiers);
  }

  // Request permissions
  requestPermissions() {
    return new Promise((resolve, reject) => {
      PushNotification.requestPermissions().then((permissions) => {
        resolve(permissions);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  // Check permissions
  checkPermissions() {
    return new Promise((resolve, reject) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  }

  // Abandon permissions
  abandonPermissions() {
    PushNotification.abandonPermissions();
  }

  // Get initial notification
  getInitialNotification() {
    return new Promise((resolve, reject) => {
      PushNotification.getInitialNotification((notification) => {
        resolve(notification);
      });
    });
  }

  // Get badge count (iOS)
  getBadgeCount() {
    return new Promise((resolve, reject) => {
      PushNotification.getApplicationIconBadgeNumber((number) => {
        resolve(number);
      });
    });
  }

  // Set badge count (iOS)
  setBadgeCount(count) {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  // Clear badge count (iOS)
  clearBadgeCount() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export const initializePushNotifications = () => pushNotificationService.initialize();
export default pushNotificationService;
