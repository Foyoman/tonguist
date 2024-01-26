import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import {ThemeProvider} from './context/ThemeContext';
import {PaperProvider} from 'react-native-paper';
import {AppProvider} from './context/AppContext';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <PaperProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default App;
