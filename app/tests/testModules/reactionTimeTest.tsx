import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import TestIntro from '@/components/TestIntro';
import TestComplete from '@/components/TestComplete';

type Trial = {
  type: 'green' | 'red';
  side: 'left' | 'right';
  responseTime: number;
  correct: boolean;
}

type ReactionTimeTestProps = {
  onComplete: (results: {
    averageTime: number;
    correctTaps: number;
    individualTrials: Trial[];
  }) => void;
};

const ReactionTimeTest = ({ onComplete }: ReactionTimeTestProps) => {
  const [testState, setTestState] = useState<'ready' | 'waiting' | 'tapping' | 'completed'>('ready');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTrial, setCurrentTrial] = useState<{
    type: 'green' | 'red';
    side: 'left' | 'right';
  } | null>(null);
  const [showColor, setShowColor] = useState(false);

  const totalTrials = 5;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (trials.length === totalTrials) {
      const averageTime = trials.reduce((sum, trial) => sum + trial.responseTime, 0) / totalTrials;
      const correctTaps = trials.filter(trial => trial.correct).length;
    } else if (testState === 'waiting') {
      const newTrial: Trial = {
        type: Math.random() > 0.5 ? 'green' : 'red',
        side: Math.random() > 0.5 ? 'left' : 'right',
        responseTime: 0,
        correct: false
      };
      setCurrentTrial(newTrial);

      const timeout = setTimeout(() => {
        setTestState('tapping');
        setStartTime(Date.now());
        setShowColor(true);
        
        setTimeout(() => {
          setShowColor(false);
        }, 500);
      }, Math.random() * 2000 + 1000);

      return () => clearTimeout(timeout);
    }
  }, [trials, testState, onComplete]);

  const handlePress = (side: 'left' | 'right') => {
    if (testState === 'ready') {
      setTestState('waiting');
    } else if (testState === 'tapping' && startTime && currentTrial) {
      const reactionTime = Date.now() - startTime;
      
      const correctSide = currentTrial.type === 'green' 
        ? currentTrial.side  // Same side for green
        : currentTrial.side === 'left' ? 'right' : 'left';  // Opposite side for red
      
      const newTrial: Trial = {
        ...currentTrial,
        responseTime: reactionTime,
        correct: side === correctSide
      };

      setTrials([...trials, newTrial]);
      
      if (trials.length + 1 < totalTrials) {
        setTestState('waiting');
      } else {
        setTestState('completed');
      }
    }
  };

 

  
  if (testState === 'completed') {
    const averageTime = Math.round(trials.reduce((sum, trial) => sum + trial.responseTime, 0) / totalTrials);
    const correctTaps = trials.filter(trial => trial.correct).length;
    return (
      <TestComplete
        title="Reaction Time Test Complete!"
        message={`You got ${correctTaps} out of ${totalTrials} correct with an average time of ${averageTime}ms`}
        onComplete={() => {onComplete({
          averageTime, 
          correctTaps,
          individualTrials: trials 
        })}}
      />
    );
  }
  if (testState === 'ready') {
    return (
      <TestIntro
        title="Reaction Time Test"
        description="Test your reaction time and cognitive flexibility"
        instructions={[
          "Green: Tap the side where the color appears",
          "Red: Tap the opposite side",
          "Try to be as quick and accurate as possible",
          "There will be 5 trials"
        ]}
        onStart={() => setTestState('waiting')}
      />
    );
  }

  return (
    <View className="flex-1 bg-neutral-50">
      {/* Status Text */}
      <View className="absolute top-0 left-0 right-0 z-10 py-8 items-center">
        <Text className={`text-2xl font-semibold ${
          testState === 'waiting' ? 'text-neutral-600' :
          testState === 'tapping' ? 'text-primary-500' : 'text-neutral-900'
        }`}>
          {testState === 'waiting' ? 'Wait...' : 
           testState === 'tapping' ? 'Tap!' : ''}
        </Text>
        
        {/* Trial Counter */}
        <Text className="text-sm text-neutral-500 mt-2">
          Trial {trials.length + 1} of {totalTrials}
        </Text>
      </View>
      
      {/* Tap Areas */}
      <View className="flex-1 flex-row">
        <TouchableOpacity 
          style={{
            flex: 1,
            backgroundColor: testState === 'tapping' && currentTrial?.side === 'left' && showColor
              ? currentTrial.type === 'green' ? '#22c55e' : '#ef4444'
              : '#f5f5f5'
          }}
          onPress={() => handlePress('left')}
          disabled={testState !== 'tapping'}
        />
        <TouchableOpacity 
          style={{
            flex: 1,
            backgroundColor: testState === 'tapping' && currentTrial?.side === 'right' && showColor
              ? currentTrial.type === 'green' ? '#22c55e' : '#ef4444'
              : '#f5f5f5'
          }}
          onPress={() => handlePress('right')}
          disabled={testState !== 'tapping'}
        />
      </View>
    </View>
  );
};

export default ReactionTimeTest;
