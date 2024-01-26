import React, {ReactNode, useContext} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

import {ButtonProps} from '../../types/button';
import {Button} from '../elements';

import {ThemeContext} from '../../context/ThemeContext';

type ToolsLayoutProps = {
  children: ReactNode;
  buttons: ButtonProps[];
  style?: ViewStyle;
  searchBar?: ReactNode;
};

const ToolsLayout: React.FC<ToolsLayoutProps> = ({
  children,
  buttons,
  style,
  searchBar,
}) => {
  const {themeStyles} = useContext(ThemeContext);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.children}>{children}</View>
      <View
        style={[
          themeStyles.backgroundPrimary,
          themeStyles.borderNeutral,
          styles.tools,
        ]}>
        {searchBar && (
          <View style={styles.searchBarContainer}>{searchBar}</View>
        )}
        {buttons.map((button, index) => (
          <Button
            key={`button-${index}`}
            title={button.title}
            onPress={button.onPress}
            outline={button.outline}
            disabled={button.disabled}
            fullWidth
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    maxHeight: '100%',
  },
  children: {
    flex: 1,
  },
  tools: {
    display: 'flex',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
  },
  searchBarContainer: {
    width: '100%',
  },
});

export default ToolsLayout;
