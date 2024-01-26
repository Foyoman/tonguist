import React, {createContext, useState, useEffect, ReactNode} from 'react';
import * as appStorage from '../utils/appStorage';

type AppContextType = {
  selectedDictionary: string | null;
  setSelectedDictionary: (name: string) => Promise<void>;
  addDictionary: (name: string) => Promise<void>;
  removeDictionary: (name: string) => Promise<void>;
  goal: number;
  setGoal: (goal: number) => Promise<void>;
};

const defaultValue: AppContextType = {
  selectedDictionary: null,
  setSelectedDictionary: appStorage.setSelectedDictionary,
  addDictionary: appStorage.addDictionary,
  removeDictionary: appStorage.removeDictionary,
  goal: 50,
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

  const setGoal = async (newGoal: number) => {
    await appStorage.setGoal(newGoal); // Save goal to storage
    setGoalState(newGoal); // Update local state
  };

  useEffect(() => {
    const init = async () => {
      const storedSelectedDictionary = await appStorage.getSelectedDictionary();
      const storedGoal = await appStorage.fetchGoal(); // Get goal from storage

      if (storedSelectedDictionary) {
        setSelectedDictionaryState(storedSelectedDictionary);
      }
      if (storedGoal !== null) {
        setGoalState(storedGoal); // Initialize goal state
      }
    };
    init();
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedDictionary,
        setSelectedDictionary,
        addDictionary,
        removeDictionary,
        goal,
        setGoal,
      }}>
      {children}
    </AppContext.Provider>
  );
};
