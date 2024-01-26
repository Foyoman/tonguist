import React, {useContext} from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {MD3Colors} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ThemeContext} from '../../context/ThemeContext';

type SortButtonProps = {
  onPress: () => any;
  style?: StyleProp<ViewStyle>;
};

export const SortButton = ({onPress, style}: SortButtonProps) => {
  const {theme} = useContext(ThemeContext);

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Icon
        name="sort-amount-asc"
        size={20}
        color={theme === 'light' ? MD3Colors.neutral0 : MD3Colors.neutral100}
      />
    </TouchableOpacity>
  );
};
