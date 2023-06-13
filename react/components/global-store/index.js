import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const getLocalData = async (key, callback = () => undefined) => {
  try {
    const dataStr = await AsyncStorage.getItem(key);
    if (dataStr) {
      console.info('info: dataStr', dataStr);
      const data = JSON.parse(dataStr);
      callback(data);
    } else {
      callback();
    }
  } catch (error) {
    ToastAndroid.show(error)
  }
};

const setLocalData = async (key, value, callback = () => undefined) => {
  try {
    const dataStr = JSON.stringify(value);
    await AsyncStorage.setItem(key, dataStr);
    callback();
  } catch (error) {
    ToastAndroid.show(error);
  }
};

export {
  getLocalData,
  setLocalData,
}
