// /src/hooks/useDictionary.ts
import {useContext} from 'react';
import {DictionaryContext} from '../context/DictionaryContext';

export const useDictionary = () => {
  return useContext(DictionaryContext);
};
