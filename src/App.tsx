import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import {ThemeProvider} from './context/ThemeContext';
import {PaperProvider} from 'react-native-paper';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </ThemeProvider>
  );
}

export default App;
