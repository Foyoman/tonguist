import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {MD3Colors} from 'react-native-paper';

import {ButtonProps} from '../../types/button';

export const Button = ({
  title,
  onPress,
  children,
  style,
  fullWidth,
  outline,
  disabled,
}: ButtonProps) => {
  const {themeStyles} = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={disabled ? () => null : onPress}>
      <View
        style={[
          outline
            ? {...themeStyles.borderTertiary, ...styles.outline}
            : {
                ...themeStyles.backgroundTertiary,
                ...themeStyles.borderTertiary,
              },
          disabled && styles.disabled,
          styles.container,
          style,
          fullWidth && styles.fullWidth,
        ]}>
        {children || (
          <Text
            style={[styles.buttonText, outline && themeStyles.textTertiary]}>
            {fullWidth ? title?.toUpperCase() : title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  outline: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: MD3Colors.neutral100,
    fontWeight: '500',
  },
  fullWidth: {
    width: '100%',
    paddingVertical: 8,
  },
});
