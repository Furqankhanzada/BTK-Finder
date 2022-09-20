import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useLocalStorage() {
  const setItem = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getItem = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
      if (value !== null) {
        // value previously stored
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    setItem,
    getItem,
  };
}
