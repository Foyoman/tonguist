import React from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type ThemeToggleButtonProps = {
  toggleTheme: () => void;
  isDarkMode: boolean;
  style?: StyleProp<ViewStyle>;
};

export const ThemeToggleButton = ({
  toggleTheme,
  isDarkMode,
  style,
}: ThemeToggleButtonProps) => {
  const iconName = isDarkMode ? 'sun-o' : 'moon-o';

  return (
    <TouchableOpacity style={style} onPress={toggleTheme}>
      <Icon name={iconName} size={24} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
  );
};
