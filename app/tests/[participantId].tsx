import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Header from '@/components/navigation/Header';
import { useTestContext } from '@/context/TestContext';

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
  const { saveResults, clearResults } = useTestContext();

  const handleQuitTest = () => {
    Alert.alert(
      "Quit Test",
      "Are you sure you want to quit? All progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => {
            clearResults();
            router.push(`/participants/${participantId}`);
          }
        }
      ]
    );
  };

  const handleTestComplete = async (results: any) => {
    if (currentTestIndex < tests.length - 1) {
      // Move to next test
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      // All tests completed, save results
      try {
        await saveResults(participantId as string);
        router.push(`/participants/${participantId}`);
      } catch (error) {
        console.error('Error saving test results:', error);
        Alert.alert('Error', 'Failed to save test results. Please try again.');
      }
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