import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomePage from '../screens/HomePage';
import LearnPage from '../screens/LearnPage';
import {ThemeContext} from '../context/ThemeContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {navTheme} = useContext(ThemeContext);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Learn" component={LearnPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
