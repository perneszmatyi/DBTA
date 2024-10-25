import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type ReactionTimeTestProps = {
  onComplete: (results: any) => void;
};

const ReactionTimeTest = ({ onComplete }: ReactionTimeTestProps) => {
  const [testState, setTestState] = useState<'ready' | 'waiting' | 'tapping' | 'completed'>('ready');
  const [trials, setTrials] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const totalTrials = 5;

  useEffect(() => {
    if (trials.length === totalTrials) {
      const averageTime = trials.reduce((sum, time) => sum + time, 0) / totalTrials;
      console.log('averageTime', averageTime, 'ms');
      onComplete({ averageTime, individualTrials: trials });
    } else if (testState === 'waiting') {
      const timeout = setTimeout(() => {
        setTestState('tapping');
        setStartTime(Date.now());
      }, Math.random() * 4000 + 1000);

      return () => clearTimeout(timeout);
    }
  }, [trials, testState, onComplete]);

  const handlePress = () => {
    if (testState === 'ready') {
      setTestState('waiting');
    } else if (testState === 'tapping' && startTime) {
      const reactionTime = Date.now() - startTime;
      setTrials([...trials, reactionTime]);
      if (trials.length + 1 < totalTrials) {
        setTestState('waiting');
      } else {
        setTestState('completed');
      }
    }
  };

  return (
    <TouchableOpacity 
      className={`flex-1 justify-center items-center ${testState === 'tapping' ? 'bg-red-500' : 'bg-gray-100'}`} 
      onPress={handlePress}
    >
      {testState === 'ready' && (
        <Text className="text-2xl text-center">Tap to start the test</Text>
      )}
      {testState === 'waiting' && (
        <Text className="text-2xl text-center">Wait for the screen to change color...</Text>
      )}
      {testState === 'completed' && (
        <Text className="text-2xl text-center">Test completed!</Text>
      )}
    </TouchableOpacity>
  );
};

export default ReactionTimeTest;
