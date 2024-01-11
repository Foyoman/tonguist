import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {ThemeToggleButton} from '../components/ThemeToggleButton';

import {MD3Colors, ProgressBar} from 'react-native-paper';

import {useProgress} from '../hooks/useProgress';
import {Progress} from '../types';

const HomePage = ({navigation}: any) => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const {fetchProgressData} = useProgress();
  const [todaysProgress, setTodaysProgress] = useState<Progress>();

  const headerRight = useCallback(
    () => (
      <ThemeToggleButton toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    ),
    [toggleTheme, isDarkMode],
  );

  useLayoutEffect(() => {
    navigation.setOptions({headerRight});
  }, [navigation, headerRight]);

  useEffect(() => {
    const initializeProgress = async () => {
      const progressData = await fetchProgressData();
      setTodaysProgress(progressData);
    };

    initializeProgress();
  }, [fetchProgressData]);

  return (
    <View style={styles.container}>
      {todaysProgress && (
        <ProgressBar
          progress={todaysProgress?.cardsCompleted / 50}
          color={theme === 'light' ? MD3Colors.primary60 : MD3Colors.primary70}
        />
      )}
      <Button title="Learn" onPress={() => navigation.navigate('Learn')} />
      <Button
        title="Dictionary"
        onPress={() => navigation.navigate('Dictionary')}
      />
      <Button title="Create" onPress={() => navigation.navigate('Edit')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 16,
    height: '100%',
    padding: 16,
  },
});

export default HomePage;
