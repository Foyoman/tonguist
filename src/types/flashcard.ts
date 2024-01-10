// import {
//   NativeSyntheticEvent,
//   TextInputSubmitEditingEventData,
// } from 'react-native';

export interface Flashcard {
  targetPhrase: string;
  targetSentence: string;
  grammarClasses: string[];
  translatedPhrase: string;
  translatedSentence: string;
  progress: number;
}

export interface FlashcardComponent {
  flashcard: Flashcard;
  progressGoal?: number;
  correct?: boolean;
  incorrect?: boolean;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  handleSubmit?: () => void;
  autoFocus?: boolean;
}
