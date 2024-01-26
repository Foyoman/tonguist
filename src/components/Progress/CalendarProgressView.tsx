import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Calendar, DateData} from 'react-native-calendars';
import {Progress} from '../../types';
import {AppContext} from '../../context/AppContext';
import {ThemeContext} from '../../context/ThemeContext';
import {Theme} from 'react-native-calendars/src/types';
import {MD3Colors} from 'react-native-paper';
import {StyleSheet, Text, View} from 'react-native';
import {useProgress} from '../../hooks/useProgress';

type MarkedDatesType = {
  [key: string]: {
    marked: boolean;
    selected: boolean;
    color: string;
    startingDay: boolean;
    endingDay: boolean;
  };
};

export const CalendarProgressView = () => {
  const {goal} = useContext(AppContext);
  const {themeStyles, theme} = useContext(ThemeContext);
  const {fetchMonthlyProgressData, getTodayDateString} = useProgress();
  const [monthlyProgress, setMonthlyProgress] = useState<Progress[]>([]);
  const [selectedProgress, setSelectedProgress] = useState<Progress>();

  const today = getTodayDateString();
  const findProgress = (date: string, progressData: Progress[]): Progress => {
    const foundProgress = progressData.find(
      (progress: Progress) => progress.date === date,
    );
    if (foundProgress) {
      return foundProgress;
    } else {
      return {
        date,
        cardsCompleted: 0,
        correctAttempts: 0,
      };
    }
  };

  useEffect(() => {
    const getMonthlyProgress = async () => {
      const date = new Date();
      const progress = await fetchMonthlyProgressData(
        date.getFullYear(),
        date.getMonth(),
      );
      setMonthlyProgress(progress);
      setSelectedProgress(findProgress(today, progress));
    };

    getMonthlyProgress();
  }, [fetchMonthlyProgressData, today]);

  const primaryColor =
    theme === 'light' ? 'rgba(154, 130, 219, 1)' : 'rgba(182, 157, 248, 1)';
  // Convert monthlyProgress to a format suitable for the calendar
  const markedDates = monthlyProgress.reduce(
    (acc: MarkedDatesType, progress) => {
      if (progress.cardsCompleted >= goal) {
        acc[progress.date] = {
          marked: true,
          selected: true,
          color: primaryColor,
          startingDay: true,
          endingDay: true,
        };
      }
      return acc;
    },
    {},
  );

  const [visibleMonth, setVisibleMonth] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Compute whether the visible month is the current month for efficient re-renders
  const isCurrentMonthVisible = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1 for 1-12
    const currentYear = new Date().getFullYear();
    return (
      visibleMonth.month === currentMonth && visibleMonth.year === currentYear
    );
  }, [visibleMonth]);

  // Handle changes in the visible month
  const handleVisibleMonthsChange = useCallback((months: DateData[]) => {
    // Assuming only one month is visible at a time, take the first month from the array
    const {month, year} = months[0];
    setVisibleMonth({month, year});
  }, []);

  const handleOnDayPress = (day: DateData) => {
    const foundProgress = findProgress(day.dateString, monthlyProgress);
    setSelectedProgress(foundProgress);
  };

  return (
    <View>
      <Calendar
        markingType={'period'}
        style={[themeStyles.calendar, styles.calendar]}
        theme={theme === 'light' ? lightTheme : darkTheme}
        markedDates={markedDates}
        maxDate={today}
        disableArrowRight={isCurrentMonthVisible}
        onVisibleMonthsChange={handleVisibleMonthsChange}
        onDayPress={handleOnDayPress}
        disableAllTouchEventsForDisabledDays
        disableAllTouchEventsForInactiveDays
        enableSwipeMonths
      />
      {selectedProgress && (
        <View>
          <Text>
            Selected progress: {JSON.stringify(selectedProgress, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 16,
  },
});

const lightTheme: Theme = {
  monthTextColor: MD3Colors.neutral0,
  todayTextColor: MD3Colors.neutral20,
  backgroundColor: MD3Colors.neutral90,
  disabledArrowColor: MD3Colors.neutral70,
  arrowColor: MD3Colors.primary60,
  calendarBackground: MD3Colors.neutral90,
  dayTextColor: MD3Colors.neutral20,
  textDisabledColor: MD3Colors.neutral70,
  indicatorColor: MD3Colors.primary60,
  dotColor: MD3Colors.neutral0,
  textSectionTitleColor: MD3Colors.neutral20,
};

const darkTheme: Theme = {
  monthTextColor: MD3Colors.neutral100,
  todayTextColor: MD3Colors.neutral80,
  backgroundColor: MD3Colors.neutral10,
  disabledArrowColor: MD3Colors.neutral30,
  arrowColor: MD3Colors.primary70,
  calendarBackground: MD3Colors.neutral10,
  dayTextColor: MD3Colors.neutral80,
  textDisabledColor: MD3Colors.neutral30,
  indicatorColor: MD3Colors.primary70,
  dotColor: MD3Colors.neutral100,
  textSectionTitleColor: MD3Colors.neutral80,
};
