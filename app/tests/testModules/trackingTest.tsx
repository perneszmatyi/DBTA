import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import TestIntro from '@/components/TestIntro';

type TrackingTestProps = {
  onComplete: (results: {
    averageDeviation: number;
    timeOnTarget: number;
    totalMisses: number;
    completionScore: number;
  }) => void;
};

const TrackingTest = ({ onComplete }: TrackingTestProps) => {
  // Test states
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [testFinished, setTestFinished] = useState(false);

  // Animated values for circle position
  const animatedX = useRef(new Animated.Value(-100)).current;
  const animatedY = useRef(new Animated.Value(-100)).current;

  const animationSpeed = 1500;

  useEffect(() => {
    if (testStarted) {
      // Start the circle movement
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedX, {
            toValue: 100,
            duration: animationSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(animatedY, {
            toValue: 100,
            duration: animationSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(animatedX, {
            toValue: -100,
            duration: animationSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(animatedY, {
            toValue: -100, 
            duration: animationSpeed,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [testStarted, animatedX, animatedY]);

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(20);
    setTestFinished(false);
    // TODO: Start tracking logic
  };

  const handleComplete = () => {
    // TODO: Calculate results
    onComplete({
      averageDeviation: 0,
      timeOnTarget: 0,
      totalMisses: 0,
      completionScore: 0,
    });
  };

  if (testFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Test Completed!</Text>
        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Continue to Next Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!testStarted) {
    return (
      <TestIntro
        title="Tracking Test"
        description="Follow the moving target with your finger"
        instructions={[
          "Place your finger on the circle",
          "Follow it as it moves around the screen",
          "Keep your finger as close to the center as possible",
          "Test will last 20 seconds",
        ]}
        onStart={startTest}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timeLeft}</Text>
      <View style={styles.testArea}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [
                { translateX: animatedX },
                { translateY: animatedY },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const TEST_AREA_SIZE = Math.min(width, height) * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#6b46c1',
  },
  button: {
    backgroundColor: '#6b46c1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6b46c1',
    marginVertical: 20,
    position: 'absolute',
    top: 40,
  },
  testArea: {
    width: TEST_AREA_SIZE,
    height: TEST_AREA_SIZE,
    borderRadius: 8,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#6b46c1',
  },
});

export default TrackingTest;
