import React, {useContext} from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {MD3Colors} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ThemeContext} from '../../context/ThemeContext';

type DeleteButtonProps = {
  onPress: () => any;
  style?: StyleProp<ViewStyle>;
};

export const DeleteButton = ({onPress, style}: DeleteButtonProps) => {
  const {theme} = useContext(ThemeContext);

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Icon
        name="trash-o"
        size={24}
        color={theme === 'light' ? MD3Colors.error50 : MD3Colors.error60}
      />
    </TouchableOpacity>
  );
};
