import {StackNavigationProp} from '@react-navigation/stack';
import {Flashcard} from './flashcard';

export type RootStackParamList = {
  Home: undefined; // No parameters expected for Home
  Details: {flashcard: Flashcard}; // DetailsPage expects a flashcard parameter
  Edit: {flashcard?: Flashcard}; // EditPage might receive an optional flashcard parameter
  Learn: undefined; // No parameters expected for Learn
  Dictionary: undefined; // No parameters expected for Dictionary
  Dictionaries: undefined;
  Progress: undefined;
};

type LearnPageNavigationProp = StackNavigationProp<RootStackParamList, 'Learn'>;
export type LearnPageProps = {
  navigation: LearnPageNavigationProp;
};

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'Learn'>;
export type HomePageProps = {
  navigation: HomePageNavigationProp;
};
