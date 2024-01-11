import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';

import {ThemeContext} from '../context/ThemeContext';

import {Flashcard} from '../types';

type DictionaryPageProps = {
  navigation: StackNavigationProp<any>;
};

const DictionaryPage: React.FC<DictionaryPageProps> = ({navigation}) => {
  const {themeStyles} = useContext(ThemeContext);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const loadFlashcards = async () => {
    try {
      const storedFlashcards = await AsyncStorage.getItem('dictionary');
      if (storedFlashcards) {
        setFlashcards(JSON.parse(storedFlashcards));
      }
    } catch (error) {
      console.error('Failed to load flashcards:', error);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFlashcards();
    }, []),
  );

  const handlePressFlashcard = (flashcard: Flashcard) => {
    navigation.navigate('Details', {flashcard});
  };

  return (
    <View style={styles.container}>
      <FlatList
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  // ... other styles
});

export default DictionaryPage;
