import React, {useContext, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {MD3Colors} from 'react-native-paper';

import {FlashcardComponent} from '../types';

const Flashcard: React.FC<FlashcardComponent> = ({
  flashcard,
  progressGoal = 10,
  correct = false,
  incorrect = false,
  inputValue,
  setInputValue,
  handleSubmit,
  autoFocus = true,
}) => {
  const {themeStyles, theme} = useContext(ThemeContext);
  const splitSentence = flashcard.targetSentence.split(flashcard.targetPhrase);
  const afterTextSplit = splitSentence[1]?.match(/\S+|\s/g);
  const [inputWidth, setInputWidth] = useState<number | null>(null);
  const grammarClassesStr = flashcard.grammarClasses.join(', ');
  const inputRef = useRef<TextInput>(null); // Create a ref for the TextInput

  const afterText = afterTextSplit?.map((word, index) => {
    return (
      <Text style={[themeStyles.textPrimary, styles.textPrimary]} key={index}>
        {word}
      </Text>
    );
  });

  const progressBars = [];

  for (let i = 0; i < progressGoal; i++) {
    const barStyle =
      i <= flashcard.progress - 1 ? themeStyles.barProgress : themeStyles.bar;

    progressBars.push(<View key={i} style={[barStyle, styles.bar]} />);
  }

  const handleOnSubmitEditing = () => {
    if (handleSubmit && !correct) {
      handleSubmit();
    }

    inputRef.current?.focus();
  };

  const handleOnChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    if (setInputValue) {
      if (!correct) {
        setInputValue(e.nativeEvent.text);
      } else {
        e.preventDefault();
        setInputValue(flashcard.targetPhrase);
      }
    }
  };

  return (
    <View>
      <View style={[themeStyles.card, styles.card]}>
        <View style={styles.bars}>
          {progressBars}
          <Text style={[themeStyles.textTertiary, styles.progressText]}>
            {flashcard.progress}
          </Text>
        </View>

        <View style={styles.inlineContainer}>
          <Text style={[themeStyles.textPrimary, styles.textPrimary]}>
            {splitSentence[0]}
          </Text>
          <TextInput
            style={[
              themeStyles.cardInput,
              styles.cardInput,
              correct && !incorrect ? themeStyles.correct : null,
              {width: inputWidth},
            ]}
            selectionColor={correct ? 'transparent' : MD3Colors.primary50}
            autoFocus={autoFocus}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            ref={inputRef}
            placeholder={incorrect ? flashcard.targetPhrase : ''}
            placeholderTextColor={
              theme === 'light' ? MD3Colors.neutral30 : MD3Colors.neutral70
            }
            value={inputValue}
            onChange={e => handleOnChange(e)}
            // onChangeText={input => handleOnChangeText(input)}
            onSubmitEditing={handleOnSubmitEditing}
            returnKeyType="done" // Optional: changes the label on the return key (varies by keyboard type)
            blurOnSubmit={false} // Optional: keyboard stays open after pressing return key
            // editable={!correct}
          />
          {afterText}
        </View>
        <View style={[themeStyles.pill, styles.pill]}>
          <Text style={[themeStyles.textSecondary, styles.textSecondary]}>
            {grammarClassesStr}
          </Text>
        </View>
      </View>

      <View style={[themeStyles.card, styles.card]}>
        <Text style={[themeStyles.textPrimary, styles.textPrimary]}>
          {flashcard.translatedPhrase}
        </Text>
        <Text
          style={[
            themeStyles.textPrimary,
            styles.textPrimary,
            styles.translatedSentence,
          ]}>
          {flashcard.translatedSentence}
        </Text>
      </View>

      <TextInput
        editable={false}
        pointerEvents="none"
        style={styles.inputWidth}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setInputWidth(width);
        }}>
        {flashcard.targetPhrase}
      </TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    paddingTop: 12,
    marginBottom: 12,
  },
  inlineContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  textPrimary: {
    fontSize: 18,
  },
  textSecondary: {
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  cardInput: {
    marginVertical: 4,
    paddingVertical: 2,
    width: 100,
    alignContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    borderRadius: 4,
    height: 30,
    fontSize: 18,
  },
  inputWidth: {
    opacity: 0,
    position: 'absolute',
    fontSize: 18,
  },
  pill: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 12,
  },
  bars: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  bar: {
    width: 12,
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    marginLeft: 2,
  },
  translatedSentence: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default Flashcard;
