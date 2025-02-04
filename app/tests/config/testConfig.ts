/*
 * Test configuration constants
 * Centralizes all hard-coded values used across test modules.
 */

import { Dimensions } from 'react-native';

const SCREEN = Dimensions.get('window');
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

// Calculate bottom boundary to ensure space for button
const BUTTON_SPACE = SCREEN_HEIGHT * 0.14; // Button height + padding

export const testConfig = {
  // Configuration for Choice Reaction Test
  choiceTest: {
    // Circle size as percentage of screen width
    CIRCLE_SIZE: SCREEN_WIDTH * 0.18,  // ~75px on standard screen
    get CIRCLE_RADIUS() { return this.CIRCLE_SIZE / 2 },
    
    // Button dimensions relative to screen
    BUTTON_HEIGHT: SCREEN_HEIGHT * 0.1,  // 10% of screen height
    RED_BUTTON_HEIGHT: SCREEN_HEIGHT * 0.1,
    BUTTON_PADDING_BOTTOM: SCREEN_HEIGHT * 0.04,  // 4% of screen height
    BUTTON_WIDTH: SCREEN_WIDTH * 0.5,  // 50% of screen width
    
    // Test configuration (non-dimensional constants)
    TOTAL_TRIALS: 8,
    CIRCLE_DISPLAY_TIME: 500,
    MIN_DELAY: 1000,
    MAX_DELAY: 3000,
    
    // Play area as percentage of screen dimensions
    // Leaving safe margins on all sides
    PLAY_AREA: {
      TOP: SCREEN_HEIGHT * 0.1,    // 15% from top
      BOTTOM: SCREEN_HEIGHT * 0.75 - BUTTON_SPACE,  // Adjusted to not overlap with button
      LEFT: SCREEN_WIDTH * 0.1,      // 10% from left
      RIGHT: SCREEN_WIDTH * 0.9,     // 90% from left
    },
    
    TOP_MARGIN: SCREEN_HEIGHT * 0.02
  },

  // Configuration for Reaction Time Test
  reactionTimeTest: {
    TOTAL_TRIALS: 5,              // Total number of trials
    TAP_DISPLAY_TIME: 500,        // Duration (ms) the tap color is displayed
    MIN_DELAY: 1000,              // Minimum delay (ms) before the tap prompt appears
    MAX_DELAY: 3000               // Maximum delay (ms) before the tap prompt appears
  },

  // Configuration for Balance Test
  balanceTest: {
    COUNTDOWN: 3,                // Countdown (in seconds) before test starts
    TEST_DURATION: 10000,         // Duration (ms) of the balance test
    SAMPLE_RATE: 100              // Accelerometer sample rate (ms)
  },

  // Configuration for Memory Test
  memoryTest: {
    START_SEQUENCE_LENGTH: 4,     // Starting length of the sequence
    MAX_SEQUENCE_LENGTH: 6,       // Maximum sequence length before test completion
    HIGHLIGHT_DURATION: 500,      // Duration (ms) each square is highlighted
    INTERVAL_BETWEEN_HIGHLIGHTS: 500, // Interval (ms) between highlighting individual squares
    INTER_SEQUENCE_DELAY: 1000    // Delay (ms) between sequences
  }
}; 