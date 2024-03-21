import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList} from '../../types/pages';

import Flashcard from '../../components/Flashcard/Flashcard';
import {Flashcard as FlashcardType} from '../../types';

import ToolsLayout from '../../components/layout/ToolsLayout';

import {fetchDictionary} from '../../services/dictionaryService';
import {saveDictionary} from '../../utils/appStorage';
import {AppContext} from '../../context/AppContext';

type DetailsPageProps = {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: StackNavigationProp<RootStackParamList, 'Details'>;
};

const DetailsPage: React.FC<DetailsPageProps> = ({route, navigation}) => {
  const {flashcard} = route.params;
  const {selectedDictionary} = useContext(AppContext);

  const handleEdit = () => {
    navigation.navigate('Edit', {flashcard});
  };

  const handleDelete = async () => {
    try {
      if (!selectedDictionary) {
        navigation.navigate('Home');
        return;
      }

      const existingDictionary = await fetchDictionary(selectedDictionary);
      let dictionary = existingDictionary ? existingDictionary : [];

      // Filter out the flashcard to delete
      const updatedDictionary = dictionary.filter(
        (item: FlashcardType) => item.id !== flashcard.id,
      );

      // Save the updated dictionary
      saveDictionary(selectedDictionary, updatedDictionary);

      // Navigate back to the Dictionary page
      navigation.navigate('Dictionary');
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <ToolsLayout
      buttons={[
        {title: 'Edit', onPress: handleEdit},
        {title: 'Delete', onPress: handleDelete, outline: true},
      ]}>
      <View style={styles.innerContainer}>
        <Flashcard flashcard={flashcard} autoFocus={false} incorrect />
      </View>
    </ToolsLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  innerContainer: {
    padding: 16,
  },
  tools: {
    display: 'flex',
    gap: 8,
    padding: 16,
  },
});

export default DetailsPage;
