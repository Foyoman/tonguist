import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {MD3Colors} from 'react-native-paper';

interface CardProps {
  targetPhrase: string;
  targetSentence: string;
  grammarClasses: string[];
  translatedPhrase: string;
  translatedSentence: string;
}

const FlashCard: React.FC<CardProps> = ({
  targetSentence,
  targetPhrase,
  grammarClasses,
  translatedPhrase,
  translatedSentence,
}) => {
  const {themeStyles, theme} = useContext(ThemeContext);
  const splitSentence = targetSentence.split(targetPhrase);
  const afterTextSplit = splitSentence[1].match(/\S+|\s/g);
  const [inputWidth, setInputWidth] = useState<number | null>(null);
  const grammarClassesStr = grammarClasses.join(', ');

  const afterText = afterTextSplit!.map((word, index) => {
    return (
      <Text style={[themeStyles.textPrimary, styles.textPrimary]} key={index}>
        {word}
      </Text>
    );
  });

  return (
    <View>
      <View style={[themeStyles.card, styles.card]}>
        <View style={styles.dots}>
          <View style={[themeStyles.dotProgress, styles.dot]} />
          <View style={[themeStyles.dotProgress, styles.dot]} />
          <View style={[themeStyles.dotProgress, styles.dot]} />
          <View style={[themeStyles.dotProgress, styles.dot]} />
          <View style={[themeStyles.dotProgress, styles.dot]} />
          <View style={[themeStyles.dot, styles.dot]} />
          <View style={[themeStyles.dot, styles.dot]} />
          <View style={[themeStyles.dot, styles.dot]} />
          <View style={[themeStyles.dot, styles.dot]} />
          <View style={[themeStyles.dot, styles.dot]} />
        </View>

        <View style={styles.inlineContainer}>
          <Text style={[themeStyles.textPrimary, styles.textPrimary]}>
            {splitSentence[0]}
          </Text>
          <TextInput
            style={[
              themeStyles.cardInput,
              styles.cardInput,
              {width: inputWidth},
            ]}
            placeholder={targetPhrase}
            placeholderTextColor={
              theme === 'light' ? MD3Colors.neutral30 : MD3Colors.neutral70
            }
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
          {translatedPhrase}
        </Text>
        <Text
          style={[
            themeStyles.textPrimary,
            styles.textPrimary,
            styles.translatedSentence,
          ]}>
          {translatedSentence}
        </Text>
      </View>

      <TextInput
        pointerEvents="none"
        style={styles.inputWidth}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setInputWidth(width);
        }}>
        {targetPhrase}
      </TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    // shadowColor: MD3Colors.neutral0,
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 5, // for Android shadow
    padding: 16,
    // margin: 16,
    marginTop: 16,
    marginHorizontal: 16,
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
    // width: 'auto',
  },
  dots: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    width: 12,
    height: 6,
    borderRadius: 3,
  },
  translatedSentence: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default FlashCard;
