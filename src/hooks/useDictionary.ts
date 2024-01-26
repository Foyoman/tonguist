import {useContext} from 'react';
import {AppContext} from '../context/AppContext';

export const useDictionary = () => {
  return useContext(AppContext);
};
