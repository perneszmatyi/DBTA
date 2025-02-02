import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import TestIntro from '@/components/TestIntro';

type Trial = {
  type: 'green' | 'red';
  position: { x: number; y: number };
  responseTime: number;
  tapPosition?: { x: number; y: number };
  deviation: number;
  correct: boolean;
}

type ChoiceTestProps = {
  onComplete: (results: {
    averageReactionTime: number;
    correctTaps: number;
    averageDeviation: number;
    trials: Trial[];
  }) => void;
};

const CIRCLE_SIZE = 75;                // Diameter in pixels
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const BUTTON_HEIGHT = 80;              // Height of the bottom button
const BUTTON_PADDING_BOTTOM = 32;      // Reduced padding below the bottom button (was 8)
const TOTAL_TRIALS = 8;
const CIRCLE_DISPLAY_TIME = 500;       // Circle visible for 0.5 seconds
const MIN_DELAY = 1000;                // 1 second delay
const MAX_DELAY = 3000;                // 3 seconds delay
const TOP_MARGIN = 10;                // Height reserved at the top (for trial counter)

const ChoiceTest = ({ onComplete }: ChoiceTestProps) => {
  const [testState, setTestState] = useState<'intro' | 'waiting' | 'tapping' | 'completed'>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [showCircle, setShowCircle] = useState(false);
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  const [circleColor, setCircleColor] = useState<'green' | 'red'>('green');
  const [startTime, setStartTime] = useState(0);

  const windowHeight = Dimensions.get('window').height;
  
  // Define the spawn area for circles
  const playArea = {
    top: 85,
    bottom: 535,
    left: 40,
    right: 350
  };

  const generateRandomPosition = () => {
    const x = playArea.left + Math.random() * (playArea.right - playArea.left);
    const y = playArea.top + Math.random() * (playArea.bottom - playArea.top);
    return { x, y };
  };

  // Starts a new trial by randomly setting circle position, color and a random delay before showing the circle.
  const startNewTrial = () => {
    const position = generateRandomPosition();
    const type = Math.random() < 0.5 ? 'green' : 'red';
    setCirclePosition(position);
    setCircleColor(type);
    
    const randomDelay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    setTimeout(() => {
      setShowCircle(true);
      setStartTime(Date.now());
      // Hide the circle after a fixed display time
      setTimeout(() => {
        setShowCircle(false);
      }, CIRCLE_DISPLAY_TIME);
    }, randomDelay);
  };

  // Handle a tap event.
  const handleTap = (tapX: number, tapY: number) => {
    // Only register the tap when a trial is active.
    if (trials.length >= TOTAL_TRIALS || !startTime) return;

    const responseTime = Date.now() - startTime;
    // Calculate the top edge of the bottom button.
    const buttonTopEdge = windowHeight - BUTTON_PADDING_BOTTOM - BUTTON_HEIGHT;
    const isBottomButtonTap = tapY >= buttonTopEdge;
    
    let correct = false;
    let deviation = 0;

    if (circleColor === 'red') {
      // For red circles, the tap is correct only if within the bottom button area.
      correct = isBottomButtonTap;
    } else {
      // For green circles, check proximity to the circle's center.
      const distance = Math.sqrt(
        Math.pow(tapX - circlePosition.x, 2) +
        Math.pow(tapY - circlePosition.y, 2)
      );
      deviation = distance <= CIRCLE_RADIUS ? 0 : distance - CIRCLE_RADIUS;
      correct = distance <= CIRCLE_RADIUS;
    }

    const trial: Trial = {
      type: circleColor,
      position: circlePosition,
      responseTime,
      tapPosition: { x: tapX, y: tapY },
      deviation,
      correct
    };

    setTrials(prev => [...prev, trial]);
    setStartTime(0);  // Reset startTime to prevent further taps for this trial.

    if (trials.length + 1 === TOTAL_TRIALS) {
      handleTestComplete([...trials, trial]);
    } else {
      startNewTrial();
    }
  };

  const handleTestComplete = (completedTrials: Trial[]) => {
    const correctTaps = completedTrials.filter(t => t.correct).length;
    const averageReactionTime = completedTrials.reduce((sum, t) => sum + t.responseTime, 0) / TOTAL_TRIALS;
    
    // Average deviation for green circle trials.
    const greenTrials = completedTrials.filter(t => t.type === 'green');
    const averageDeviation = greenTrials.length > 0
      ? greenTrials.reduce((sum, t) => sum + t.deviation, 0) / greenTrials.length
      : 0;

    onComplete({
      averageReactionTime,
      correctTaps,
      averageDeviation,
      trials: completedTrials
    });
  };

  useEffect(() => {
    if (testState === 'waiting') {
      startNewTrial();
    }
  }, [testState]);

  if (testState === 'intro') {
    return (
      <TestIntro
        title="Choice Reaction Test"
        description="Test your reaction time and decision making"
        instructions={[
          "A circle will appear randomly on the screen",
          "If the circle is GREEN, tap its location",
          "If the circle is RED, tap the button at the bottom",
          "Try to be as quick and accurate as possible",
          "There will be 8 trials"
        ]}
        onStart={() => setTestState('waiting')}
      />
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={1}
      onPress={e => handleTap(e.nativeEvent.locationX, e.nativeEvent.locationY)}
      className="flex-1 bg-neutral-50"
    >
      {/* Trial Counter */}
      <View className="absolute top-0 left-0 right-0 z-10 py-8 items-center">
        <Text className="text-sm text-neutral-500">
          Trial {trials.length + 1} of {TOTAL_TRIALS}
        </Text>
      </View>

      {/* Visual border for spawn area */}
      <View
        style={{
          position: 'absolute',
          left: playArea.left,
          top: playArea.top,
          width: playArea.right - playArea.left,
          height: playArea.bottom - playArea.top,
          borderWidth: 2,
          borderColor: 'blue',
          zIndex: 5,
        }}
      />

      {/* Circle */}
      {showCircle && (
        <View
          style={{
            position: 'absolute',
            left: circlePosition.x - CIRCLE_RADIUS,
            top: circlePosition.y - CIRCLE_RADIUS,
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_RADIUS,
            backgroundColor: circleColor === 'green' ? '#22c55e' : '#ef4444',
            zIndex: 10,
          }}
        />
      )}
      
      {/* Bottom Target Button (always visible) */}
      <View 
        className="absolute bottom-0 left-0 right-0 items-center justify-center pb-8"
        style={{ paddingBottom: BUTTON_PADDING_BOTTOM }}
      >
        <View className="w-40 h-20 bg-red-100 rounded-lg border-2 border-red-300 items-center justify-center">
          <Text className="text-red-500 font-medium">Tap Here</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChoiceTest;
