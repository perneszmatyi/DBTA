import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Group } from '@/src/firebase/types';
import { groupsService } from '@/src/firebase/groupService';

type GroupContextType = {
  groups: Group[];
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
  createGroup: (name: string) => Promise<void>;
  fetchGroups: () => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);
export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export function GroupProvider({ children }: { children: ReactNode }) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  // Set up real-time listener for groups
  useEffect(() => {
    const unsubscribe = groupsService.subscribeToGroups((updatedGroups) => {
      setGroups(updatedGroups);
      // Only update currentGroup if it exists and has changed
      if (currentGroup) {
        const updatedCurrentGroup = updatedGroups.find(g => g.id === currentGroup.id);
        if (updatedCurrentGroup && JSON.stringify(updatedCurrentGroup) !== JSON.stringify(currentGroup)) {
          setCurrentGroup(updatedCurrentGroup);
        }
      }
    });

    return () => unsubscribe();
  }, []); // Remove currentGroup from dependencies

  const fetchGroups = async () => {
    try {
      const fetchedGroups = await groupsService.getGroups();
      setGroups(fetchedGroups);
      if (fetchedGroups.length > 0 && !currentGroup) {
        setCurrentGroup(fetchedGroups[0]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  };

  const createGroup = async (name: string) => {
    try {
      await groupsService.createGroup(name);
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      setCurrentGroup(null); // Clear current group before deletion
      await groupsService.deleteGroup(groupId);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  };

  return (
    <GroupContext.Provider value={{ groups, currentGroup, setCurrentGroup, createGroup, fetchGroups, deleteGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

