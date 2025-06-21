import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Vibration,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Share from 'react-native-share';
import DeviceInfo from 'react-native-device-info';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    getDeviceInfo();
  }, []);

  const getDeviceInfo = async () => {
    try {
      const info = {
        brand: await DeviceInfo.getBrand(),
        model: await DeviceInfo.getModel(),
        systemVersion: await DeviceInfo.getSystemVersion(),
        appVersion: await DeviceInfo.getVersion(),
      };
      setDeviceInfo(info);
    } catch (error) {
      console.error('Failed to get device info:', error);
    }
  };

  const handleJoinGame = () => {
    Vibration.vibrate(50);
    navigation.navigate('Join');
  };

  const handleCreateGame = () => {
    Vibration.vibrate(50);
    // For now, navigate to join screen with create option
    navigation.navigate('Join', {mode: 'create'});
  };

  const handleSettings = () => {
    Vibration.vibrate(50);
    navigation.navigate('Settings');
  };

  const handleShare = async () => {
    try {
      Vibration.vibrate(50);
      const shareOptions = {
        title: 'HypeLoop - The Ultimate Party Game!',
        message: 'Join me in HypeLoop - the most hilarious party game ever! Download now and let\'s play together! 🎮🎉',
        url: 'https://hypeloop.game', // Replace with actual app store links
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleOfflineMode = () => {
    Vibration.vibrate(50);
    Alert.alert(
      'Offline Mode',
      'Play HypeLoop without internet! Perfect for parties, travel, or when you\'re offline.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Play Offline', onPress: () => navigation.navigate('Game', {mode: 'offline'})},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>HypeLoop</Text>
          <Text style={styles.subtitle}>The Ultimate Party Game</Text>
        </View>

        {/* Main Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleJoinGame}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.buttonGradient}>
              <Icon name="group" size={32} color="#fff" />
              <Text style={styles.buttonText}>Join Game</Text>
              <Text style={styles.buttonSubtext}>Play with friends online</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleCreateGame}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.buttonGradient}>
              <Icon name="add-circle" size={32} color="#fff" />
              <Text style={styles.buttonText}>Create Game</Text>
              <Text style={styles.buttonSubtext}>Host a new game room</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleOfflineMode}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF9800', '#F57C00']}
              style={styles.buttonGradient}>
              <Icon name="wifi-off" size={32} color="#fff" />
              <Text style={styles.buttonText}>Offline Mode</Text>
              <Text style={styles.buttonSubtext}>Play without internet</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}>
            <Icon name="share" size={24} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSettings}
            activeOpacity={0.7}>
            <Icon name="settings" size={24} color="#fff" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>
            v{deviceInfo.appVersion || '1.0.0'}
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  menuButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  versionText: {
    color: '#fff',
    opacity: 0.6,
    fontSize: 12,
  },
});

export default HomeScreen; 