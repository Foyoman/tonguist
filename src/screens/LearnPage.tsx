import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useContext,
} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ActivityIndicator} from 'react-native-paper';

import {
  FlashcardComponent,
  Flashcard as FlashcardType,
  Progress,
  LearnPageProps,
} from '../types';
import Flashcard from '../components/Flashcard/Flashcard';

import {useProgress} from '../hooks/useProgress';
import {ProgressBar, Button} from '../components/elements';

import {fetchDictionary} from '../services/dictionaryService';
import {useDictionary} from '../hooks/useDictionary';

const LearnPage = ({navigation}: LearnPageProps) => {
  const {themeStyles} = useContext(ThemeContext);
  const [errors, setErrors] = useState<unknown>();
  const [currentFlashcard, setCurrentFlashcard] =
    useState<FlashcardType | null>(null);
  const [inputValue, setInputValue] = useState(''); // Add this state for input value
  const [correct, setCorrect] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const {fetchProgressData, setProgressData} = useProgress();
  const [todaysProgress, setTodaysProgress] = useState<Progress>();

  const {selectedDictionary} = useDictionary(); // Using custom hook

  const recentCardsRef = useRef<FlashcardType[]>([]);

  useEffect(() => {
    const initializeProgress = async () => {
      const progressData = await fetchProgressData();
      setTodaysProgress(progressData);
    };

    initializeProgress();
  }, [fetchProgressData]);

  const selectCard = useCallback(async () => {
    if (!selectedDictionary) {
      navigation.navigate('Dictionaries');
      return;
    }

    try {
      let dictionary = await fetchDictionary(selectedDictionary);

      if (dictionary) {
        const recentCards = recentCardsRef.current;
        const recentCardsIds = recentCardsRef.current.map(card => card.id);

        dictionary = dictionary.filter(
          (card: FlashcardType) => !recentCardsIds.includes(card.id as never),
        );

        if (!dictionary.length) {
          setErrors('No flashcards found');
          return false;
        }

        const randomIndex = Math.floor(Math.random() * dictionary.length);
        const randomCard = dictionary[randomIndex];
        setCurrentFlashcard(randomCard);
        setProgress(randomCard.progress!);

        // filters recently selected cards
        const updatedRecentCards: FlashcardType[] = [
          ...recentCards,
          randomCard,
        ];
        const halfDeck = Math.round(dictionary.length / 2);
        if (updatedRecentCards.length > halfDeck) {
          updatedRecentCards.shift(); // Remove the oldest flashcard
        }
        recentCardsRef.current = updatedRecentCards;
      }
    } catch (error) {
      console.error('Failed to load dictionary:', error);
      setErrors(error);
    }
  }, [navigation, selectedDictionary]);

  useEffect(() => {
    selectCard();
  }, [selectCard]);

  const handleSubmit: FlashcardComponent['handleSubmit'] = () => {
    const input = inputValue.trim().toLowerCase();
    setInputValue(input);

    if (input === currentFlashcard?.targetPhrase.toLowerCase()) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  };

  const handleCorrect = async () => {
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
        let dictionary = await fetchDictionary('dictionary');

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
    setInputValue('');
    setIncorrect(true);
    setProgress(0);
  };

  const headerRight = useCallback(
    () =>
      todaysProgress && (
        <ProgressBar
          style={styles.progressBar}
          progress={todaysProgress.cardsCompleted}
          goal={50}
        />
      ),
    [todaysProgress],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight,
      headerLeftContainerStyle: {
        width: 0,
      },
    });
  }, [navigation, headerRight]);

  if (errors || !currentFlashcard) {
    return (
      <View style={styles.loaderContainer}>
        {errors ? (
          <Text
            style={[
              themeStyles.textSecondary,
              styles.error,
            ]}>{`${errors}`}</Text>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Flashcard
          flashcard={{...currentFlashcard, progress}}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          correct={correct}
          incorrect={incorrect}
        />
      </View>
      <View style={[themeStyles.backgroundPrimary, styles.toolbar]}>
        <Button
          title="Enter"
          onPress={handleSubmit}
          style={styles.enterButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardContainer: {
    padding: 16,
  },
  progressBar: {
    height: '100%',
    paddingHorizontal: 16,
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
  toolbar: {
    // height: 34,
    paddingVertical: 6,
    paddingHorizontal: 8,
    height: 'auto',
    display: 'flex',
    // alignItems: 'flex-end',
    // width: '100%',
  },
  enterButton: {
    alignSelf: 'flex-end',
    // width: '100%',
  },
});

export default LearnPage;
