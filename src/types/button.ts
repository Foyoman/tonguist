import {StyleProp, ViewStyle} from 'react-native';

export interface ButtonProps {
  title?: string;
  onPress?: () => any;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  outline?: boolean;
  disabled?: boolean;
}
