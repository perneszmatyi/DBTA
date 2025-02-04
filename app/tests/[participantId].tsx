import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import Header from '@/components/navigation/Header';
import { useTestContext } from '@/context/TestContext';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from '@/components/LoadingScreen';

import ReactionTimeTest from './testModules/reactionTimeTest';
import MemoryTest from './testModules/memoryTest';
import BalanceTest from './testModules/balanceTest';
import ChoiceTest from './testModules/choiceTest';
const tests = [
  { name: 'Reaction Time', component: ReactionTimeTest },
  { name: 'Memory', component: MemoryTest },
  { name: 'Balance', component: BalanceTest },
  { name: 'Choice', component: ChoiceTest },
];

export default function TestScreen() {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const { participantId } = useLocalSearchParams();
  const { 
    saveResults, 
    clearResults, 
    updateReactionResults, 
    updateMemoryResults, 
    updateBalanceResults, 
    updateChoiceResults,
    isSaving
  } = useTestContext();

  const handleQuitTest = () => {
    Alert.alert(
      "Quit Test",
      "Are you sure you want to quit? All progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Quit", 
          style: "destructive",
          onPress: () => {
            clearResults();
            router.replace(`/participants/${participantId}`);
          }
        }
      ]
    );
  };

  const handleTestComplete = (results: any) => {
    const currentTest = tests[currentTestIndex].name;
    switch(currentTest) {
      case 'Reaction Time':
        updateReactionResults(results);
        break;
      case 'Memory':
        updateMemoryResults(results);
        break;
      case 'Balance':
        updateBalanceResults(results);
        break;
      case 'Choice':
        updateChoiceResults(results);
        break;
    }
    
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      setTestFinished(true);
    }
  };

  const TestsCompletionView = () => {
    const handleSave = async () => {
      try {
        await saveResults(participantId as string);
        router.replace(`/participants/${participantId}`);
      } catch (error) {
        console.error('Error saving test results:', error);
        Alert.alert('Error', 'Failed to save test results. Please try again.');
      }
    };

    const handleLeave = () => {
      Alert.alert(
        "Leave Without Saving",
        "Are you sure? All test results will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Leave",
            style: "destructive", 
            onPress: () => {
              clearResults();
              router.replace(`/participants/${participantId}`);
            }
          }
        ]
      );
    };

    if (isSaving) {
      return <LoadingScreen message="Saving test results..." />;
    }

    return (
      <View className="flex-1 justify-center items-center p-4">
        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
        </View>
        <Text className="text-2xl font-bold mb-8">Tests Complete!</Text>

        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary-500 py-4 px-8 rounded-lg mb-4"
          >
            <Text className="text-white text-center font-medium">Save Results</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLeave}
            className="py-4 px-8 rounded-lg border border-red-500"
          >
            <Text className="text-red-500 text-center font-medium">Leave Without Saving</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CurrentTest = tests[currentTestIndex].component;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <Stack.Screen 
        options={{
          gestureEnabled: false,  // Disable back gesture
          headerShown: false,     // Hide header
          animation: 'none'       // Disable animation
        }} 
      />
      {testFinished ? (
        <TestsCompletionView />
      ) : (
        <>
          <Header
            title={tests[currentTestIndex].name}
            path={() => router.replace(`/participants/${participantId}`)}
            showBack={false}
            testProgress={{
              current: currentTestIndex + 1,
              total: tests.length
            }}
            rightElement={
              <TouchableOpacity onPress={handleQuitTest} className="py-2 px-4">
                <Text className="text-red-500 font-medium">Quit</Text>
              </TouchableOpacity>
            }
          />
          <CurrentTest onComplete={handleTestComplete} />
        </>
      )}
    </SafeAreaView>
  );
}