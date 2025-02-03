/*
 * Test configuration constants
 * Centralizes all hard-coded values used across test modules.
 */

export const testConfig = {
  // Configuration for Choice Reaction Test
  choiceTest: {
    CIRCLE_SIZE: 75,                // Diameter of the circle in pixels
    CIRCLE_RADIUS: 75 / 2,          // Radius of the circle
    BUTTON_HEIGHT: 80,              // Height of the bottom button in pixels
    RED_BUTTON_HEIGHT: 80,          // Height for the red target button
    BUTTON_PADDING_BOTTOM: 32,      // Padding below the bottom button in pixels
    BUTTON_WIDTH: 200,              // Width of the bottom target button
    TOTAL_TRIALS: 8,                // Total number of trials
    CIRCLE_DISPLAY_TIME: 500,       // Duration (ms) for which the circle is visible
    MIN_DELAY: 1000,                // Minimum delay (ms) before showing the circle
    MAX_DELAY: 3000,                // Maximum delay (ms) before showing the circle
    PLAY_AREA: {
      TOP: 85,    // Top boundary for circle spawn area
      BOTTOM: 535, // Bottom boundary for circle spawn area
      LEFT: 40,   // Left boundary for circle spawn area
      RIGHT: 350  // Right boundary for circle spawn area
    },
    TOP_MARGIN: 10                // Additional margin from top if needed
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