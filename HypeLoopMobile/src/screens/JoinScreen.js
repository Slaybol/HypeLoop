import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import HapticFeedback from 'react-native-haptic-feedback';
import audioService from '../services/AudioService';

const JoinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isCreateMode = route.params?.mode === 'create';

  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [recentRooms, setRecentRooms] = useState([]);

  useEffect(() => {
    loadRecentRooms();
    loadUsername();
  }, []);

  const loadRecentRooms = async () => {
    // Load recent rooms from storage
    // For now, using mock data
    setRecentRooms([
      {code: 'ABC123', name: 'Friday Night Fun', players: 4},
      {code: 'XYZ789', name: 'Party Time', players: 6},
      {code: 'DEF456', name: 'Game Night', players: 3},
    ]);
  };

  const loadUsername = async () => {
    // Load saved username from storage
    // For now, using mock data
    setUsername('Player');
  };

  const handleJoinGame = async () => {
    if (!roomCode.trim() || !username.trim()) {
      Alert.alert('Error', 'Please enter both room code and username');
      return;
    }

    setIsConnecting(true);
    HapticFeedback.trigger('impactMedium');
    audioService.playButtonClick();

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to game screen
      navigation.replace('Game', {
        roomCode: roomCode.toUpperCase(),
        username: username.trim(),
        isHost: false,
      });
    } catch (error) {
      Alert.alert('Connection Failed', 'Unable to join the game. Please check the room code and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateGame = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setIsConnecting(true);
    HapticFeedback.trigger('impactMedium');
    audioService.playButtonClick();

    try {
      // Generate random room code
      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Simulate creation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to game screen as host
      navigation.replace('Game', {
        roomCode: newRoomCode,
        username: username.trim(),
        isHost: true,
      });
    } catch (error) {
      Alert.alert('Creation Failed', 'Unable to create a new game. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleQuickJoin = (room) => {
    setRoomCode(room.code);
    HapticFeedback.trigger('impactLight');
    audioService.playButtonClick();
  };

  const handleBack = () => {
    HapticFeedback.trigger('impactLight');
    audioService.playButtonClick();
    navigation.goBack();
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    HapticFeedback.trigger('impactLight');
    audioService.playButtonClick();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={styles.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>
                {isCreateMode ? 'Create Game' : 'Join Game'}
              </Text>
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                maxLength={20}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Room Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Room Code</Text>
              <View style={styles.roomCodeContainer}>
                <TextInput
                  style={[styles.input, styles.roomCodeInput]}
                  value={roomCode}
                  onChangeText={(text) => setRoomCode(text.toUpperCase())}
                  placeholder="Enter room code"
                  placeholderTextColor="#999"
                  maxLength={6}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={generateRoomCode}
                  activeOpacity={0.7}>
                  <Icon name="refresh" size={20} color="#667eea" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.actionButton, isConnecting && styles.disabledButton]}
              onPress={isCreateMode ? handleCreateGame : handleJoinGame}
              disabled={isConnecting}
              activeOpacity={0.8}>
              <LinearGradient
                colors={isCreateMode ? ['#4CAF50', '#45a049'] : ['#2196F3', '#1976D2']}
                style={styles.buttonGradient}>
                {isConnecting ? (
                  <Text style={styles.buttonText}>Connecting...</Text>
                ) : (
                  <>
                    <Icon
                      name={isCreateMode ? 'add-circle' : 'group'}
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.buttonText}>
                      {isCreateMode ? 'Create Game' : 'Join Game'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Recent Rooms */}
            {!isCreateMode && recentRooms.length > 0 && (
              <View style={styles.recentContainer}>
                <Text style={styles.recentTitle}>Recent Rooms</Text>
                {recentRooms.map((room, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentRoom}
                    onPress={() => handleQuickJoin(room)}
                    activeOpacity={0.7}>
                    <View style={styles.recentRoomInfo}>
                      <Text style={styles.recentRoomName}>{room.name}</Text>
                      <Text style={styles.recentRoomCode}>{room.code}</Text>
                    </View>
                    <View style={styles.recentRoomStats}>
                      <Icon name="group" size={16} color="#fff" />
                      <Text style={styles.recentRoomPlayers}>{room.players}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Tips</Text>
              <Text style={styles.tipText}>
                • Room codes are 6 characters long
              </Text>
              <Text style={styles.tipText}>
                • Share the room code with friends to play together
              </Text>
              <Text style={styles.tipText}>
                • You can play offline without internet
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  roomCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomCodeInput: {
    flex: 1,
    marginRight: 10,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  recentContainer: {
    marginBottom: 30,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  recentRoom: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentRoomInfo: {
    flex: 1,
  },
  recentRoomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  recentRoomCode: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  recentRoomStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentRoomPlayers: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
});

export default JoinScreen;
