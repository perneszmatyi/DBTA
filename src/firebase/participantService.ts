import { db } from './firebaseConfig';
import { Participant } from './types';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment, deleteDoc, writeBatch } from 'firebase/firestore';

export const participantService = {
  // Fetch all participants for a group
  async getParticipants(groupId: string): Promise<Participant[]> {
    try {
      const q = query(collection(db, 'participants'), where('groupId', '==', groupId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Participant[];
    } catch (error) {
      console.error('Error getting participants:', error);
      throw error;
    }
  },

  // Add new participant to a group
  async addParticipant(groupId: string, participantData: Omit<Participant, 'id' | 'groupId' | 'createdAt'>): Promise<string> {
    try {
      // Add participant
      const docRef = await addDoc(collection(db, 'participants'), {
        ...participantData,
        groupId,
        createdAt: new Date(),
        testResults: []
      });

      // Update group's participant count
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        participantCount: increment(1)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  },

  // Delete participant and all their test results
  async deleteParticipant(participantId: string, groupId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete all test results for this participant
      const testResultsQuery = query(
        collection(db, 'testResults'), 
        where('participantId', '==', participantId)
      );
      const testResultsSnapshot = await getDocs(testResultsQuery);
      testResultsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete participant
      batch.delete(doc(db, 'participants', participantId));

      // Update group's participant count
      const groupRef = doc(db, 'groups', groupId);
      batch.update(groupRef, {
        participantCount: increment(-1)
      });

      // Commit all changes in a single batch
      await batch.commit();
    } catch (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }
  }
};
