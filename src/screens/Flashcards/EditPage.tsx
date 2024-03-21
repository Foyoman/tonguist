import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import Flashcard from '../../components/Flashcard/Flashcard';
import {TextInput} from 'react-native';
import {Button} from '../../components/elements';

import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/pages';
import {StackNavigationProp} from '@react-navigation/stack';

import {ThemeContext} from '../../context/ThemeContext';

import {Flashcard as FlashcardType} from '../../types';
import {MD3Colors} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

import {fetchDictionary} from '../../services/dictionaryService';
import {v4 as uuidv4} from 'uuid';
import {saveDictionary} from '../../utils/appStorage';
import {AppContext} from '../../context/AppContext';

type EditPageProps = {
  route: RouteProp<RootStackParamList, 'Edit'>;
  navigation: StackNavigationProp<RootStackParamList, 'Edit'>;
};

const EditPage: React.FC<EditPageProps> = ({route, navigation}) => {
  const {themeStyles, theme} = useContext(ThemeContext);
  const {selectedDictionary} = useContext(AppContext);

  const [targetPhraseInput, setTargetPhraseInput] = useState('');
  const [targetSentenceInput, setTargetSentenceInput] = useState('');
  const [grammarClassesInput, setGrammarClassesInput] = useState('');
  const [translatedPhraseInput, setTranslatedPhraseInput] = useState('');
  const [translatedSentenceInput, setTranslatedSentenceInput] = useState('');

  const targetSentenceRef = useRef<TextInput>(null);
  const grammerClassesRef = useRef<TextInput>(null);
  const translatedPhraseRef = useRef<TextInput>(null);
  const translatedSentenceRef = useRef<TextInput>(null);

  const targetPhrase = targetPhraseInput.trim();
  const targetSentence = targetSentenceInput.trim();
  const grammarClasses = grammarClassesInput
    .split(',')
    .map((item: String) => item.trim());
  const translatedPhrase = translatedPhraseInput.trim();
  const translatedSentence = translatedSentenceInput.trim();

  useEffect(() => {
    if (route.params?.flashcard) {
      const {flashcard} = route.params;
      setTargetPhraseInput(flashcard.targetPhrase);
      setTargetSentenceInput(flashcard.targetSentence);
      setGrammarClassesInput(flashcard.grammarClasses.join(', '));
      setTranslatedPhraseInput(flashcard.translatedPhrase);
      setTranslatedSentenceInput(flashcard.translatedSentence);
    }
  }, [route.params]);

  const handleSave = async () => {
    if (!selectedDictionary) {
      navigation.navigate('Dictionaries');
      return;
    }

    try {
      let dictionary = await fetchDictionary(selectedDictionary);

      if (dictionary) {
        // storeDictionary(dictionary);
        const flashcardData = {
          id: uuidv4(),
          targetPhrase,
          targetSentence,
          grammarClasses,
          translatedPhrase,
          translatedSentence,
        };

        let isNewFlashcard = true;

        if (route.params?.flashcard) {
          const index = dictionary.findIndex(
            (item: FlashcardType) => item.id === route.params.flashcard?.id,
          );

          if (index !== -1) {
            dictionary[index] = {...flashcardData, ...dictionary[index]}; // Update existing flashcard
            isNewFlashcard = false;
          }
        }

        if (isNewFlashcard) {
          dictionary.push({...flashcardData, progress: 0} as never); // Add new flashcard
        }

        saveDictionary(selectedDictionary, dictionary);

        // Navigate to the details page of the newly saved or updated flashcard
        navigation.navigate('Dictionary');
      }
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const placeholderTextColor =
    theme === 'light' ? MD3Colors.neutral30 : MD3Colors.neutral70;

  const flashcard = {
    id: route.params?.flashcard?.id || 'temp-id',
    targetPhrase,
    targetSentence,
    grammarClasses,
    translatedPhrase,
    translatedSentence,
    progress: 0,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Flashcard flashcard={flashcard} autoFocus={false} />

        <TextInput
          style={[themeStyles.input, styles.input]}
          onChangeText={setTargetPhraseInput}
          value={targetPhraseInput}
          placeholder="Target Phrase"
          placeholderTextColor={placeholderTextColor}
          returnKeyType="next"
          onSubmitEditing={() => targetSentenceRef.current?.focus()}
        />
        <TextInput
          ref={targetSentenceRef}
          style={[themeStyles.input, styles.input]}
          onChangeText={setTargetSentenceInput}
          value={targetSentenceInput}
          placeholder="Target Sentence"
          placeholderTextColor={placeholderTextColor}
          returnKeyType="next"
          onSubmitEditing={() => grammerClassesRef.current?.focus()}
        />
        <TextInput
          ref={grammerClassesRef}
          style={[themeStyles.input, styles.input]}
          onChangeText={setGrammarClassesInput}
          value={grammarClassesInput}
          placeholder="Grammar Classes (comma separated)"
          placeholderTextColor={placeholderTextColor}
          returnKeyType="next"
          onSubmitEditing={() => translatedPhraseRef.current?.focus()}
        />
        <TextInput
          ref={translatedPhraseRef}
          style={[themeStyles.input, styles.input]}
          onChangeText={setTranslatedPhraseInput}
          value={translatedPhraseInput}
          placeholder="Translated Phrase"
          placeholderTextColor={placeholderTextColor}
          returnKeyType="next"
          onSubmitEditing={() => translatedSentenceRef.current?.focus()}
        />
        <TextInput
          ref={translatedSentenceRef}
          style={[themeStyles.input, styles.input]}
          onChangeText={setTranslatedSentenceInput}
          value={translatedSentenceInput}
          placeholder="Translated Sentence"
          placeholderTextColor={placeholderTextColor}
          returnKeyType="done"
        />

        <View style={styles.button}>
          <Button title="Save" onPress={handleSave} fullWidth />
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
    borderRadius: 5,
    marginVertical: 5,

    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    textAlignVertical: 'center',
  },
  button: {
    marginTop: 5,
  },
});

export default EditPage;
