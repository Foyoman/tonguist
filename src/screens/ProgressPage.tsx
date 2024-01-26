import React from 'react';
import {CalendarProgressView} from '../components/Progress';
import {StyleSheet, View} from 'react-native';

const ProgressPage = () => {
  return (
    <View style={styles.container}>
      <CalendarProgressView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default ProgressPage;
