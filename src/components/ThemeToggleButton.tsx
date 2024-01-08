import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

type ThemeToggleButtonProps = {
  toggleTheme: () => void;
  isDarkMode: boolean;
};

export const ThemeToggleButton = ({
  toggleTheme,
  isDarkMode,
}: ThemeToggleButtonProps) => {
  const iconName = isDarkMode ? 'sun-o' : 'moon-o'; // Example icons for light/dark

  return (
    <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
      <Icon name={iconName} size={24} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    marginRight: 12,
  },
});
