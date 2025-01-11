import { db } from './firebaseConfig';
import { TestSession } from './types';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export const testsService = {
  // Save completed test results
  async saveTestResults(participantId: string, testSession: TestSession): Promise<void> {
    try {
      // Add test results
      await addDoc(collection(db, 'testResults'), {
        ...testSession,
        timestamp: new Date()
      });

      // Update participant's test status
      const participantRef = doc(db, 'participants', participantId);
      await updateDoc(participantRef, {
        hasCompletedTest: true,
        lastTestDate: new Date()
      });
    } catch (error) {
      console.error('Error saving test results:', error);
      throw error;
    }
  }
};
