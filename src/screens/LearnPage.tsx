// native
import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useContext,
} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// context
import {ThemeContext} from '../context/ThemeContext';
import {AppContext} from '../context/AppContext';

// components
import Flashcard from '../components/Flashcard/Flashcard';
import {ActivityIndicator} from 'react-native-paper';
import {Button} from '../components/elements';

// utils
import {extractTargetPhrase} from '../utils/textUtils';

// types
import {
  FlashcardComponent,
  Flashcard as FlashcardType,
  Progress,
  LearnPageProps,
} from '../types';

// progress
import {useProgress} from '../hooks/useProgress';
import {ProgressBar} from '../components/Progress';

// dictionary
import {fetchDictionary} from '../services/dictionaryService';
import {useDictionary} from '../hooks/useDictionary';
import {saveDictionary} from '../utils/appStorage';

const LearnPage = ({navigation}: LearnPageProps) => {
  const {goal} = useContext(AppContext);
  const {themeStyles} = useContext(ThemeContext);
  const [errors, setErrors] = useState<unknown>();
  const [currentFlashcard, setCurrentFlashcard] =
    useState<FlashcardType | null>(null);
  const [inputValue, setInputValue] = useState(''); // Add this state for input value
  const [correct, setCorrect] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const {fetchTodaysProgress, setProgressData} = useProgress();
  const [todaysProgress, setTodaysProgress] = useState<Progress>();

  const {selectedDictionary} = useDictionary(); // Using custom hook

  const recentCardsRef = useRef<FlashcardType[]>([]);

  useEffect(() => {
    const initializeProgress = async () => {
      const progressData = await fetchTodaysProgress();
      if (progressData) {
        setTodaysProgress(progressData);
      } else {
        navigation.navigate('Home');
      }
    };

    initializeProgress();
  }, [fetchTodaysProgress, navigation]);

  const selectCard = useCallback(async () => {
    if (!selectedDictionary) {
      navigation.navigate('Dictionaries');
      return;
    }

    try {
      let dictionary = await fetchDictionary(selectedDictionary);

      if (!dictionary || !dictionary.length) {
        setErrors('No flashcards found');
        return;
      }

      const recentCardsIds = new Set(
        recentCardsRef.current.map(card => card.id),
      );

      // remove recently shown cards from the dictionary
      const filteredDictionary = dictionary.filter(
        (card: FlashcardType) => !recentCardsIds.has(card.id),
      );

      // select a random card from either the filtered or full dictionary
      const randomIndex = Math.floor(Math.random() * filteredDictionary.length);
      const selectedCard = filteredDictionary[randomIndex];
      setCurrentFlashcard(selectedCard);
      setProgress(selectedCard.progress ?? 0);

      // filters recently selected cards
      const updatedRecentCards: FlashcardType[] = [
        ...recentCardsRef.current,
        selectedCard,
      ];
      if (updatedRecentCards.length >= dictionary.length) {
        // updatedRecentCards.shift(); // Remove the oldest flashcard
        recentCardsRef.current = [selectedCard];
      } else {
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
    if (correct) {
      return;
    }

    const input = inputValue.trim().toLowerCase();
    if (currentFlashcard) {
      const ogTargetPhrase = extractTargetPhrase(
        currentFlashcard?.targetSentence,
        currentFlashcard?.targetPhrase,
      );
      setInputValue(ogTargetPhrase);
    } else {
      setInputValue(input);
    }

    if (input === currentFlashcard?.targetPhrase.toLowerCase()) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  };

  const handleCorrect = async () => {
    setCorrect(true);

    const updatedCardsCompleted = todaysProgress?.cardsCompleted
      ? todaysProgress.cardsCompleted + 1
      : 1;

    let updatedCorrectAttempts = todaysProgress?.correctAttempts;
    if (!incorrect) {
      updatedCorrectAttempts = todaysProgress?.correctAttempts
        ? todaysProgress.correctAttempts + 1
        : 1;
    }
    await setProgressData({
      ...todaysProgress,
      cardsCompleted: updatedCardsCompleted,
      correctAttempts: updatedCorrectAttempts,
    } as Progress);

    const progressData = await fetchTodaysProgress();
    if (progressData) {
      setTodaysProgress(progressData);
    } else {
      navigation.navigate('Home');
    }

    const updatedProgress = progress + 1;
    setProgress(updatedProgress);

    if (currentFlashcard) {
      try {
        if (!selectedDictionary) {
          navigation.navigate('Home');
          return;
        }

        let dictionary = await fetchDictionary(selectedDictionary);

        if (dictionary) {
          if (!dictionary.length) {
            setErrors('No flashcards found');
            return;
          }

          // Find the flashcard and update its progress
          const updatedDictionary = dictionary.map((card: FlashcardType) => {
            if (card.id === currentFlashcard.id) {
              return {...card, progress: updatedProgress};
            } else {
              return card;
            }
          });

          saveDictionary(selectedDictionary, updatedDictionary);
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
          goal={goal}
        />
      ),
    [todaysProgress, goal],
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
