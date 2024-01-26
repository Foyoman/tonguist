import React, {useContext, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextStyle,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {MD3Colors} from 'react-native-paper';

import {FlashcardComponent} from '../../types';
import {extractTargetPhrase} from '../../utils/textUtils';

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
  const [inputWidth, setInputWidth] = useState<number | null>(null);
  const grammarClassesStr = flashcard.grammarClasses.join(', ');
  const inputRef = useRef<TextInput>(null);

  const ogTargetPhrase = extractTargetPhrase(
    flashcard.targetSentence,
    flashcard.targetPhrase,
  );

  const ogTranslatedPhrase = extractTargetPhrase(
    flashcard.translatedSentence,
    flashcard.translatedPhrase,
  );

  const splitTextSentence = (
    phrase: string,
    sentence: string,
    styles?: TextStyle[],
  ) => {
    const phraseRegex = new RegExp(`\\b${phrase}\\b`, 'i');
    const splitSentence = sentence.split(phraseRegex);
    const beforeTextArr = splitSentence[0]?.match(/\S+|\s/g) as string[];
    const afterTextArr = splitSentence[1]?.match(/\S+|\s/g) as string[];

    const punctuationRegex = /^[.,!?]+$/;
    let followingPunctuation;
    if (afterTextArr && punctuationRegex.test(afterTextArr[0])) {
      followingPunctuation = afterTextArr[0];
      afterTextArr.shift();
    }

    const splitText = (splitStr: string[]) => {
      const textBlocks = splitStr?.map((word, index) => {
        return (
          <Text style={styles} key={index}>
            {word}
          </Text>
        );
      });
      return textBlocks;
    };

    const beforeText = splitText(beforeTextArr);
    const afterText = splitText(afterTextArr);
    return [beforeText, afterText, followingPunctuation];
  };

  const [targetBeforeText, targetAfterText, targetFollowingPunc] =
    splitTextSentence(flashcard.targetPhrase, flashcard.targetSentence, [
      themeStyles.textPrimary,
      styles.textPrimary,
    ]);

  const [translatedBeforeText, translatedAfterText, translatedFollowingPunc] =
    splitTextSentence(
      flashcard.translatedPhrase,
      flashcard.translatedSentence,
      [themeStyles.textPrimary, styles.translatedSentence],
    );

  const progressBars = [];
  for (let i = 0; i < progressGoal; i++) {
    const barStyle = flashcard.progress
      ? i <= flashcard.progress - 1
        ? themeStyles.backgroundTertiary
        : themeStyles.bar
      : themeStyles.bar;

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
      <View style={[themeStyles.backgroundPrimary, styles.card]}>
        <View style={styles.bars}>
          {progressBars}
          <Text style={[themeStyles.textTertiary, styles.progressText]}>
            {flashcard.progress}
          </Text>
        </View>

        <View style={styles.inlineWrap}>
          {targetBeforeText}
          <View style={styles.inlineNoWrap}>
            <TextInput
              style={[
                themeStyles.textPrimary,
                themeStyles.backgroundSecondary,
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
              placeholder={incorrect ? ogTargetPhrase : ''}
              placeholderTextColor={
                theme === 'light' ? MD3Colors.neutral30 : MD3Colors.neutral70
              }
              value={inputValue}
              onChange={e => handleOnChange(e)}
              onSubmitEditing={handleOnSubmitEditing}
              returnKeyType="done"
              blurOnSubmit={false}
            />
            {targetFollowingPunc && (
              <Text style={[themeStyles.textPrimary, styles.textPrimary]}>
                {targetFollowingPunc}
              </Text>
            )}
          </View>
          {targetAfterText}
        </View>

        {grammarClassesStr && (
          <View style={[themeStyles.backgroundSecondary, styles.pill]}>
            <Text style={[themeStyles.textSecondary, styles.textSecondary]}>
              {grammarClassesStr}
            </Text>
          </View>
        )}
      </View>

      <View style={[themeStyles.backgroundPrimary, styles.card]}>
        <Text style={[themeStyles.textPrimary, styles.textPrimary]}>
          {flashcard.translatedPhrase}
        </Text>
        {flashcard.translatedSentence && (
          <View style={[styles.inlineWrap, styles.translatedSentenceContainer]}>
            {translatedBeforeText}
            {flashcard.translatedSentence
              .toLowerCase()
              .includes(flashcard.translatedPhrase.toLowerCase()) && (
              <View style={styles.inlineNoWrap}>
                <Text
                  style={[
                    themeStyles.textPrimary,
                    styles.translatedSentence,
                    styles.translatedSentencePhrase,
                  ]}>
                  {ogTranslatedPhrase}
                </Text>
                {translatedFollowingPunc && (
                  <Text
                    style={[
                      themeStyles.textPrimary,
                      styles.translatedSentence,
                    ]}>
                    {translatedFollowingPunc}
                  </Text>
                )}
              </View>
            )}
            {translatedAfterText}
          </View>
        )}
      </View>

      <TextInput
        editable={false}
        pointerEvents="none"
        style={styles.inputWidth}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setInputWidth(width);
        }}>
        {ogTargetPhrase}
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
  inlineWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  inlineNoWrap: {
    display: 'flex',
    // flexWrap: 'wrap',
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
  translatedSentenceContainer: {
    marginTop: 8,
  },
  translatedSentence: {
    fontSize: 14,
  },
  translatedSentencePhrase: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default Flashcard;
