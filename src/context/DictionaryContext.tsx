// /src/context/DictionaryContext.tsx
import React, {createContext, useState, useEffect, ReactNode} from 'react';
import * as dictionaryStorage from '../utils/dictionaryStorage';

type DictionaryContextType = {
  selectedDictionary: string | null;
  setSelectedDictionary: (name: string) => Promise<void>;
  addDictionary: (name: string) => Promise<void>;
  removeDictionary: (name: string) => Promise<void>;
};

const defaultValue: DictionaryContextType = {
  selectedDictionary: null,
  setSelectedDictionary: dictionaryStorage.setSelectedDictionary,
  addDictionary: dictionaryStorage.addDictionary,
  removeDictionary: dictionaryStorage.removeDictionary,
};

export const DictionaryContext =
  createContext<DictionaryContextType>(defaultValue);

type DictionaryProviderProps = {
  children: ReactNode;
};

export const DictionaryProvider = ({children}: DictionaryProviderProps) => {
  const [selectedDictionary, setSelectedDictionaryState] = useState<
    string | null
  >(null);

  const setSelectedDictionary = async (name: string) => {
    await dictionaryStorage.setSelectedDictionary(name);
    setSelectedDictionaryState(name);
  };

  const addDictionary = async (name: string) => {
    await dictionaryStorage.addDictionary(name);
    setSelectedDictionaryState(name);
  };

  const removeDictionary = async (name: string) => {
    await dictionaryStorage.removeDictionary(name);
    setSelectedDictionary('');
  };

  useEffect(() => {
    const init = async () => {
      const selected = await dictionaryStorage.getSelectedDictionary();
      if (selected) {
        console.log('selected', selected);
        setSelectedDictionaryState(selected);
      }
    };
    init();
  }, []);

  return (
    <DictionaryContext.Provider
      value={{
        selectedDictionary,
        setSelectedDictionary,
        addDictionary,
        removeDictionary,
      }}>
      {children}
    </DictionaryContext.Provider>
  );
};
