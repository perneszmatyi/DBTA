import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import TestIntro from '@/components/TestIntro';

type MemoryTestProps = {
  onComplete: (results: {
    correctSequences: number;
    averageResponseTime: number;
    totalErrors: number;
  }) => void;
};

const Square = ({ 
  isHighlighted, 
  onPress, 
  index,
  disabled,
  isPressed,
  isCorrect
}: { 
  isHighlighted: boolean;
  onPress: (index: number) => void;
  index: number;
  disabled: boolean;
  isPressed: boolean;
  isCorrect: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.square,
      isHighlighted && styles.highlighted,
      isPressed && (isCorrect ? styles.correctPress : styles.wrongPress)
    ]}
    onPress={() => onPress(index)}
    disabled={disabled}
  />
);

const MemoryTest = ({ onComplete }: MemoryTestProps) => {
  // Test state
  const [testStarted, setTestStarted] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [currentLength, setCurrentLength] = useState(4);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  
  // Results tracking
  const [correctSequences, setCorrectSequences] = useState(0);
  const [maxSequenceLength, setMaxSequenceLength] = useState(4);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [totalErrors, setTotalErrors] = useState(0);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);

  // Generate new sequence
  const generateSequence = () => {
    const newSequence: number[] = [];
    while (newSequence.length < currentLength) {
      const num = Math.floor(Math.random() * 16);
      if (!newSequence.includes(num)) {
        newSequence.push(num);
      }
    }
    setSequence(newSequence);
    return newSequence;
  };

  // Show sequence to user
  const showSequence = async (newSequence: number[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < newSequence.length; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          setHighlightedIndex(newSequence[i]);
          setTimeout(() => {
            setHighlightedIndex(null);
            resolve(null);
          }, 500);
        }, 500);
      });
    }
    setIsShowingSequence(false);
    setLastTapTime(Date.now());
  };

  // Handle user taps
  const handleSquarePress = (index: number) => {
    if (isShowingSequence) return;

    
    const currentTime = Date.now();
    if (lastTapTime) {
      setResponseTimes(prev => [...prev, currentTime - lastTapTime]);
    }
    setLastTapTime(currentTime);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Check if the tap was wrong
    if (index !== sequence[userSequence.length]) {
      setTotalErrors(prev => prev + 1);
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      handleSequenceComplete();
    }
  };

  // Handle completed sequence
  const handleSequenceComplete = () => {
    // Check if the sequence was correct
    if (userSequence.every((val, index) => val === sequence[index])) {
      setCorrectSequences(prev => prev + 1);
    }
    
    if (currentLength < 6) {
      setCurrentLength(prev => prev + 1);
      setUserSequence([]);
      const newSequence = generateSequence();
      setTimeout(() => showSequence(newSequence), 1000);
    } else {
      endTest();
    }
  };

  // End test and calculate results
  const endTest = () => {
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    onComplete({
      correctSequences,
      averageResponseTime: avgResponseTime,
      totalErrors,
    });
  };

  // Start test
  const startTest = () => {
    setTestStarted(true);
    const newSequence = generateSequence();
    showSequence(newSequence);
  };

  if (!testStarted) {
    return (
      <TestIntro
        title="Memory Test"
        description="Test your visual memory and sequence recall"
        instructions={[
          "Watch the sequence of highlighted squares",
          "Repeat the sequence by tapping the squares in order",
          "The sequence will get longer after each successful attempt",
          "Try to remember as many sequences as possible"
        ]}
        onStart={startTest}
      />
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 items-center justify-center px-4">
      {/* Status Text */}
      <View className="mb-8">
        <Text className={`text-2xl font-semibold text-center mb-2 ${
          isShowingSequence ? 'text-primary-500' : 'text-neutral-900'
        }`}>
          {isShowingSequence ? "Watch the sequence..." : "Repeat the sequence!"}
        </Text>
        <Text className="text-neutral-500 text-center">
          Level {currentLength - 3} of 3
        </Text>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {Array(16).fill(null).map((_, index) => {
          const sequencePosition = userSequence.indexOf(index);
          const isCorrect = sequencePosition !== -1 && sequence[sequencePosition] === index;
          return (
            <Square
              key={index}
              index={index}
              isHighlighted={highlightedIndex === index}
              onPress={handleSquarePress}
              disabled={isShowingSequence}
              isPressed={userSequence.includes(index)}
              isCorrect={isCorrect}
            />
          );
        })}
      </View>

      {/* Progress Text */}
      <Text className="text-neutral-500 text-center mt-8">
        {userSequence.length} / {sequence.length} squares selected
      </Text>
    </View>
  );
};

const { width } = Dimensions.get('window');
const GRID_SIZE = width * 0.9;
const SQUARE_SIZE = (GRID_SIZE - 60) / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    margin: 3.4,
    borderRadius: 8,
  },
  highlighted: {
    backgroundColor: '#2563EB', // primary-500
    borderColor: '#2563EB',
  },
  startText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#111827', // neutral-900
  },
  correctPress: {
    backgroundColor: '#22C55E', // green-500
    borderColor: '#22C55E',
  },
  wrongPress: {
    backgroundColor: '#EF4444', // red-500
    borderColor: '#EF4444',
  },
  statusText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#111827', // neutral-900
  }
});

export default MemoryTest;
