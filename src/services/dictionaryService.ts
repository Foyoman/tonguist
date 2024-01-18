import AsyncStorage from '@react-native-async-storage/async-storage';
import {Flashcard} from '../types';

export const fetchDictionary = async (dictionaryName: string) => {
  try {
    const storedDictionary = await AsyncStorage.getItem(dictionaryName);
    const dictionary: Flashcard[] = storedDictionary
      ? JSON.parse(storedDictionary)
      : [];
    return dictionary;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
  }
};

export const fetchDictionaryNames = async () => {
  try {
    const storedNamesString = await AsyncStorage.getItem('dictionaryNames');
    const dictionaryNames: string[] = storedNamesString
      ? JSON.parse(storedNamesString)
      : [];
    return dictionaryNames;
  } catch (error) {
    console.error('Failed to load dictionary names:', error);
  }
};
