import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeContext} from '../context/ThemeContext';

import HomePage from '../screens/HomePage';
import LearnPage from '../screens/LearnPage';
import DictionaryPage from '../screens/DictionaryPage';
import DetailsPage from '../screens/DetailsPage';
import EditPage from '../screens/EditPage';

// Define the types for navigation parameters for each screen
import {RootStackParamList} from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {navTheme} = useContext(ThemeContext);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Learn" component={LearnPage} />
        <Stack.Screen name="Dictionary" component={DictionaryPage} />
        <Stack.Screen name="Details" component={DetailsPage} />
        <Stack.Screen name="Edit" component={EditPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
