import React, {useCallback, useContext} from 'react';
import {View, Button} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {ThemeToggleButton} from '../components/ThemeToggleButton';

const HomePage = ({navigation}: any) => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const headerRight = useCallback(
    () => (
      <ThemeToggleButton toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    ),
    [toggleTheme, isDarkMode],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({headerRight});
  }, [navigation, headerRight]);

  return (
    <View>
      <Button title="Learn" onPress={() => navigation.navigate('Learn')} />
    </View>
  );
};

export default HomePage;
