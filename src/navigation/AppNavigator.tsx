import React, {useContext, useRef} from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeContext} from '../context/ThemeContext';

import HomePage from '../screens/HomePage';
import LearnPage from '../screens/LearnPage';
import DictionariesPage from '../screens/Dictionaries/DictionariesPage';
import DictionaryPage from '../screens/Flashcards/DictionaryPage';
import DetailsPage from '../screens/Flashcards/DetailsPage';
import EditPage from '../screens/Flashcards/EditPage';

// Define the types for navigation parameters for each screen
import {RootStackParamList} from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {navTheme} = useContext(ThemeContext);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  return (
    <NavigationContainer ref={navigationRef!} theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Learn" component={LearnPage} />
        <Stack.Screen name="Dictionaries" component={DictionariesPage} />
        <Stack.Screen name="Dictionary" component={DictionaryPage} />
        <Stack.Screen name="Details" component={DetailsPage} />
        <Stack.Screen name="Edit" component={EditPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
