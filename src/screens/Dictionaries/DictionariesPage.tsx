import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ThemeContext} from '../../context/ThemeContext';
import {Button, Modal} from '../../components/elements';
import {useDictionary} from '../../hooks/useDictionary';
import {fetchDictionaryNames} from '../../services/dictionaryService';
import {TextInput} from 'react-native-gesture-handler';
import {MD3Colors} from 'react-native-paper';
import {RootStackParamList} from '../../types';
import ToolsLayout from '../../components/layout/ToolsLayout';

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
      setDictionaryNames(storedDictionaryNames);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ToolsLayout buttons={[{title: 'Create dictionary', onPress: openModal}]}>
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

      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        buttons={[
          {title: 'Save', onPress: handleSaveDictionary},
          {title: 'Cancel', onPress: closeModal, outline: true},
        ]}>
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
      </Modal>
    </ToolsLayout>
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
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});

export default DictionariesPage;
