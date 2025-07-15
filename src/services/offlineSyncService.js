import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';

// Save data locally
export const saveLocalData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save locally:', e);
  }
};

// Load data locally (always works offline)
export const loadLocalData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Failed to load locally:', e);
    return null;
  }
};

// Sync local data to Firebase if online
export const syncDataToFirebase = async (key, collection) => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;
  const localData = await loadLocalData(key);
  if (localData) {
    try {
      await firestore().collection(collection).add(localData);
      await AsyncStorage.removeItem(key); // Clear after sync
    } catch (e) {
      console.error('Sync to Firebase failed:', e);
    }
  }
};

// Listen for connectivity and auto-sync
export const setupAutoSync = (key, collection) => {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncDataToFirebase(key, collection);
    }
  });
};

// Usage example in your app:
// 1. Save data locally when offline or before sending to Firebase
//    await saveLocalData('myKey', myData);
// 2. On app start, call setupAutoSync('myKey', 'myCollection');
// 3. Always read from local storage for offline access:
//    const data = await loadLocalData('myKey');
