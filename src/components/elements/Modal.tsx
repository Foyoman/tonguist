import React, {ReactNode, useContext} from 'react';
import {Modal as NativeModal, StyleSheet, View, ViewStyle} from 'react-native';
import {ButtonProps} from '../../types/button';
import {ThemeContext} from '../../context/ThemeContext';
import {Button} from '.';

interface ModalProps {
  children?: ReactNode;
  buttons: ButtonProps[];
  visible: boolean;
  onRequestClose: () => void;
  style?: ViewStyle;
}

export const Modal = ({
  children,
  buttons,
  visible,
  onRequestClose,
  style,
}: ModalProps) => {
  const {themeStyles} = useContext(ThemeContext);

  return (
    <NativeModal
      style={style}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.modalBackground}>
        <View style={styles.centeredView}>
          <View style={[themeStyles.backgroundPrimary, styles.modalView]}>
            <View>{children}</View>
            <View style={styles.modalButtons}>
              {buttons.map((button, index) => (
                <Button
                  style={styles.modalButton}
                  key={`button-${index}`}
                  title={button.title}
                  onPress={button.onPress}
                  outline={button.outline}
                  disabled={button.disabled}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </NativeModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    display: 'flex',
    margin: 20,
    borderRadius: 6,
    padding: 16,
    width: 300,
    gap: 8,
  },
  modalButtons: {
    width: '100%',
    display: 'flex',
    gap: 8,
  },
  modalButton: {
    width: '100%',
  },
});
