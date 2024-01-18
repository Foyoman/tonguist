import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import {ThemeProvider} from './context/ThemeContext';
import {PaperProvider} from 'react-native-paper';
import {DictionaryProvider} from './context/DictionaryContext';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <PaperProvider>
        <DictionaryProvider>
          <AppNavigator />
        </DictionaryProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default App;
