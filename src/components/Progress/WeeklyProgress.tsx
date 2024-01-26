import React, {useCallback, useContext, useState} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Progress} from '../../types';
import {useProgress} from '../../hooks/useProgress';
import {Checkbox, MD3Colors} from 'react-native-paper';
import {AppContext} from '../../context/AppContext';
import {ThemeContext} from '../../context/ThemeContext';
import {useFocusEffect} from '@react-navigation/native';

interface WeeklyProgressProps {
  style?: StyleProp<ViewStyle>;
}

export const WeeklyProgress = ({style}: WeeklyProgressProps) => {
  const {fetchWeeklyProgressData} = useProgress();
  const [weeklyProgress, setWeeklyProgress] = useState<Progress[]>([]);
  const {goal} = useContext(AppContext);
  const {themeStyles, theme} = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const getWeeklyProgress = async () => {
        const progress = await fetchWeeklyProgressData();
        setWeeklyProgress(progress);
      };

      getWeeklyProgress();
    }, [fetchWeeklyProgressData]),
  );

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    const formattedDateString = `${day}/${month}`;
    return formattedDateString;
  };

  return (
    <View style={[styles.container, style]}>
      {weeklyProgress.map((progress: Progress, index) => (
        <View style={styles.checkbox} key={index}>
          <Checkbox
            color={
              theme === 'light' ? MD3Colors.primary60 : MD3Colors.primary70
            }
            status={
              progress.cardsCompleted
                ? progress.cardsCompleted >= goal
                  ? 'checked'
                  : 'indeterminate'
                : 'unchecked'
            }
          />
          <Text style={[themeStyles.textSecondary, styles.checkboxText]}>
            {index === weeklyProgress.length - 1
              ? 'Today'
              : formatDate(progress.date)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 12,
  },
});
