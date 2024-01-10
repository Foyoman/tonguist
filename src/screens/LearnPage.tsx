import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Flashcard from '../components/Flashcard';
import {FlashcardComponent, Flashcard as FlashcardType} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';

const LearnPage = () => {
  const [currentFlashcard, setCurrentFlashcard] =
    useState<FlashcardType | null>(null);
  const [inputValue, setInputValue] = useState(''); // Add this state for input value
  const [correct, setCorrect] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const selectCard = useCallback(async () => {
    console.log('select card');

    try {
      const storedDictionary = await AsyncStorage.getItem('dictionary');
      const dictionary = storedDictionary ? JSON.parse(storedDictionary) : [];

      if (dictionary && dictionary.length > 0) {
        const randomIndex = Math.floor(Math.random() * dictionary.length);
        const randomCard = dictionary[randomIndex];
        setCurrentFlashcard(randomCard);
        setProgress(randomCard.progress!);
      }
    } catch (error) {
      console.error('Failed to load dicitonary:', error);
    }
  }, []);

  useEffect(() => {
    selectCard();
  }, [selectCard]);

  const handleSubmit: FlashcardComponent['handleSubmit'] = () => {
    const input = inputValue.trim().toLowerCase();
    console.log(input);
    setInputValue(input);

    if (input === currentFlashcard?.targetPhrase.toLowerCase()) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  };

  const handleCorrect = async () => {
    console.log('correct');
    setCorrect(true);

    // if correct on first attempt
    const updatedProgress = progress + 1;
    setProgress(updatedProgress);

    if (currentFlashcard) {
      try {
        // Fetch the current dictionary from AsyncStorage
        const storedDictionary = await AsyncStorage.getItem('dictionary');
        let updatedDictionary = storedDictionary
          ? JSON.parse(storedDictionary)
          : [];

        // Find the flashcard and update its progress
        updatedDictionary = updatedDictionary.map((card: FlashcardType) => {
          if (card.targetPhrase === currentFlashcard.targetPhrase) {
            return {...card, progress: updatedProgress};
          }
          return card;
        });

        // Save the updated dictionary back to AsyncStorage
        await AsyncStorage.setItem(
          'dictionary',
          JSON.stringify(updatedDictionary),
        );
      } catch (error) {
        console.error('Failed to update dictionary:', error);
      }
    }

    setTimeout(() => {
      setCorrect(false);
      setIncorrect(false);
      selectCard();
      setInputValue('');
    }, 2000);
  };

  const handleIncorrect = () => {
    console.log('incorrect');
    setInputValue('');
    setIncorrect(true);
    setProgress(0);
  };

  if (!currentFlashcard) {
    // Render a placeholder or loading indicator
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Flashcard
        flashcard={currentFlashcard}
        inputValue={inputValue} // Pass down the input value
        setInputValue={setInputValue} // Pass down the function to update the input value
        handleSubmit={handleSubmit}
        correct={correct}
        incorrect={incorrect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default LearnPage;
