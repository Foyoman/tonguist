import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Flashcard from '../components/Flashcard';
import {TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types/pages';
import {StackNavigationProp} from '@react-navigation/stack';

import {ThemeContext} from '../context/ThemeContext';

import {Flashcard as FlashcardType} from '../types';
import {MD3Colors} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

type EditPageProps = {
  route: RouteProp<RootStackParamList, 'Edit'>;
  navigation: StackNavigationProp<RootStackParamList, 'Edit'>;
};

const EditPage: React.FC<EditPageProps> = ({route, navigation}) => {
  const {themeStyles, theme} = useContext(ThemeContext);
  const [targetPhrase, setTargetPhrase] = useState('');
  const [targetSentence, setTargetSentence] = useState('');
  const [grammarClassesInput, setGrammarClassesInput] = useState('');
  const [translatedPhrase, setTranslatedPhrase] = useState('');
  const [translatedSentence, setTranslatedSentence] = useState('');

  useEffect(() => {
    // If a flashcard is passed in, use its data to populate the state
    if (route.params?.flashcard) {
      const {flashcard} = route.params;
      setTargetPhrase(flashcard.targetPhrase);
      setTargetSentence(flashcard.targetSentence);
      setGrammarClassesInput(flashcard.grammarClasses.join(', '));
      setTranslatedPhrase(flashcard.translatedPhrase);
      setTranslatedSentence(flashcard.translatedSentence);
    }
  }, [route.params]);

  const grammarClassesArray = grammarClassesInput
    .split(',')
    .map((item: String) => item.trim());

  const handleSave = async () => {
    try {
      const existingDictionary = await AsyncStorage.getItem('dictionary');
      let dictionary: FlashcardType[] | [] = existingDictionary
        ? JSON.parse(existingDictionary)
        : [];

      const flashcardData = {
        targetPhrase,
        targetSentence,
        grammarClasses: grammarClassesArray,
        translatedPhrase,
        translatedSentence,
      };

      let isNewFlashcard = true;

      if (route.params?.flashcard) {
        const index = dictionary.findIndex(
          (item: FlashcardType) =>
            item.targetPhrase === route.params.flashcard?.targetPhrase,
        );

        if (index !== -1) {
          dictionary[index] = {...flashcardData, ...dictionary[index]}; // Update existing flashcard
          isNewFlashcard = false;
        }
      }

      if (isNewFlashcard) {
        dictionary.push({...flashcardData, progress: 0} as never); // Add new flashcard
      }

      await AsyncStorage.setItem('dictionary', JSON.stringify(dictionary));

      // Navigate to the details page of the newly saved or updated flashcard
      navigation.navigate('Dictionary');
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const placeholderTextColor =
    theme === 'light' ? MD3Colors.neutral30 : MD3Colors.neutral70;

  const flashcard = {
    targetPhrase,
    targetSentence,
    grammarClasses: grammarClassesArray,
    translatedPhrase,
    translatedSentence,
    progress: 0,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Flashcard flashcard={flashcard} autoFocus={false} />

        {/* Input Fields */}
        <TextInput
          style={[themeStyles.input, styles.input]}
          onChangeText={setTargetPhrase}
          value={targetPhrase}
          placeholder="Target Phrase"
          placeholderTextColor={placeholderTextColor}
        />
        <TextInput
          style={[themeStyles.input, styles.input]}
          onChangeText={setTargetSentence}
          value={targetSentence}
          placeholder="Target Sentence"
          placeholderTextColor={placeholderTextColor}
        />
        <TextInput
          style={[themeStyles.input, styles.input]}
          onChangeText={setGrammarClassesInput}
          value={grammarClassesInput}
          placeholder="Grammar Classes (comma separated)"
          placeholderTextColor={placeholderTextColor}
        />
        <TextInput
          style={[themeStyles.input, styles.input]}
          onChangeText={setTranslatedPhrase}
          value={translatedPhrase}
          placeholder="Translated Phrase"
          placeholderTextColor={placeholderTextColor}
        />
        <TextInput
          style={[themeStyles.input, styles.input]}
          onChangeText={setTranslatedSentence}
          value={translatedSentence}
          placeholder="Translated Sentence"
          placeholderTextColor={placeholderTextColor}
        />

        {/* Save Button */}
        <View style={styles.button}>
          <Button title="Save" onPress={handleSave} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    marginTop: 5,
  },
});

export default EditPage;
