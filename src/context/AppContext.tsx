import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import * as appStorage from '../utils/appStorage';

type AppContextType = {
  selectedDictionary: string | null;
  setSelectedDictionary: (name: string) => Promise<void>;
  addDictionary: (name: string) => Promise<void>;
  removeDictionary: (name: string) => Promise<void>;
  goal: number;
  fetchGoal: () => Promise<number | void>;
  setGoal: (goal: number) => Promise<void>;
};

const defaultValue: AppContextType = {
  selectedDictionary: null,
  setSelectedDictionary: appStorage.setSelectedDictionary,
  addDictionary: appStorage.addDictionary,
  removeDictionary: appStorage.removeDictionary,
  goal: 50,
  fetchGoal: appStorage.fetchGoal,
  setGoal: appStorage.setGoal, // Function to set goal in storage
};

export const AppContext = createContext<AppContextType>(defaultValue);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({children}: AppProviderProps) => {
  const [selectedDictionary, setSelectedDictionaryState] = useState<
    string | null
  >(null);
  const [goal, setGoalState] = useState<number>(defaultValue.goal);

  const setSelectedDictionary = async (name: string) => {
    await appStorage.setSelectedDictionary(name);
    setSelectedDictionaryState(name);
  };

  const addDictionary = async (name: string) => {
    await appStorage.addDictionary(name);
    setSelectedDictionaryState(name);
  };

  const removeDictionary = async (name: string) => {
    await appStorage.removeDictionary(name);
    setSelectedDictionary('');
  };

  const fetchGoal = useCallback(async () => {
    if (!selectedDictionary) {
      return;
    }

    const storedGoal = await appStorage.fetchGoal(selectedDictionary);
    if (!storedGoal) {
      const defaultGoal = 50;
      await appStorage.setGoal(defaultGoal, selectedDictionary);
      return defaultGoal;
    } else {
      setGoalState(storedGoal);
      return storedGoal;
    }
  }, [selectedDictionary]);

  const setGoal = async (newGoal: number) => {
    if (!selectedDictionary) {
      return;
    }

    await appStorage.setGoal(newGoal, selectedDictionary); // Save goal to storage
    setGoalState(newGoal); // Update local state
  };

  useEffect(() => {
    const init = async () => {
      const storedSelectedDictionary = await appStorage.getSelectedDictionary();
      const storedGoal = await fetchGoal(); // Get goal from storage

      if (storedSelectedDictionary) {
        setSelectedDictionaryState(storedSelectedDictionary);
      }
      if (storedGoal) {
        setGoalState(storedGoal); // Initialize goal state
      }
    };
    init();
  }, [fetchGoal]);

  return (
    <AppContext.Provider
      value={{
        selectedDictionary,
        setSelectedDictionary,
        addDictionary,
        removeDictionary,
        goal,
        fetchGoal,
        setGoal,
      }}>
      {children}
    </AppContext.Provider>
  );
};
