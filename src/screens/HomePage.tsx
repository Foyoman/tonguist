// native
import React, {useCallback, useContext, useState, useLayoutEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// context
import {ThemeContext} from '../context/ThemeContext';
import {AppContext} from '../context/AppContext';

// progress
import {useProgress} from '../hooks/useProgress';
import {Progress} from '../types';

// types
import {HomePageProps} from '../types';

// dictionary
import {useDictionary} from '../hooks/useDictionary';
import {fetchDictionaryNames} from '../services/dictionaryService';

// components
import DropDownPicker from 'react-native-dropdown-picker';
import {Button, Modal, ThemeToggleButton} from '../components/elements';
import {ProgressBar, WeeklyProgress} from '../components/Progress';
import {ActivityIndicator} from 'react-native-paper';

const HomePage = ({navigation}: HomePageProps) => {
  const {themeStyles, theme, toggleTheme} = useContext(ThemeContext);
  const {goal, setGoal} = useContext(AppContext);
  const isDarkMode = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const {selectedDictionary, setSelectedDictionary} = useDictionary();
  const [todaysProgress, setTodaysProgress] = useState<Progress>();

  const {fetchTodaysProgress, calculateStreak} = useProgress();
  const [streak, setStreak] = useState(0);

  const [dictionaryDropdownOpen, setDictionaryDropdownOpen] = useState(false);
  const [dictionaryOption, setDictionaryOption] = useState('');
  const [dictionaryItems, setDictionaryItems] = useState([
    {label: '', value: '', key: 0},
  ]);

  const handleToggleTheme = useCallback(() => {
    setDictionaryDropdownOpen(false);
    toggleTheme();
  }, [toggleTheme]);

  const headerRight = useCallback(
    () => (
      <ThemeToggleButton
        toggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
        style={styles.themeButton}
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
    const progressData = await fetchTodaysProgress();
    if (progressData) {
      setTodaysProgress(progressData);
    } else {
      navigation.navigate('Home');
    }
  }, [fetchTodaysProgress, navigation]);

  const handleSelectDictionary = (dictionaryName: string | null) => {
    if (dictionaryName) {
      setSelectedDictionary(dictionaryName);
      loadProgress();
    }
  };

  const getStreak = useCallback(async () => {
    const calculatedStreak = await calculateStreak();
    setStreak(calculatedStreak);
  }, [calculateStreak]);

  useFocusEffect(
    useCallback(() => {
      const loadAllData = async () => {
        setLoading(true);

        try {
          await Promise.all([loadDictionaries(), loadProgress(), getStreak()]);

          if (selectedDictionary) {
            setDictionaryOption(selectedDictionary);
          } else {
            setDictionaryOption('');
          }
        } catch (error) {
          console.error('Error loading data:', error);
        }

        setLoading(false);
      };

      loadAllData();
    }, [loadDictionaries, loadProgress, getStreak, selectedDictionary]),
  );

  // change goal modal and dropdown
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [goalOption, setGoalOption] = useState(goal);

  const goalItems = [
    {
      label: '25',
      value: 25,
      key: 0,
    },
    {
      label: '50',
      value: 50,
      key: 1,
    },
    {
      label: '100',
      value: 100,
      key: 2,
    },
    {
      label: '200',
      value: 200,
      key: 3,
    },
  ];

  const openGoalModal = () => setIsGoalModalVisible(true);
  const closeGoalModal = () => setIsGoalModalVisible(false);

  const handleSaveGoal = () => {
    setGoal(goalOption);
    closeGoalModal();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedDictionary && (
        <View
          style={[themeStyles.backgroundPrimary, styles.card, styles.progress]}>
          <View>
            <View style={styles.progressHeader}>
              <Text style={[themeStyles.textPrimary, styles.header]}>
                Streak: {streak} day{streak !== 1 && 's'}
              </Text>
              <TouchableOpacity onPress={openGoalModal}>
                <Text style={[themeStyles.textTertiary, styles.changeGoal]}>
                  Change goal
                </Text>
              </TouchableOpacity>
            </View>
            {todaysProgress && (
              <ProgressBar
                progress={todaysProgress?.cardsCompleted}
                goal={goal}
                style={styles.progressBar}
                contained
              />
            )}
            <WeeklyProgress />
          </View>
          <Button
            title="View progress"
            fullWidth
            outline
            onPress={() => navigation.navigate('Progress')}
          />
        </View>
      )}
      <View style={[themeStyles.backgroundPrimary, styles.card]}>
        <Text style={[themeStyles.textSecondary, styles.heading]}>
          Selected dictionary:
        </Text>
        <DropDownPicker
          open={dictionaryDropdownOpen}
          value={dictionaryOption}
          items={dictionaryItems}
          setOpen={setDictionaryDropdownOpen}
          setValue={setDictionaryOption}
          onChangeValue={dictionaryName =>
            handleSelectDictionary(dictionaryName)
          }
          setItems={setDictionaryItems}
          itemKey="key"
          placeholder="Select a dictionary"
          style={themeStyles.input}
          containerStyle={[themeStyles.input, styles.dropdown]}
          textStyle={[themeStyles.input, styles.dropdownText]}
          dropDownContainerStyle={themeStyles.input}
          arrowIconStyle={themeStyles.tintColour}
          tickIconStyle={themeStyles.tintColour}
        />
        <View style={styles.buttons}>
          <Button
            title="View dictionary"
            fullWidth
            onPress={() => navigation.navigate('Dictionary')}
            disabled={!selectedDictionary}
          />
          <Button
            title="View all dictionaries"
            fullWidth
            outline
            onPress={() => navigation.navigate('Dictionaries')}
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <Button
          title="Learn"
          onPress={() => navigation.navigate('Learn')}
          fullWidth
          disabled={!selectedDictionary}
        />
      </View>

      <Modal
        visible={isGoalModalVisible}
        onRequestClose={closeGoalModal}
        buttons={[
          {title: 'Save', onPress: handleSaveGoal},
          {title: 'Cancel', onPress: closeGoalModal, outline: true},
        ]}>
        <DropDownPicker
          open={goalDropdownOpen}
          value={goalOption}
          items={goalItems}
          setOpen={setGoalDropdownOpen}
          setValue={setGoalOption}
          itemKey="key"
          placeholder="Select a goal"
          style={themeStyles.input}
          containerStyle={[themeStyles.input, styles.dropdown]}
          textStyle={[themeStyles.input, styles.dropdownText]}
          dropDownContainerStyle={themeStyles.input}
          arrowIconStyle={themeStyles.tintColour}
          tickIconStyle={themeStyles.tintColour}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  themeButton: {
    marginRight: 16,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: '100%',
    padding: 16,
    gap: 16,
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  heading: {
    fontSize: 18,
    marginBottom: 8,
  },
  dropdown: {
    borderRadius: 8,
    zIndex: 10,
    marginBottom: 8,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  buttons: {
    display: 'flex',
    gap: 8,
  },
  card: {
    borderRadius: 8,
    padding: 16,
  },
  progress: {
    display: 'flex',
    gap: 16,
  },
  progressBar: {
    marginBottom: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeGoal: {
    textTransform: 'uppercase',
    fontWeight: '600',
    // fontWeight: '500',
  },
});

export default HomePage;
