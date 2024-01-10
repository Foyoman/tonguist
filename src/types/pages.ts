import {Flashcard} from './flashcard';

export type RootStackParamList = {
  Home: undefined; // No parameters expected for Home
  Details: {flashcard: Flashcard}; // DetailsPage expects a flashcard parameter
  Edit: {flashcard?: Flashcard}; // EditPage might receive an optional flashcard parameter
  Learn: undefined; // No parameters expected for Learn
  Dictionary: undefined; // No parameters expected for Dictionary
  // ... other screens
};
