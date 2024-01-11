import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList} from '../types/pages';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {ThemeContext} from '../context/ThemeContext';

import Flashcard from '../components/Flashcard';
import {Flashcard as FlashcardType} from '../types';

type DetailsPageProps = {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: StackNavigationProp<RootStackParamList, 'Details'>;
};

const DetailsPage: React.FC<DetailsPageProps> = ({route, navigation}) => {
  const {flashcard} = route.params;

  const handleEdit = () => {
    navigation.navigate('Edit', {flashcard});
  };

  const handleDelete = async () => {
    try {
      const existingDictionary = await AsyncStorage.getItem('dictionary');
      let dictionary = existingDictionary ? JSON.parse(existingDictionary) : [];

      // Filter out the flashcard to delete
      const updatedDictionary = dictionary.filter(
        (item: FlashcardType) => item.targetPhrase !== flashcard.targetPhrase,
      );

      // Save the updated dictionary
      await AsyncStorage.setItem(
        'dictionary',
        JSON.stringify(updatedDictionary),
      );

      // Navigate back to the Dictionary page
      navigation.navigate('Dictionary');
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <Flashcard flashcard={flashcard} autoFocus={false} incorrect />
      {/* Display other details of the flashcard */}
      <View style={styles.buttons}>
        <Button title="Edit" onPress={handleEdit} />
        <Button title="Delete" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttons: {
    display: 'flex',
    gap: 10,
  },
});

export default DetailsPage;
