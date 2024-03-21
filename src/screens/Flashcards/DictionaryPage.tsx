// native
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';

// context/theming
import {AppContext} from '../../context/AppContext';
import {ThemeContext} from '../../context/ThemeContext';
import {MD3Colors} from 'react-native-paper';

// types
import {Flashcard, RootStackParamList} from '../../types';

// components
import {DeleteButton, Modal} from '../../components/elements';
import ToolsLayout from '../../components/layout/ToolsLayout';

// dictionary
import {fetchDictionary} from '../../services/dictionaryService';
import {saveDictionary} from '../../utils/appStorage';

// importation
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

// uuid
import {v4 as uuidv4} from 'uuid';

type DictionaryPageProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Dictionary'>;
};

const DictionaryPage: React.FC<DictionaryPageProps> = ({navigation}) => {
  const {removeDictionary, selectedDictionary} = useContext(AppContext);
  const {themeStyles, theme} = useContext(ThemeContext);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const headerRight = useCallback(
    () => (
      <View style={styles.headerRight}>
        {/* <SortButton onPress={openModal} /> */}
        <DeleteButton onPress={openModal} />
      </View>
    ),
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({headerRight});
  }, [navigation, headerRight]);

  const handleRemoveDictionary = () => {
    closeModal();

    if (selectedDictionary) {
      removeDictionary(selectedDictionary);
    } else {
      navigation.navigate('Home');
    }
  };

  const loadFlashcards = useCallback(async () => {
    if (selectedDictionary) {
      const dictionary = await fetchDictionary(selectedDictionary);
      if (dictionary) {
        setFlashcards(dictionary);
      }
    } else {
      navigation.navigate('Home');
    }
  }, [selectedDictionary, navigation]);

  useFocusEffect(
    useCallback(() => {
      loadFlashcards();
    }, [loadFlashcards]),
  );

  const handlePressFlashcard = (flashcard: Flashcard) => {
    navigation.navigate('Details', {flashcard});
  };

  const handleCreateCard = () => {
    navigation.navigate('Edit', {});
  };

  const handleImportJson = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // or specify mime types, e.g., [DocumentPicker.types.json],
      });

      const uri = res[0].uri;
      const fileContent = await RNFS.readFile(uri, 'utf8');
      const importedFlashcards: Flashcard[] = JSON.parse(fileContent);

      // Assign a unique ID to each flashcard
      const flashcardsWithId = importedFlashcards.map(flashcard => ({
        ...flashcard,
        id: uuidv4(), // Assign a new UUID, overwriting any existing id
      }));

      if (selectedDictionary) {
        const existingDictionary = await fetchDictionary(selectedDictionary);

        if (existingDictionary) {
          const combinedFlashcards = [
            ...existingDictionary,
            ...flashcardsWithId,
          ];

          // Save combined data back to the dictionary
          await saveDictionary(selectedDictionary, combinedFlashcards);
          setFlashcards(combinedFlashcards);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim() === '') {
        setFilteredFlashcards(flashcards); // Show all flashcards if search query is empty
      } else {
        const formattedQuery = query.toLowerCase().trim();
        const filtered = flashcards.filter(
          flashcard =>
            flashcard.targetPhrase.toLowerCase().includes(formattedQuery) ||
            flashcard.translatedPhrase.toLowerCase().includes(formattedQuery),
        );
        setFilteredFlashcards(filtered);
      }
    },
    [flashcards],
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [flashcards, handleSearch, searchQuery]);

  const placeholderTextColor =
    theme === 'light' ? MD3Colors.neutral30 : MD3Colors.neutral70;

  const SearchBar = (
    <TextInput
      placeholder="Search"
      value={searchQuery}
      onChangeText={handleSearch}
      style={[themeStyles.input, styles.input]}
      placeholderTextColor={placeholderTextColor}
    />
  );

  return (
    <ToolsLayout
      buttons={[
        {title: 'Create flashcard', onPress: handleCreateCard},
        {title: 'Import JSON', onPress: handleImportJson},
      ]}
      searchBar={SearchBar}>
      {!flashcards.length ? (
        <View style={styles.innerContainer}>
          <Text style={[themeStyles.textSecondary, styles.textCentre]}>
            Create a flashcard to begin
          </Text>
        </View>
      ) : !filteredFlashcards.length ? (
        <View style={styles.innerContainer}>
          <Text style={[themeStyles.textSecondary, styles.textCentre]}>
            No flashcards matching search query
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.innerContainer}
          data={filteredFlashcards}
          keyExtractor={(item, index) => `flashcard-${index}`}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handlePressFlashcard(item)}>
              <View style={[themeStyles.backgroundPrimary, styles.listItem]}>
                <Text style={[themeStyles.textPrimary, styles.heading]}>
                  {item.targetPhrase}
                </Text>
                <Text style={[themeStyles.textSecondary, styles.subheading]}>
                  {item.translatedPhrase}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <Text style={[themeStyles.textSecondary, styles.cardsLength]}>
              {filteredFlashcards.length} flashcards
            </Text>
          }
        />
      )}
      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        buttons={[
          {title: 'Confirm', onPress: handleRemoveDictionary},
          {title: 'Cancel', onPress: closeModal, outline: true},
        ]}>
        <Text style={[styles.textCentre, styles.confirmText]}>
          Are you sure you want to delete this dictionary and all its contents?
        </Text>
      </Modal>
    </ToolsLayout>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  innerContainer: {
    padding: 16,
  },
  textCentre: {
    textAlign: 'center',
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  heading: {
    fontSize: 16,
  },
  subheading: {
    fontSize: 14,
  },
  cardsLength: {
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  confirmText: {
    marginBottom: 8,
  },
});

export default DictionaryPage;
