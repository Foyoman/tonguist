import React from 'react';
import {View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Button} from '../../components/elements';

import {RootStackParamList} from '../../types/pages';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Flashcard from '../../components/Flashcard/Flashcard';
import {Flashcard as FlashcardType} from '../../types';

import {ThemeContext} from '../../context/ThemeContext';

type DetailsPageProps = {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: StackNavigationProp<RootStackParamList, 'Details'>;
};

const DetailsPage: React.FC<DetailsPageProps> = ({route, navigation}) => {
  const {flashcard} = route.params;
  const {themeStyles} = React.useContext(ThemeContext);

  const handleEdit = () => {
    navigation.navigate('Edit', {flashcard});
  };

  const handleDelete = async () => {
    try {
      const existingDictionary = await AsyncStorage.getItem('dictionary');
      let dictionary = existingDictionary ? JSON.parse(existingDictionary) : [];

      // Filter out the flashcard to delete
      const updatedDictionary = dictionary.filter(
        (item: FlashcardType) => item.id !== flashcard.id,
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
      <View style={styles.innerContainer}>
        <Flashcard flashcard={flashcard} autoFocus={false} incorrect />
      </View>
      {/* Display other details of the flashcard */}
      <View style={[themeStyles.backgroundPrimary, styles.tools]}>
        <Button title="Edit" onPress={handleEdit} fullWidth />
        <Button title="Delete" onPress={handleDelete} fullWidth />
      </View>
    </View>
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
