import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, GestureResponderEvent } from 'react-native';
import TestIntro from '@/components/TestIntro';

type Trial = {
  type: 'green' | 'red';
  position: { x: number; y: number };
  responseTime: number;
  tapPosition?: { x: number; y: number };
  deviation: number;
  correct: boolean;
};

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
const BUTTON_PADDING_BOTTOM = 32;      // Reduced padding below the bottom button
const TOTAL_TRIALS = 8;
const CIRCLE_DISPLAY_TIME = 500;       // Circle visible for 0.5 seconds
const MIN_DELAY = 1000;                // 1 second delay
const MAX_DELAY = 3000;                // 3 seconds delay
const TOP_MARGIN = 10;                
const SCREEN = Dimensions.get('window');
const RED_BUTTON_HEIGHT = 80;

// Define the spawn area for circles (absolute coordinates within the screen)
const playArea = {
  top: 85,
  bottom: 535,
  left: 40,
  right: 350
};

const ChoiceTest = ({ onComplete }: ChoiceTestProps) => {
  const [testState, setTestState] = useState<'intro' | 'waiting' | 'tapping' | 'completed'>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [showCircle, setShowCircle] = useState(false);
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  const [activeCirclePosition, setActiveCirclePosition] = useState({ x: 0, y: 0 });
  const [circleColor, setCircleColor] = useState<'green' | 'red'>('green');
  const [startTime, setStartTime] = useState(0);
  const containerRef = React.useRef<View>(null);
  const [containerOffset, setContainerOffset] = useState({ x: 0, y: 0 });
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });

  // Timer refs
  const timeoutRefs = React.useRef<Array<NodeJS.Timeout>>([]);

  // Register container's absolute screen offset
  const handleContainerLayout = () => {
    containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setContainerOffset({ x: pageX, y: pageY });
    });
  };

  // Generate a random position for the circle within the play area
  const generateRandomPosition = () => {
    return {
      x: playArea.left + Math.random() * (playArea.right - playArea.left),
      y: playArea.top + Math.random() * (playArea.bottom - playArea.top)
    };
  };

  // Starts a new trial by showing a circle after a delay
  const startNewTrial = () => {
    // Clear any existing timers first
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    const position = generateRandomPosition();
    const type = Math.random() < 0.5 ? 'green' : 'red';
    setCirclePosition(position);
    setCircleColor(type);
    
    const delayTimer = setTimeout(() => {
      setShowCircle(true);
      setStartTime(Date.now());
      // Capture the circle position as active when the circle is shown.
      setActiveCirclePosition(position);
      
      const hideTimer = setTimeout(() => {
        setShowCircle(false);
      }, CIRCLE_DISPLAY_TIME);
      
      timeoutRefs.current.push(hideTimer);
    }, MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));

    timeoutRefs.current.push(delayTimer);
  };

  // Convert tap to absolute screen coordinates using pageX/pageY
  const handleTap = (event: GestureResponderEvent) => {
    const absoluteX = event.nativeEvent.pageX;
    const absoluteY = event.nativeEvent.pageY;
    setTapPosition({ x: absoluteX, y: absoluteY });
    
    // Only register the tap if a trial is active
    if (trials.length >= TOTAL_TRIALS || !startTime) return;

    const responseTime = Date.now() - startTime;
    const windowHeight = Dimensions.get('window').height;
    const buttonTopEdge = windowHeight - BUTTON_PADDING_BOTTOM - BUTTON_HEIGHT;
    let correct = false;
    let deviation = 0;

    if (circleColor === 'red') {
      // For red circles, the tap is correct if it is within the bottom button area.
      correct = absoluteY >= buttonTopEdge;
    } else {
      // For green circles, check if the tap is near the circle's center.
      const dx = absoluteX - activeCirclePosition.x;
      const dy = absoluteY - activeCirclePosition.y;
      // Compare using Euclidean distance.
      const distance = Math.sqrt(dx * dx + dy * dy);
      deviation = distance <= CIRCLE_RADIUS ? 0 : distance - CIRCLE_RADIUS;
      correct = distance <= CIRCLE_RADIUS;
    }

    const trial: Trial = {
      type: circleColor,
      position: activeCirclePosition,
      responseTime,
      tapPosition: { x: absoluteX, y: absoluteY },
      deviation,
      correct
    };

    setTrials(prev => [...prev, trial]);
    setStartTime(0);  // Reset startTime to prevent multiple taps for the same trial

    if (trials.length + 1 === TOTAL_TRIALS) {
      onComplete({
        averageReactionTime: trials.reduce((sum, t) => sum + t.responseTime, responseTime) / TOTAL_TRIALS,
        correctTaps: trials.filter(t => t.correct).length + (correct ? 1 : 0),
        averageDeviation: trials.filter(t => t.type === 'green').length > 0
          ? trials.reduce((sum, t) => t.type === 'green' ? sum + t.deviation : sum, deviation) / (trials.filter(t => t.type === 'green').length + (circleColor === 'green' ? 1 : 0))
          : 0,
        trials: [...trials, trial]
      });
    } else {
      startNewTrial();
    }
  };

  useEffect(() => {
    if (testState === 'waiting') {
      startNewTrial();
    }
  }, [testState]);

  useEffect(() => {
    return () => {
      // Cleanup all timers on unmount
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

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
      ref={containerRef}
      onLayout={handleContainerLayout}
      activeOpacity={1}
      onPress={handleTap}
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

      {/* Circle - positioned using absolute screen coordinates */}
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
      
      {/* Bottom Target Button - absolute positioning */}
      <View 
        style={{
          position: 'absolute',
          bottom: 32,
          left: SCREEN.width / 2 - 100, // Center 200px wide button
          width: 200,
          height: RED_BUTTON_HEIGHT,
          backgroundColor: '#fee2e2',
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#fca5a5',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text className="text-red-500 font-medium">Tap Here</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChoiceTest;
