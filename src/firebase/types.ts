export type Group = {
    id: string;
    name: string;
    createdAt: Date;
    participantCount: number;
  };
  
  export type Participant = {
    id: string;
    groupId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: 'male' | 'female';
    intoxicationLevel: string;
    drivingExperience: string;
    lastTestDate: Date | null;
    hasCompletedTest: boolean;
  };
  
  export type TestResults = {
    reactionTime: {
      averageTime: number;
      correctTaps: number;
      trials: Array<{
        type: 'green' | 'red';
        side: 'left' | 'right';
        responseTime: number;
        correct: boolean;
      }>;
    };
    memory: {
      correctSequences: number;
      averageResponseTime: number;
      totalErrors: number;
    };
    balance: {
      averageDeviation: number;
      maxDeviation: number;
      testDuration: number;
    };
    choice: {
      averageReactionTime: number;
      correctTaps: number;
      averageDeviation: number;
      trials: Array<{
        type: 'green' | 'red';
        position: { x: number; y: number };
        responseTime: number;
        tapPosition?: { x: number; y: number };
        correct: boolean;
      }>;
    };

  };
  
  export type TestSession = {
    participantId: string;
    groupId: string;
    timestamp: Date;
    completed: boolean;
    tests: TestResults;
  }