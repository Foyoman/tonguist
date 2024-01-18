import React, {useState, useContext, useCallback} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';

import {ThemeContext} from '../../context/ThemeContext';

import {Flashcard, RootStackParamList} from '../../types';
import {fetchDictionary} from '../../services/dictionaryService';

import {useDictionary} from '../../hooks/useDictionary';
import {Button} from '../../components/elements';

type DictionaryPageProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Dictionary'>;
};

const DictionaryPage: React.FC<DictionaryPageProps> = ({navigation}) => {
  const {themeStyles} = useContext(ThemeContext);
  const {selectedDictionary} = useDictionary(); // Using custom hook
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const loadFlashcards = useCallback(async () => {
    if (selectedDictionary) {
      const dictionary = await fetchDictionary(selectedDictionary);
      if (dictionary) {
        console.log(dictionary);
        setFlashcards(dictionary);
      }
    }
  }, [selectedDictionary]);

  useFocusEffect(
    useCallback(() => {
      loadFlashcards();
    }, [loadFlashcards]),
  );

  const handlePressFlashcard = (flashcard: Flashcard) => {
    navigation.navigate('Details', {flashcard});
  };

  const handleCreateCard = () => {
    navigation.navigate('Edit', {});
  };

  return (
    <View style={styles.container}>
      {!flashcards.length ? (
        <View style={styles.innerContainer}>
          <Text style={[themeStyles.textSecondary, styles.noCards]}>
            Create a flashcard to begin
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.innerContainer}
          data={flashcards}
          keyExtractor={(item, index) => `flashcard-${index}`}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handlePressFlashcard(item)}>
              <View style={[themeStyles.backgroundPrimary, styles.listItem]}>
                <Text style={[themeStyles.textPrimary, styles.heading]}>
                  {item.targetPhrase}
                </Text>
                <Text style={[themeStyles.textSecondary, styles.subheading]}>
                  {item.translatedPhrase}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={[themeStyles.backgroundPrimary, styles.tools]}>
        <Button title="Create flashcard" fullWidth onPress={handleCreateCard} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  innerContainer: {
    padding: 16,
  },
  noCards: {
    textAlign: 'center',
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    // backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  heading: {
    fontSize: 16,
  },
  subheading: {
    fontSize: 14,
  },
  tools: {
    padding: 16,
  },
  // ... other styles
});

export default DictionaryPage;
