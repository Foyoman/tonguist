import React, {useCallback, useContext, useState, useLayoutEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, Text} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {ThemeToggleButton} from '../components/elements/ThemeToggleButton';

import {useProgress} from '../hooks/useProgress';
import {Progress} from '../types';
import {ProgressBar, Button} from '../components/elements';
import {HomePageProps} from '../types';
import {useDictionary} from '../hooks/useDictionary';
import {fetchDictionaryNames} from '../services/dictionaryService';

import DropDownPicker from 'react-native-dropdown-picker';

const HomePage = ({navigation}: HomePageProps) => {
  const {themeStyles, theme, toggleTheme} = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const {selectedDictionary, setSelectedDictionary} = useDictionary(); // Using custom hook
  const {fetchProgressData} = useProgress();
  const [todaysProgress, setTodaysProgress] = useState<Progress>();
  // const [goal, setGoal] = useState(0);

  const [open, setOpen] = useState(false);
  const [dictionary, setDictionary] = useState('');
  const [dictionaryItems, setDictionaryItems] = useState([
    {label: '', value: '', key: 0},
  ]);

  const handleToggleTheme = useCallback(() => {
    setOpen(false);
    toggleTheme();
  }, [toggleTheme]);

  const headerRight = useCallback(
    () => (
      <ThemeToggleButton
        toggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
      />
    ),
    [handleToggleTheme, isDarkMode],
  );

  useLayoutEffect(() => {
    navigation.setOptions({headerRight});
  }, [navigation, headerRight]);

  const loadDictionaries = useCallback(async () => {
    const dictionaries = await fetchDictionaryNames();
    if (dictionaries && dictionaries.length) {
      const convertedDictionaryItems = dictionaries.map(
        (dictionaryName: string, index: number) => {
          return {
            label: dictionaryName.toUpperCase(),
            value: dictionaryName,
            key: index,
          };
        },
      );
      setDictionaryItems(convertedDictionaryItems);
    } else {
      navigation.navigate('Dictionaries');
    }
  }, [navigation]);

  const loadProgress = useCallback(async () => {
    const progressData = await fetchProgressData();
    console.log(progressData);
    setTodaysProgress(progressData);
  }, [fetchProgressData]);

  useFocusEffect(
    useCallback(() => {
      loadDictionaries();
      loadProgress();
      if (selectedDictionary) {
        setDictionary(selectedDictionary);
      }
    }, [loadProgress, selectedDictionary, loadDictionaries]),
  );

  // useEffect(() => {
  //   setSelectedDictionary(dictionary);
  //   loadProgress();
  // }, [dictionary, loadProgress, setSelectedDictionary]);

  const handleSelectDictionary = (dictionaryName: string | null) => {
    if (dictionaryName) {
      setSelectedDictionary(dictionaryName);
      loadProgress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[themeStyles.backgroundPrimary, styles.card]}>
        <Text style={[themeStyles.textSecondary, styles.heading]}>
          Selected dictionary:
        </Text>
        <DropDownPicker
          open={open}
          value={dictionary}
          items={dictionaryItems}
          setOpen={setOpen}
          setValue={setDictionary}
          onChangeValue={val => handleSelectDictionary(val)}
          setItems={setDictionaryItems}
          itemKey="key"
          style={themeStyles.input}
          containerStyle={[themeStyles.input, styles.dropdown]}
          textStyle={[themeStyles.input, styles.dropdownText]}
          labelStyle={themeStyles.input}
          itemSeparatorStyle={themeStyles.input}
          dropDownContainerStyle={themeStyles.input}
          listItemContainerStyle={themeStyles.input}
          arrowIconStyle={themeStyles.tintColour}
          tickIconStyle={themeStyles.tintColour}
        />
        <View style={styles.buttons}>
          <Button
            title="Learn"
            onPress={() => navigation.navigate('Learn')}
            fullWidth
            disabled={!selectedDictionary}
          />
          <Button
            title="View dictionary"
            fullWidth
            outline
            onPress={() => navigation.navigate('Dictionary')}
          />
        </View>
      </View>
      <View style={styles.buttons}>
        {todaysProgress && (
          <ProgressBar progress={todaysProgress?.cardsCompleted} goal={50} />
        )}
        <Button
          title="Dictionaries"
          onPress={() => navigation.navigate('Dictionaries')}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: '100%',
    padding: 16,
  },
  heading: {
    fontSize: 18,
    marginBottom: 8,
    // fontWeight: '500',
  },
  dropdown: {
    borderRadius: 8,
    // marginBottom: 8,
    zIndex: 10,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  buttons: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
  },
  card: {
    borderRadius: 8,
    padding: 16,
  },
});

export default HomePage;
