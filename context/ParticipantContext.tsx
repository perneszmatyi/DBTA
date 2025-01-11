import { createContext, useContext, useState, ReactNode } from 'react';
import { Participant } from '@/src/firebase/types';
import { participantService } from '@/src/firebase/participantService';

type ParticipantContextType = {
  participants: Participant[];
  currentParticipant: Participant | null;
  setCurrentParticipant: (participant: Participant | null) => void;
  addParticipant: (groupId: string, participantData: Omit<Participant, 'id' | 'groupId' | 'createdAt'>) => Promise<void>;
  fetchParticipants: (groupId: string) => Promise<void>;
  deleteParticipant: (participantId: string, groupId: string) => Promise<void>;
};

const ParticipantContext = createContext<ParticipantContextType | undefined>(undefined);

export const useParticipantContext = () => {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error('useParticipant must be used within a ParticipantProvider');
  }
  return context;
};

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const fetchParticipants = async (groupId: string) => {
    try {
      const fetchedParticipants = await participantService.getParticipants(groupId);
      setParticipants(fetchedParticipants);
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }
  };

  const addParticipant = async (groupId: string, participantData: Omit<Participant, 'id' | 'groupId' | 'createdAt'>) => {
    try {
      await participantService.addParticipant(groupId, participantData);
      await fetchParticipants(groupId);
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  };

  const deleteParticipant = async (participantId: string, groupId: string) => {
    try {
      await participantService.deleteParticipant(participantId, groupId);
      await fetchParticipants(groupId);
      if (currentParticipant?.id === participantId) {
        setCurrentParticipant(null);
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }
  };

  return (
    <ParticipantContext.Provider 
      value={{ 
        participants,
        currentParticipant, 
        setCurrentParticipant,
        addParticipant,
        fetchParticipants,
        deleteParticipant
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
}

