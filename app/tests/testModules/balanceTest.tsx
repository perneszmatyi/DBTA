import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TestIntro from '@/components/TestIntro';

type BalanceTestProps = {
  onComplete: (results: {
    averageDeviation: number;
    maxDeviation: number;
    testDuration: number;
  }) => void;
};

const BalanceTest = ({ onComplete }: BalanceTestProps) => {
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [testFinished, setTestFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted) {
      setTestFinished(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [testStarted, timeLeft]);

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(10);
    setTestFinished(false);
    // TODO: Start accelerometer data collection
  };

  const handleComplete = () => {
    onComplete({
      averageDeviation: 0,
      maxDeviation: 0,
      testDuration: 10
    });
  };

  if (testFinished) {
    return (
      <View className="flex-1 bg-neutral-50 items-center justify-center px-6">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
          </View>
          <Text className="text-2xl font-semibold text-neutral-900 text-center mb-2">
            Test Completed!
          </Text>
          <Text className="text-neutral-500 text-center">
            Great job staying still
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleComplete}
          className="bg-primary-500 py-4 px-6 rounded-lg shadow-sm w-full"
        >
          <Text className="text-white font-semibold text-lg text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!testStarted) {
    return (
      <TestIntro
        title="Balance Test"
        description="Test your postural stability and balance control"
        instructions={[
          "Stand with your feet together",
          "Hold your phone flat against your chest",
          "Stay as still as possible for 10 seconds",
          "Try not to sway or move during the test"
        ]}
        onStart={startTest}
      />
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 items-center justify-center px-6">
      {/* Status */}
      <View className="items-center mb-12">
        <Text className="text-2xl font-semibold text-neutral-900 mb-2">
          Stay Still
        </Text>
        <Text className="text-neutral-500 text-center">
          Hold this position
        </Text>
      </View>

      {/* Timer */}
      <View className="w-32 h-32 rounded-full bg-white shadow-sm items-center justify-center mb-12">
        <Text className="text-5xl font-bold text-primary-500">
          {timeLeft}
        </Text>
        <Text className="text-neutral-500 mt-1">
          seconds
        </Text>
      </View>

      {/* Instructions */}
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <View className="flex-row items-center">
          <Ionicons name="information-circle" size={24} color="#6B7280" />
          <Text className="text-neutral-600 ml-2">
            Keep the phone steady against your chest
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BalanceTest;
