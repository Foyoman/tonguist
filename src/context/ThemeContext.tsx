import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appearance, StyleSheet} from 'react-native';
import {MD3LightTheme, MD3DarkTheme, MD3Colors} from 'react-native-paper';
import {Theme} from '@react-navigation/native';

const NavigationLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: MD3Colors.primary100, // Adjust as needed
    background: MD3Colors.neutral100, // or another appropriate color
    card: MD3Colors.neutral100, // or another appropriate color
    text: MD3Colors.neutral0,
    border: MD3Colors.neutral90, // Adjust as needed
    notification: MD3Colors.secondary100, // Adjust as needed
    // other colors...
  },
};

const NavigationDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: MD3Colors.primary0, // Adjust as needed
    background: MD3Colors.neutral0, // or another appropriate color
    card: MD3Colors.neutral0, // or another appropriate color
    text: MD3Colors.neutral100,
    border: MD3Colors.neutralVariant90, // Adjust as needed
    notification: MD3Colors.secondary0, // Adjust as needed
    // other colors...
  },
};

const lightThemeStyles = StyleSheet.create({
  container: {
    backgroundColor: MD3Colors.neutral80,
    color: MD3Colors.neutral0,
  },
  textPrimary: {
    color: MD3Colors.neutral0,
  },
  textSecondary: {
    color: MD3Colors.neutral10,
  },
  card: {
    backgroundColor: MD3Colors.neutral90,
  },
  cardInput: {
    color: MD3Colors.neutral0,
    backgroundColor: MD3Colors.neutral80,
  },
  pill: {
    backgroundColor: MD3Colors.neutral80,
  },
  dot: {
    backgroundColor: MD3Colors.neutral70,
  },
  dotProgress: {
    backgroundColor: MD3Colors.primary60,
  },
});

const darkThemeStyles = StyleSheet.create({
  container: {
    backgroundColor: MD3Colors.neutral20,
    color: MD3Colors.neutral100,
  },
  textPrimary: {
    color: MD3Colors.neutral100,
  },
  textSecondary: {
    color: MD3Colors.neutral90,
  },
  card: {
    backgroundColor: MD3Colors.neutral10,
  },
  cardInput: {
    color: MD3Colors.neutral100,
    backgroundColor: MD3Colors.neutral20,
  },
  pill: {
    backgroundColor: MD3Colors.neutral20,
  },
  dot: {
    backgroundColor: MD3Colors.neutral30,
  },
  dotProgress: {
    backgroundColor: MD3Colors.primary70,
  },
});

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  themeStyles: StyleSheet.NamedStyles<any>;
  navTheme: Theme;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  themeStyles: lightThemeStyles,
  navTheme: NavigationLightTheme,
});

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({children}: Props) => {
  const [theme, setTheme] = useState<string>('light');
  const [navTheme, setNavTheme] = useState(NavigationLightTheme);
  const currentStyles = theme === 'light' ? lightThemeStyles : darkThemeStyles;

  useEffect(() => {
    setNavTheme(theme === 'light' ? NavigationLightTheme : NavigationDarkTheme);
  }, [theme]);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setTheme(savedTheme);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme || 'light');
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{theme, toggleTheme, themeStyles: currentStyles, navTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};