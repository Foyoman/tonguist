import React, {useContext} from 'react';
import {StyleSheet, View, Text, StyleProp, ViewStyle} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';

interface ProgressBarProps {
  progress: number;
  goal: number;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar = ({progress, goal, style}: ProgressBarProps) => {
  const {themeStyles} = useContext(ThemeContext);
  const percentage = Math.min((progress / goal) * 100, 100);

  return (
    <View style={[styles.progressContainer, style]}>
      <View style={[themeStyles.backgroundPrimary, styles.progressBar]}>
        <View
          style={[
            themeStyles.backgroundTertiary,
            styles.progressBarProgress,
            {width: `${percentage}%`},
          ]}
        />
      </View>
      <Text style={[themeStyles.textTertiary, styles.progressText]}>
        {progress} / {goal}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
