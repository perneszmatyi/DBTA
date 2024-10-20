import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import ReactionTimeTest from './testModules/reactionTimeTest';
import MemoryTest from './testModules/memoryTest';
import BalanceTest from './testModules/balanceTest';
import AttentionTest from './testModules/attentionTest';
import ImpulseControlTest from './testModules/impulseControlTest';

const tests = [
  { name: 'Reaction Time', component: ReactionTimeTest },
  { name: 'Memory', component: MemoryTest },
  { name: 'Balance', component: BalanceTest },
  { name: 'Attention', component: AttentionTest },
  { name: 'Impulse Control', component: ImpulseControlTest },
];

export default function TestController() {
  const { participantId } = useLocalSearchParams();
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [testCompleted, setTestCompleted] = useState(false);

  const startNextTest = () => {
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handleTestComplete = (testName: string, results: any) => {
    // Here you would typically save the results
    console.log(`Test ${testName} completed with results:`, results);
    startNextTest();
  };

  const CurrentTest = currentTestIndex >= 0 ? tests[currentTestIndex].component : null;

  if (testCompleted) {
    return (
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">All Tests Completed</Text>
        <TouchableOpacity
          onPress={() => router.push(`/participants/${participantId}`)}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-bold">Return to Participant</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (currentTestIndex === -1) {
    return (
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">Cognitive Test Battery</Text>
        <Text className="mb-4">You are about to start a series of 5 cognitive tests. Each test will measure different aspects of your cognitive abilities.</Text>
        <TouchableOpacity
          onPress={startNextTest}
          className="bg-green-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-bold">Start Tests</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  console.log(tests[currentTestIndex].name);
  return (

    <View className="flex-1">
      <Text className="text-xl font-bold p-4">{tests[currentTestIndex].name} Test</Text>
      {CurrentTest && (
        <CurrentTest
          onComplete={() => handleTestComplete(tests[currentTestIndex].name, {})}
        />
      )}
    </View>
  );
}
