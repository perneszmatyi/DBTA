import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTestContext } from '@/context/TestContext';
import TestIntro from '@/components/TestIntro';
import TestComplete from '@/components/TestComplete';

type ThreeAxisMeasurement = {
  x: number;
  y: number;
  z: number;
};

const TEST_DURATION = 10000; // 10 seconds in milliseconds
const SAMPLE_RATE = 100; // Sample rate in milliseconds

type AccelerometerReading = ThreeAxisMeasurement & {
  timestamp: number;
};

type BalanceTestProps = {
  onComplete: (results: any) => void;
};

export default function BalanceTest({ onComplete }: BalanceTestProps) {
  const [testState, setTestState] = useState<'intro' | 'countdown' | 'testing' | 'completed'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION / 1000);
  const [readings, setReadings] = useState<AccelerometerReading[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const { updateBalanceResults } = useTestContext();

  // Check accelerometer availability
  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();
    setIsAvailable(isAccelerometerAvailable);
    if (!isAccelerometerAvailable) {
      Alert.alert(
        "Sensor Not Available",
        "The accelerometer sensor is not available on this device. The balance test cannot be performed.",
        [{ text: "OK", onPress: () => onComplete(null) }]
      );
    }
  };

  // Subscribe to accelerometer when test starts
  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;

    const startAccelerometer = async () => {
      try {
        await Accelerometer.setUpdateInterval(SAMPLE_RATE);
        subscription = Accelerometer.addListener(accelerometerData => {
          if (testState === 'testing') {
            const reading: AccelerometerReading = {
              ...accelerometerData,
              timestamp: Date.now()
            };
            setReadings(prev => [...prev, reading]);
          }
        });
      } catch (error) {
        console.error('Error setting up accelerometer:', error);
        Alert.alert(
          "Sensor Error",
          "There was an error accessing the accelerometer. Please try again.",
          [{ text: "OK", onPress: () => onComplete(null) }]
        );
      }
    };

    if (testState === 'testing' && isAvailable) {
      startAccelerometer();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [testState, isAvailable]);

  // Handle countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (testState === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (testState === 'countdown' && countdown === 0) {
      setTestState('testing');
      setTimeLeft(TEST_DURATION / 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown, testState]);

  // Handle test duration
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (testState === 'testing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (testState === 'testing' && timeLeft === 0) {
      handleTestComplete();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, testState]);

  const handleTestComplete = () => {
    if (readings.length === 0) {
      Alert.alert(
        "Test Error",
        "No movement data was recorded. Please try again.",
        [{ text: "OK", onPress: () => onComplete(null) }]
      );
      return;
    }

    // Calculate results
    const deviations = readings.map(reading => 
      Math.sqrt(
        Math.pow(reading.x, 2) + 
        Math.pow(reading.y, 2) + 
        Math.pow(reading.z, 2)
      )
    );

    const results = {
      averageDeviation: deviations.reduce((a, b) => a + b, 0) / deviations.length,
      maxDeviation: Math.max(...deviations),
      testDuration: TEST_DURATION / 1000
    };

    updateBalanceResults(results);
    setTestState('completed');
    onComplete(results);
  };

  const startTest = () => {
    if (!isAvailable) {
      Alert.alert(
        "Cannot Start Test",
        "The accelerometer is not available on this device.",
        [{ text: "OK" }]
      );
      return;
    }
    setTestState('countdown');
    setCountdown(3);
    setReadings([]);
  };

  if (!isAvailable) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 p-4">
        <Ionicons name="warning-outline" size={48} color="#EF4444" />
        <Text className="text-xl text-neutral-900 text-center mt-4">
          Accelerometer Not Available
        </Text>
        <Text className="text-neutral-500 text-center mt-2">
          This device does not support the balance test.
        </Text>
      </View>
    );
  }

  if (testState === 'intro') {
    return (
      <TestIntro
        title="Balance Test"
        description="Hold your phone as still as possible for 10 seconds. Keep your feet together and eyes closed."
        instructions={["Hold your phone as still as possible for 10 seconds.", "Keep your feet together and eyes closed."]}
        onStart={startTest}
      />
    );
  }

  if (testState === 'completed') {
    return (
      <TestComplete
        title="Balance Test Complete"
        message="Great job! Your balance data has been recorded."
        onComplete={() => onComplete(null)}
      />
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-neutral-50 p-4">
      {testState === 'countdown' ? (
        <View className="items-center">
          <Text className="text-6xl font-bold text-primary-500 mb-4">{countdown}</Text>
          <Text className="text-xl text-neutral-600">Get ready...</Text>
        </View>
      ) : (
        <View className="items-center">
          <View className="w-32 h-32 rounded-full bg-primary-100 items-center justify-center mb-8">
            <Text className="text-4xl font-bold text-primary-500">{timeLeft}</Text>
            <Text className="text-neutral-500">seconds</Text>
          </View>
          <Text className="text-xl text-neutral-600 text-center mb-4">
            Stand still with your feet together
          </Text>
          <Text className="text-neutral-500 text-center">
            Keep your eyes closed and try not to move
          </Text>
        </View>
      )}
    </View>
  );
}
