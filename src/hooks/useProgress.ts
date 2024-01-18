// hooks/useProgress.js
import {useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Progress} from '../types';
import {useDictionary} from './useDictionary';

export const useProgress = () => {
  const {selectedDictionary} = useDictionary();

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
        (p: Progress) =>
          p.date === todaysDate && p.dictionary === selectedDictionary,
      );

      if (selectedDictionary && !todaysProgress) {
        todaysProgress = {
          dictionary: selectedDictionary,
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
  }, [selectedDictionary]);

  const setProgressData = useCallback(
    async (updatedProgress: Progress) => {
      try {
        const storedData = await AsyncStorage.getItem('progressData');
        let progressData = storedData ? JSON.parse(storedData) : [];
        const todaysDate = getTodayDateString();

        const progressIndex = progressData.findIndex(
          (p: Progress) =>
            p.date === todaysDate && p.dictionary === selectedDictionary,
        );

        if (progressIndex !== -1) {
          progressData[progressIndex] = updatedProgress;
        } else {
          progressData.push(updatedProgress);
        }

        await AsyncStorage.setItem(
          'progressData',
          JSON.stringify(progressData),
        );
      } catch (error) {
        console.error('Error setting progress:', error);
      }
    },
    [selectedDictionary],
  );

  const fetchGoal = useCallback(async () => {
    try {
      const storedGoal = await AsyncStorage.getItem('goal');
      if (!storedGoal) {
        const defaultGoal = 50;
        await AsyncStorage.setItem('goal', JSON.stringify(defaultGoal));
        return defaultGoal;
      } else {
        return JSON.parse(storedGoal);
      }
    } catch (error) {
      console.error('Error fetching goal:', error);
    }
  }, []);

  const setGoal = useCallback(async (goal: number) => {
    try {
      await AsyncStorage.setItem('goal', JSON.stringify(goal));
    } catch (error) {
      console.error('Error setting goal:', error);
    }
  }, []);

  return {fetchProgressData, setProgressData, fetchGoal, setGoal};
};
