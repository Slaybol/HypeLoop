import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';

// Import screens
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import JoinScreen from './screens/JoinScreen';
import SettingsScreen from './screens/SettingsScreen';

// Import services
import {initializePushNotifications} from './services/PushNotificationService';
import {initializeAudio} from './services/AudioService';
import {initializeStorage} from './services/StorageService';

const Stack = createStackNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize services
      await initializeStorage();
      await initializeAudio();
      await initializePushNotifications();
      
      // Request permissions
      await requestPermissions();
      
      // Hide splash screen
      SplashScreen.hide();
      
      setIsReady(true);
    } catch (error) {
      console.error('App initialization failed:', error);
      Alert.alert('Error', 'Failed to initialize app. Please restart.');
    }
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.VIBRATE,
        ];

        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        const allGranted = Object.values(results).every(
          result => result === PermissionsAndroid.RESULTS.GRANTED
        );
        
        setHasPermissions(allGranted);
      } else {
        // iOS permissions are handled differently
        setHasPermissions(true);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setHasPermissions(false);
    }
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>HypeLoop</Text>
          <Text style={styles.loadingSubtext}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false, // Hide headers for full-screen experience
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
});

export default App; 