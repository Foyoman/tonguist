import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Modal, ScrollView, Text} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ThemeContext} from '../../context/ThemeContext';
import {Button} from '../../components/elements';
import {useDictionary} from '../../hooks/useDictionary';
import {fetchDictionaryNames} from '../../services/dictionaryService';
import {TextInput} from 'react-native-gesture-handler';
import {MD3Colors} from 'react-native-paper';
import {RootStackParamList} from '../../types';

type DictionariesPageProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Dictionaries'>;
};

const DictionariesPage: React.FC<DictionariesPageProps> = ({navigation}) => {
  const {themeStyles, theme} = useContext(ThemeContext);
  const {
    // selectedDictionary,
    setSelectedDictionary,
    addDictionary,
    // removeDictionary,
  } = useDictionary(); // Using custom hook
  const [dictionaryNames, setDictionaryNames] = useState<Array<string>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDictionaryName, setNewDictionaryName] = useState('');

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleSaveDictionary = async () => {
    await addDictionary(newDictionaryName);
    await fetchData();
    closeModal();
    setNewDictionaryName('');
    navigation.navigate('Dictionary');
  };

  // const handleRemoveDictionary = async (name: string) => {
  //   await removeDictionary(name);
  //   fetchData();
  // };

  const handleSelectDictionary = (dictionaryName: string) => {
    setSelectedDictionary(dictionaryName);
    navigation.navigate('Dictionary');
  };

  const fetchData = async () => {
    const storedDictionaryNames = await fetchDictionaryNames();
    if (storedDictionaryNames) {
      console.log(storedDictionaryNames);
      setDictionaryNames(storedDictionaryNames);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.dictionariesContainer}>
          {!dictionaryNames.length ? (
            <Text style={[themeStyles.textSecondary, styles.noDictionaries]}>
              Create a dictionary to get started
            </Text>
          ) : (
            dictionaryNames.map(dictionaryName => (
              <Button
                key={dictionaryName}
                title={dictionaryName}
                onPress={() => handleSelectDictionary(dictionaryName)}
                fullWidth
                outline
              />
            ))
          )}
        </View>
      </ScrollView>
      <View style={[themeStyles.backgroundPrimary, styles.tools]}>
        <Button title="Create dictionary" fullWidth onPress={openModal} />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.centeredView}>
            <View style={[themeStyles.backgroundPrimary, styles.modalView]}>
              <TextInput
                style={[themeStyles.input, styles.input]}
                autoFocus
                placeholder="Dictionary name"
                placeholderTextColor={
                  theme === 'light' ? MD3Colors.neutral30 : MD3Colors.neutral70
                }
                value={newDictionaryName}
                onChangeText={setNewDictionaryName}
              />
              <View style={styles.buttons}>
                <Button
                  style={styles.button}
                  title="Save"
                  onPress={handleSaveDictionary}
                />
                <Button
                  style={styles.button}
                  title="Cancel"
                  onPress={closeModal}
                  outline
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
  },
  dictionariesContainer: {
    flex: 1,
    padding: 10,
    gap: 8,
  },
  noDictionaries: {
    marginTop: 16,
    textAlign: 'center',
  },
  tools: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    display: 'flex',
    margin: 20,
    // backgroundColor: 'white',
    borderRadius: 6,
    padding: 16,
    // alignItems: 'flex-start',
    // width: '100%',
    width: 300,
    gap: 8,
  },
  input: {
    // paddingVertical: 2,
    // alignContent: 'center',
    // alignItems: 'center',
    // textAlignVertical: 'center',
    // borderRadius: 5,
    // paddingHorizontal: 8,
    // fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  buttons: {
    width: '100%',
    // flexDirection: 'row',
    // flexGrow: 1,
    display: 'flex',
    gap: 8,
  },
  button: {
    // flexGrow: 1,
    width: '100%',
  },
  // ... other styles
});

export default DictionariesPage;
