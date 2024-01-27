// hooks/useProgress.js
import {useCallback, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Progress} from '../types';
import {useDictionary} from './useDictionary';
import {AppContext} from '../context/AppContext';

export const useProgress = () => {
  const {selectedDictionary} = useDictionary();
  const {fetchGoal} = useContext(AppContext);

  const getTodayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-CA'); // 'en-CA' uses the YYYY-MM-DD format
  };

  const fetchProgressData = useCallback(async () => {
    try {
      if (!selectedDictionary) {
        return [];
      }

      const progressKey = `${selectedDictionary}-progress`;
      const storedData = await AsyncStorage.getItem(progressKey);
      let progressData: Progress[] = storedData ? JSON.parse(storedData) : [];

      if (!Array.isArray(progressData)) {
        console.warn(
          'Expected progressData to be an array, received:',
          progressData,
        );
        progressData = []; // Reset to empty array if the structure is incorrect
      }

      return progressData;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return [];
    }
  }, [selectedDictionary]);

  const fetchTodaysProgress = useCallback(async () => {
    try {
      if (!selectedDictionary) {
        return null;
      }

      const progressKey = `${selectedDictionary}-progress`;
      const storedData = await AsyncStorage.getItem(progressKey);
      const todaysDate = getTodayDateString();
      let progressData: Progress[] = storedData ? JSON.parse(storedData) : [];

      if (!Array.isArray(progressData)) {
        console.warn(
          'Expected progressData to be an array, received:',
          progressData,
        );
        progressData = []; // Reset to empty array if the structure is incorrect
      }

      const todaysProgress = progressData.find(p => p.date === todaysDate);
      if (!todaysProgress) {
        // If today's progress isn't found, initialize it
        const newTodaysProgress = {
          date: todaysDate,
          cardsCompleted: 0,
          correctAttempts: 0,
        };
        progressData.push(newTodaysProgress);
        await AsyncStorage.setItem(progressKey, JSON.stringify(progressData));
        return newTodaysProgress;
      }

      return todaysProgress;
    } catch (error) {
      console.error("Error fetching today's progress:", error);
      return null;
    }
  }, [selectedDictionary]);

  const setProgressData = async (updatedProgress: Progress) => {
    try {
      const progressKey = `${selectedDictionary}-progress`;
      const storedData = await AsyncStorage.getItem(progressKey);
      let progressData: Progress[] = storedData ? JSON.parse(storedData) : [];

      if (!Array.isArray(progressData)) {
        progressData = []; // Reset to empty array if the structure is incorrect
      }

      // Find the index of the progress entry for the updated date
      const index = progressData.findIndex(
        p => p.date === updatedProgress.date,
      );

      if (index !== -1) {
        // Update the existing entry
        progressData[index] = updatedProgress;
      } else {
        // Add a new entry
        progressData.push(updatedProgress);
      }

      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem(progressKey, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error setting progress:', error);
    }
  };

  const fetchWeeklyProgressData = useCallback(async () => {
    try {
      if (!selectedDictionary) {
        return [];
      }

      const progressKey = `${selectedDictionary}-progress`;
      const storedData = await AsyncStorage.getItem(progressKey);
      let progressData: Progress[] = storedData ? JSON.parse(storedData) : [];

      // Get dates for the past 7 days
      const dates = [...Array(7)]
        .map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString('en-CA');
        })
        .reverse();

      // Get progress for each of the past 7 days
      const weeklyProgress = dates.map(date => {
        const dailyProgress = progressData.find(p => p.date === date);
        return (
          dailyProgress || {
            date: date,
            cardsCompleted: 0,
            correctAttempts: 0,
          }
        ); // Default to no progress if not found
      });

      return weeklyProgress;
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
      return [];
    }
  }, [selectedDictionary]);

  const fetchMonthlyProgressData = useCallback(
    async (year: number, month: number) => {
      try {
        const progressKey = `${selectedDictionary}-progress`;
        const storedData = await AsyncStorage.getItem(progressKey);
        let progressData: Progress[] = storedData ? JSON.parse(storedData) : [];

        if (!selectedDictionary || !progressData.length) {
          return [];
        }

        // Filter progress data for the given month and year
        if (progressData.length) {
        }
        const monthlyProgress = progressData.filter(p => {
          const date = new Date(p.date);
          return date.getFullYear() === year && date.getMonth() === month;
        });

        return monthlyProgress;
      } catch (error) {
        console.error('Error fetching monthly progress:', error);
        return [];
      }
    },
    [selectedDictionary],
  );

  const calculateStreak = useCallback(async () => {
    try {
      if (!selectedDictionary) {
        return 0;
      }

      const progressKey = `${selectedDictionary}-progress`;
      const storedData = await AsyncStorage.getItem(progressKey);
      let progressData: Progress[] = storedData ? JSON.parse(storedData) : [];

      // Get user's goal
      const goal = await fetchGoal();

      if (!goal) {
        return 0;
      }

      // Sort progressData by date in ascending order
      progressData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      const today = new Date();
      let streak = 0;
      let checkDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ); // Today with time set to 00:00:00

      // Check today's progress if it exists and meets the goal
      const todaysProgress = progressData.find(
        p => p.date === checkDate.toISOString().split('T')[0],
      );
      if (todaysProgress && todaysProgress.cardsCompleted >= goal) {
        streak++;
      }

      // Check the previous days
      checkDate.setDate(checkDate.getDate() - 1); // Move to the day before

      while (true) {
        const progress = progressData.find(
          p => p.date === checkDate.toISOString().split('T')[0],
        );
        if (progress && progress.cardsCompleted >= goal) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1); // Move to the previous day
        } else {
          break; // Streak ends if a day's goal is not met or no progress is recorded
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }, [fetchGoal, selectedDictionary]);

  return {
    getTodayDateString,
    fetchProgressData,
    fetchTodaysProgress,
    setProgressData,
    fetchWeeklyProgressData,
    fetchMonthlyProgressData,
    calculateStreak,
  };
};
