import React from 'react';
import {View} from 'react-native';
import FlashCard from '../components/FlashCard';

const LearnPage = () => {
  return (
    <View>
      <FlashCard
        targetPhrase="simplemente"
        targetSentence="Quiero mucho mucho mucho mucho simplemente contigo contigo contigo contigos sdf sdf sdf"
        grammarClasses={['verb', 'gerund']}
        translatedPhrase="dance"
        translatedSentence="I want to dance with you"
      />
    </View>
  );
};

export default LearnPage;
