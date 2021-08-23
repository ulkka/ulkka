import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('error getting value from async storage for key', key, e);
  }
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.error('error saving key-value in async storage', key, value, e);
  }
};
