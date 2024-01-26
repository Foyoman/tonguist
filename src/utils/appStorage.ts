import AsyncStorage from '@react-native-async-storage/async-storage';
import {Flashcard} from '../types';

export const addDictionary = async (name: string): Promise<void> => {
  try {
    const storedNamesString = await AsyncStorage.getItem('dictionaryNames');
    const existingNames = storedNamesString
      ? JSON.parse(storedNamesString)
      : [];

    if (existingNames.includes(name)) {
      console.error('Dictionary name already exists');
    } else {
      const updatedNames = [...existingNames, name];
      await AsyncStorage.setItem(
        'dictionaryNames',
        JSON.stringify(updatedNames),
      );
      await AsyncStorage.setItem(name, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error saving dictionary name:', error);
  }
};

export const saveDictionary = async (
  dictionaryName: string,
  flashcards: Flashcard[],
) => {
  try {
    flashcards.sort((a, b) =>
      a.translatedPhrase.localeCompare(b.translatedPhrase),
    );
    await AsyncStorage.setItem(dictionaryName, JSON.stringify(flashcards));
  } catch (error) {
    console.error('Error saving dictionary:', error);
  }
};

export const setSelectedDictionary = async (name: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('selectedDictionary', name);
  } catch (error) {
    console.error('Error setting selected dictionary:', error);
  }
};

export const getSelectedDictionary = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('selectedDictionary');
  } catch (error) {
    console.error('Error fetching selected dictionary:', error);
    return null;
  }
};

export const removeDictionary = async (name: string): Promise<void> => {
  try {
    const storedNamesString = await AsyncStorage.getItem('dictionaryNames');
    const existingNames = storedNamesString
      ? JSON.parse(storedNamesString)
      : [];
    const updatedNames = existingNames.filter((n: string) => n !== name);
    await AsyncStorage.setItem('dictionaryNames', JSON.stringify(updatedNames));
    await AsyncStorage.removeItem(name);
  } catch (error) {
    console.error('Error removing dictionary:', error);
  }
};

export const fetchGoal = async () => {
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
};

export const setGoal = async (goal: number) => {
  try {
    await AsyncStorage.setItem('goal', JSON.stringify(goal));
  } catch (error) {
    console.error('Error setting goal:', error);
  }
};
