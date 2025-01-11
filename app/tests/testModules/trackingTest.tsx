import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';
import { useTestContext } from '@/context/TestContext';
import TestIntro from '@/components/TestIntro';
import TestComplete from '@/components/TestComplete';

type TrackingTestProps = {
  onComplete: (results: {
    averageDeviation: number;
    timeOnTarget: number;
    totalMisses: number;
    completionScore: number;
  }) => void;
};

const TEST_DURATION = 15; // 15 seconds
const TARGET_SIZE = 75;
const THRESHOLD = TARGET_SIZE / 2; // Distance threshold for "on target"

const TrackingTest = ({ onComplete }: TrackingTestProps) => {
  const [testState, setTestState] = useState<'intro' | 'testing' | 'completed'>('intro');
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [trackingData, setTrackingData] = useState<{ distance: number; timestamp: number }[]>([]);
  const [testResults, setTestResults] = useState<TrackingTestProps['onComplete'] extends (results: infer R) => void ? R : never>();
  const { updateTrackingResults } = useTestContext();

  // Animated values for circle position
  const targetPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const fingerPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Create circular motion animation
  useEffect(() => {
    if (testState === 'testing') {
      const radius = 100;
      const duration = 8000; // 8 seconds per full circle, slower movement

      const angle = new Animated.Value(0);
      
      const animation = Animated.loop(
        Animated.timing(angle, {
          toValue: 2 * Math.PI,
          duration: duration,
          useNativeDriver: true,
        })
      );
      
      animation.start();

      // Update position based on angle
      angle.addListener(({ value }) => {
        const x = radius * Math.cos(value);
        const y = radius * Math.sin(value);
        targetPosition.setValue({ x, y });
      });

      // Start timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            animation.stop();
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        animation.stop();
        angle.removeAllListeners();
      };
    }
  }, [testState]);

  // Pan responder for tracking finger movement
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const currentX = gestureState.moveX;
        const currentY = gestureState.moveY;
        
        fingerPosition.setValue({
          x: currentX,
          y: currentY,
        });

        // Use center of screen as reference point for now
        const centerX = Dimensions.get('window').width / 2;
        const centerY = Dimensions.get('window').height / 2;
        
        const distance = Math.sqrt(
          Math.pow(currentX - centerX, 2) +
          Math.pow(currentY - centerY, 2)
        );

        setTrackingData(prev => [...prev, {
          distance,
          timestamp: Date.now()
        }]);
      },
    })
  ).current;

  const handleTestComplete = () => {
    const totalSamples = trackingData.length;
    if (totalSamples === 0) return;

    // Calculate metrics
    const onTargetSamples = trackingData.filter(data => data.distance <= THRESHOLD).length;
    const averageDeviation = trackingData.reduce((sum, data) => sum + data.distance, 0) / totalSamples;
    const timeOnTarget = (onTargetSamples / totalSamples) * TEST_DURATION;
    const totalMisses = trackingData.filter(data => data.distance > THRESHOLD).length;
    const completionScore = (onTargetSamples / totalSamples) * 100;

    const results = {
      averageDeviation,
      timeOnTarget,
      totalMisses,
      completionScore
    };

    setTestResults(results);
    updateTrackingResults(results);
    setTestState('completed');
  };

  const startTest = () => {
    setTestState('testing');
    setTimeLeft(TEST_DURATION);
    setTrackingData([]);
  };

  if (testState === 'intro') {
    return (
      <TestIntro
        title="Tracking Test"
        description="Follow the moving target with your finger"
        instructions={[
          "Place your finger on the circle",
          "Follow it as it moves around the screen",
          "Keep your finger as close to the center as possible",
          "Test will last 15 seconds"
        ]}
        onStart={startTest}
      />
    );
  }

  if (testState === 'completed') {
    return (
      <TestComplete
        title="All Tests Completed!"
        message="Congratulations! You have completed all the tests. Your results have been saved."
        onComplete={() => testResults && onComplete(testResults)}
      />
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-neutral-50" {...panResponder.panHandlers}>
      <Text className="text-4xl font-bold text-primary-500 absolute top-10">
        {timeLeft}
      </Text>
      <View className="w-80 h-80 items-center justify-center">
        <Animated.View
          style={[{
            width: TARGET_SIZE,
            height: TARGET_SIZE,
            borderRadius: TARGET_SIZE / 2,
            backgroundColor: '#6b46c1',
            position: 'absolute',
            transform: targetPosition.getTranslateTransform(),
          }]}
        />
      </View>
    </View>
  );
};

export default TrackingTest;
