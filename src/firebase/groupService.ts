import { db } from './firebaseConfig';
import { Group } from './types';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  query, 
  where, 
  writeBatch,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';

export const groupsService = {
  // Subscribe to real-time group updates
  subscribeToGroups(onUpdate: (groups: Group[]) => void): Unsubscribe {
    const groupsRef = collection(db, 'groups');
    return onSnapshot(groupsRef, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Group[];
      onUpdate(groups);
    }, (error) => {
      console.error('Error listening to groups:', error);
    });
  },

  // Fetch all groups (one-time fetch)
  async getGroups(): Promise<Group[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'groups'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Group[];
    } catch (error) {
      console.error('Error getting groups:', error);
      throw error;
    }
  },

  // Create new group
  async createGroup(name: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        name,
        participantCount: 0,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  // Delete group and all its participants
  async deleteGroup(groupId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Delete all participants in the group
      const participantsQuery = query(collection(db, 'participants'), where('groupId', '==', groupId));
      const participantsSnapshot = await getDocs(participantsQuery);
      participantsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete the group
      const groupRef = doc(db, 'groups', groupId);
      batch.delete(groupRef);

      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }
};