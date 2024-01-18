import React, {useContext} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {MD3Colors} from 'react-native-paper';

interface ButtonProps {
  title?: string;
  onPress?: () => any;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  outline?: boolean;
  disabled?: boolean;
}

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
            : themeStyles.backgroundTertiary,
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
  },
  outline: {
    borderWidth: 1,
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
