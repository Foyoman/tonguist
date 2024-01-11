import React, {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({progress}: ProgressBarProps) => {
  const {themeStyles} = useContext(ThemeContext);

  return (
    <View style={styles.progressContainer}>
      <View style={[themeStyles.backgroundPrimary, styles.progressBar]}>
        <View
          style={[
            themeStyles.backgroundTertiary,
            styles.progressBarProgress,
            {width: `${(progress / 50) * 100}%`},
          ]}
        />
      </View>
      <Text style={[themeStyles.textTertiary, styles.progressText]}>
        {progress} / 50
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  spinnerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingTop: 60,
  },
  progressContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 32,
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

export default ProgressBar;
