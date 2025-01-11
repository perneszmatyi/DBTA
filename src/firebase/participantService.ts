import { db } from './firebaseConfig';
import { Participant } from './types';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from 'firebase/firestore';

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
  }
};
