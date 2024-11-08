import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import TestIntro from '@/components/TestIntro';

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
      onComplete({ 
        averageTime, 
        correctTaps,
        individualTrials: trials 
      }); 
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

  const handleComplete = () => {
    const averageTime = trials.reduce((sum, trial) => sum + trial.responseTime, 0) / totalTrials;
    const correctTaps = trials.filter(trial => trial.correct).length;
    
    onComplete({ 
      averageTime, 
      correctTaps,
      individualTrials: trials 
    });
  };

  

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
    <View className="flex-1">
      <Text className="text-2xl text-center mt-12">
        {testState === 'waiting' ? 'Wait...' : 
         testState === 'tapping' ? 'Tap!' :
         testState === 'completed' ? 'Test completed!' : ''}
      </Text>
      
      <View className="flex-1 flex-row mt-8">
        <TouchableOpacity 
          className={`flex-1 border-r border-gray-400 ${
            testState === 'tapping' && currentTrial?.side === 'left' && showColor
              ? `bg-${currentTrial.type === 'green' ? 'green' : 'red'}-500`
              : 'bg-gray-100'
          }`}
          onPress={() => handlePress('left')}
          disabled={testState !== 'tapping'}
        />
        <TouchableOpacity 
          className={`flex-1 ${
            testState === 'tapping' && currentTrial?.side === 'right' && showColor
              ? `bg-${currentTrial.type === 'green' ? 'green' : 'red'}-500`
              : 'bg-gray-100'
          }`}
          onPress={() => handlePress('right')}
          disabled={testState !== 'tapping'}
        />
      </View>
    </View>
  );
};

export default ReactionTimeTest;
