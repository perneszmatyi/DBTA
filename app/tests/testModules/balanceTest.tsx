import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTestContext } from '@/context/TestContext';
import TestIntro from '@/components/TestIntro';
import TestComplete from '@/components/TestComplete';
import { testConfig } from "../config/testConfig";

type ThreeAxisMeasurement = {
  x: number;
  y: number;
  z: number;
};

type AccelerometerReading = ThreeAxisMeasurement & {
  timestamp: number;
};

type BalanceTestProps = {
  onComplete: (results: any) => void;
};

export default function BalanceTest({ onComplete }: BalanceTestProps) {
  const [testState, setTestState] = useState<'intro' | 'countdown' | 'testing' | 'completed'>('intro');
  const [countdown, setCountdown] = useState(testConfig.balanceTest.COUNTDOWN);
  const [timeLeft, setTimeLeft] = useState(testConfig.balanceTest.TEST_DURATION / 1000);
  const [readings, setReadings] = useState<AccelerometerReading[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const { updateBalanceResults } = useTestContext();

  // Check accelerometer availability
  useEffect(() => {
    let isMounted = true;
    
    const checkAvailability = async () => {
      const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();
      if (!isMounted) return;

      setIsAvailable(isAccelerometerAvailable);
      if (!isAccelerometerAvailable) {
        // Immediately submit zero results and complete
        const zeroResults = { 
          averageDeviation: 0, 
          maxDeviation: 0, 
          testDuration: 0 
        };
        updateBalanceResults(zeroResults);
        Alert.alert(
          "Sensor Not Available",
          "Balance test skipped - no accelerometer found.",
          [{ text: "OK", onPress: () => onComplete(zeroResults) }]
        );
      }
    };

    checkAvailability();
    return () => { isMounted = false };
  }, []);

  // Subscribe to accelerometer when test starts
  useEffect(() => {
    let isMounted = true;
    let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;

    const startAccelerometer = async () => {
      try {
        await Accelerometer.setUpdateInterval(testConfig.balanceTest.SAMPLE_RATE);
        
        // Only proceed if component is still mounted
        if (!isMounted || testState !== 'testing') return;
        
        subscription = Accelerometer.addListener(accelerometerData => {
          if (isMounted && testState === 'testing') {  // Add mount check
            setReadings(prev => [...prev, {
              ...accelerometerData,
              timestamp: Date.now()
            }]);
          }
        });
      } catch (error) {
        if (isMounted) {  // Only show alert if mounted
          console.error('Sensor setup failed:', error);
          Alert.alert(
            "Sensor Error",
            "Accelerometer access failed. Returning to start.",
            [{
              text: "OK",
              onPress: () => {
                setTestState('intro');  // Reset state
                onComplete(null);  // Exit test flow
              }
            }]
          );
        }
      }
    };

    if (testState === 'testing' && isAvailable) {
      startAccelerometer();
    }

    return () => {
      isMounted = false;  // Flag for cleanup
      subscription?.remove();  // Remove listener
    };
  }, [testState, isAvailable]);

  // Handle countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (testState === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (testState === 'countdown' && countdown === 0) {
      setTestState('testing');
      setTimeLeft(testConfig.balanceTest.TEST_DURATION / 1000);
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
      testDuration: testConfig.balanceTest.TEST_DURATION / 1000
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
    setCountdown(testConfig.balanceTest.COUNTDOWN);
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
