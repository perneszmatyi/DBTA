import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Header from '@/components/navigation/Header';

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
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const { participantId } = useLocalSearchParams();

  const handleQuitTest = () => {
    router.push(`/participants/${participantId}`);
  };

  const handleTestComplete = (results: any) => {
    console.log('Test results:', results);

    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      router.push(`/participants/${participantId}`);
    }
  };

  const CurrentTest = tests[currentTestIndex].component;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <Header
        title={tests[currentTestIndex].name}
        path={() => router.replace(`/participants/${participantId}`)}
        showBack={false}
        testProgress={{
          current: currentTestIndex + 1,
          total: tests.length
        }}
        rightElement={
          <TouchableOpacity 
            onPress={handleQuitTest}
            className="py-2 px-4"
          >
            <Text className="text-red-500 font-medium">Quit</Text>
          </TouchableOpacity>
        }
      />
      <CurrentTest onComplete={handleTestComplete} />
    </SafeAreaView>
  );
}