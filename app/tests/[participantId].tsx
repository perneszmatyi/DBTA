import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import ReactionTimeTest from './testModules/reactionTimeTest';
import MemoryTest from './testModules/memoryTest';
import BalanceTest from './testModules/balanceTest';
import TrackingTest from './testModules/trackingTest';

const tests = [
  { name: 'Reaction Time', component: ReactionTimeTest },
  { name: 'Memory', component: MemoryTest },
  { name: 'Balance', component: BalanceTest },
  { name: 'Tracking', component: TrackingTest },
];

export default function TestScreen() {
  const [currentTestIndex, setCurrentTestIndex] = useState(1);
  const { participantId } = useLocalSearchParams();

  const handleTestComplete = (results: any) => {
    // Save results here
    console.log('Test results:', results);

    if (currentTestIndex < tests.length - 1) {
      // Move to next test
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      // All tests completed
      router.push(`/participants/${participantId}`);
    }
  };

  const CurrentTest = tests[currentTestIndex].component;

  return (
    <View className="flex-1">
      <CurrentTest onComplete={handleTestComplete} />
    </View>
  );
}
