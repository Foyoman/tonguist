import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ActivityIndicator} from 'react-native-paper';

import {
  FlashcardComponent,
  Flashcard as FlashcardType,
  Progress,
  LearnPageProps,
} from '../types';
import Flashcard from '../components/Flashcard';

import {useProgress} from '../hooks/useProgress';
import ProgressBar from '../components/ProgressBar';

import {fetchDictionary} from '../services/dictionaryService';

const LearnPage = ({navigation}: LearnPageProps) => {
  const [errors, setErrors] = useState<unknown>();
  const [currentFlashcard, setCurrentFlashcard] =
    useState<FlashcardType | null>(null);
  const [inputValue, setInputValue] = useState(''); // Add this state for input value
  const [correct, setCorrect] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const {fetchProgressData, setProgressData} = useProgress();
  const [todaysProgress, setTodaysProgress] = useState<Progress>();

  const recentCardsRef = useRef<FlashcardType[]>([]);

  useEffect(() => {
    const initializeProgress = async () => {
      const progressData = await fetchProgressData();
      setTodaysProgress(progressData);
    };

    initializeProgress();
  }, [fetchProgressData]);

  const selectCard = useCallback(async () => {
    try {
      let dictionary = await fetchDictionary();

      if (dictionary) {
        if (!dictionary.length) {
          setErrors('No flashcards found');
          return false;
        }

        const recentCards = recentCardsRef.current;
        const recentCardsIds = recentCardsRef.current.map(card => card.id);

        dictionary = dictionary.filter(
          (card: FlashcardType) => !recentCardsIds.includes(card.id as never),
        );

        const randomIndex = Math.floor(Math.random() * dictionary.length);
        const randomCard = dictionary[randomIndex];
        console.log(recentCardsRef.current);
        setCurrentFlashcard(randomCard);
        setProgress(randomCard.progress!);

        const updatedLastCards: FlashcardType[] = [...recentCards, randomCard];
        if (updatedLastCards.length > 1) {
          updatedLastCards.shift(); // Remove the oldest flashcard
        }
        recentCardsRef.current = updatedLastCards;
        console.log(recentCardsRef.current);
      }
    } catch (error) {
      console.error('Failed to load dictionary:', error);
      setErrors(error);
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

    await setProgressData({
      ...todaysProgress,
      cardsCompleted: todaysProgress?.cardsCompleted
        ? todaysProgress?.cardsCompleted + 1
        : 1,
    } as Progress);
    const progressData = await fetchProgressData();
    setTodaysProgress(progressData);

    // if correct on first attempt
    const updatedProgress = progress + 1;
    setProgress(updatedProgress);

    if (currentFlashcard) {
      try {
        // Fetch the current dictionary from AsyncStorage
        let dictionary = await fetchDictionary();

        if (dictionary) {
          if (!dictionary.length) {
            setErrors('No flashcards found');
            return false;
          }

          // Find the flashcard and update its progress
          dictionary = dictionary.map((card: FlashcardType) => {
            if (card.id === currentFlashcard.id) {
              return {...card, progress: updatedProgress};
            }
            return card;
          });

          // Save the updated dictionary back to AsyncStorage
          await AsyncStorage.setItem('dictionary', JSON.stringify(dictionary));
        }
      } catch (error) {
        console.error('Failed to update dictionary:', error);
        setErrors(error);
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

  const headerRight = useCallback(
    () =>
      todaysProgress && (
        <ProgressBar progress={todaysProgress.cardsCompleted} />
      ),
    [todaysProgress],
  );

  useLayoutEffect(() => {
    navigation.setOptions({title: '', headerRight});
  }, [navigation, headerRight]);

  if (errors || !currentFlashcard) {
    return (
      <View style={styles.loaderContainer}>
        {errors ? (
          <Text style={styles.error}>{`${errors}`}</Text>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{`${currentFlashcard}`}</Text>

      <Flashcard
        flashcard={{...currentFlashcard, progress}}
        inputValue={inputValue}
        setInputValue={setInputValue}
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
  error: {
    textAlign: 'center',
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingTop: 60,
  },
  progressContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 32,
  },
  progressBar: {
    borderRadius: 2,
    flexGrow: 1,
    height: 4,
    marginRight: 16,
  },
  progressBarProgress: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontWeight: '600',
  },
});

export default LearnPage;
