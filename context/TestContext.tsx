import { createContext, useContext, useState, ReactNode } from 'react';
import { testsService } from '@/src/firebase/testsService';
import { TestResults, TestSession } from '@/src/firebase/types';
import { useParticipantContext } from './ParticipantContext';

type TestContextType = {
  testResults: TestResults | null;
  updateReactionResults: (results: TestResults['reactionTime']) => void;
  updateMemoryResults: (results: TestResults['memory']) => void;
  updateBalanceResults: (results: TestResults['balance']) => void;
  updateChoiceResults: (results: TestResults['choice']) => void;
  saveResults: (participantId: string) => Promise<void>;
  clearResults: () => void;
};

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};

export function TestProvider({ children }: { children: ReactNode }) {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const { participants } = useParticipantContext();

  const updateReactionResults = (results: TestResults['reactionTime']) => {
    setTestResults(prev => ({
      ...prev,
      reactionTime: results
    } as TestResults));
  };

  const updateMemoryResults = (results: TestResults['memory']) => {
    setTestResults(prev => ({
      ...prev,
      memory: results
    } as TestResults));
  };

  const updateBalanceResults = (results: TestResults['balance']) => {
    setTestResults(prev => ({
      ...prev,
      balance: results
    } as TestResults));
  };

  const updateChoiceResults = (results: TestResults['choice']) => {
    setTestResults(prev => ({
      ...prev,
      choice: results
    } as TestResults));
  };

  const saveResults = async (participantId: string) => {
    if (!testResults) {
      throw new Error('No test results to save');
    }

    const participant = participants.find(p => p.id === participantId);
    if (!participant) {
      throw new Error('Participant not found');
    }

    console.log('testResults', testResults);

    const testSession: TestSession = {
      participantId,
      groupId: participant.groupId,
      timestamp: new Date(),
      completed: true,
      tests: testResults
    };

    await testsService.saveTestResults(participantId, testSession);
    clearResults();
  };

  const clearResults = () => {
    setTestResults(null);
  };

  return (
    <TestContext.Provider
      value={{
        testResults,
        updateReactionResults,
        updateMemoryResults,
        updateBalanceResults,
        updateChoiceResults,
        saveResults,
        clearResults
      }}
    >
      {children}
    </TestContext.Provider>
  );
} 