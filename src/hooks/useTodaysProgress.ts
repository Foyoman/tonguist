// hooks/useTodaysProgress.js
import {useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTodaysProgress = () => {
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const setTodaysProgressStorage = useCallback(async (progress: number) => {
    try {
      const todaysDate = getTodayDateString();
      const data = JSON.stringify({date: todaysDate, progress});
      await AsyncStorage.setItem('todaysProgress', data);
    } catch (error) {
      console.error("Error setting today's progress:", error);
    }
  }, []);

  const fetchTodaysProgress = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem('todaysProgress');
      const todaysDate = getTodayDateString();

      if (storedData) {
        const {date, progress} = JSON.parse(storedData);
        if (date === todaysDate) {
          return progress;
        }
      }

      await setTodaysProgressStorage(0);
      return 0;
    } catch (error) {
      console.error("Error fetching today's progress:", error);
      return 0;
    }
  }, [setTodaysProgressStorage]);

  return {fetchTodaysProgress, setTodaysProgressStorage};
};
