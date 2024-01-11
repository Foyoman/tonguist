import AsyncStorage from '@react-native-async-storage/async-storage';
import {Flashcard} from '../types';

export const fetchDictionary = async () => {
  try {
    const storedDictionary = await AsyncStorage.getItem('dictionary');
    const dictionary: Flashcard[] = storedDictionary
      ? JSON.parse(storedDictionary)
      : [];
    return dictionary;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
  }
};
