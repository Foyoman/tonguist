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

import {useProgress} from '../hooks/useProgress';
import {Progress} from '../types';
import ProgressBar from '../components/ProgressBar';

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
        <ProgressBar progress={todaysProgress?.cardsCompleted} goal={50} />
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
