// hooks/useProgress.js
import {useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Progress} from '../types';

export const useProgress = () => {
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchProgressData = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem('progressData');
      const todaysDate = getTodayDateString();
      let progressData = storedData ? JSON.parse(storedData) : [];

      let todaysProgress = progressData.find(
        (p: Progress) => p.date === todaysDate,
      );
      if (!todaysProgress) {
        todaysProgress = {
          date: todaysDate,
          cardsCompleted: 0,
          correctAttempts: 0,
        };
        progressData.push(todaysProgress);
        await AsyncStorage.setItem(
          'progressData',
          JSON.stringify(progressData),
        );
      }

      return todaysProgress;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return null;
    }
  }, []);

  const setProgressData = useCallback(async (updatedProgress: Progress) => {
    try {
      const storedData = await AsyncStorage.getItem('progressData');
      let progressData = storedData ? JSON.parse(storedData) : [];
      const todaysDate = getTodayDateString();

      const progressIndex = progressData.findIndex(
        (p: Progress) => p.date === todaysDate,
      );
      if (progressIndex !== -1) {
        progressData[progressIndex] = updatedProgress;
      } else {
        progressData.push(updatedProgress);
      }

      await AsyncStorage.setItem('progressData', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error setting progress:', error);
    }
  }, []);

  return {fetchProgressData, setProgressData};
};
