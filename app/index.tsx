import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CreateGroupModal from '@/components/CreateGroupModal';
import { useGroupContext } from '@/context/GroupContext';
import { Timestamp } from 'firebase/firestore';

const GroupCard = ({ group }: { group: any }) => {
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  return (
    <Link
    href={`/groups/${group.id}`}
    asChild
    >
    <TouchableOpacity className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold text-neutral-900">{group.name}</Text>
          <Ionicons name="chevron-forward" size={24} color="#6B7280" />
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-neutral-500">
              {group.participantCount} participants
            </Text>
          </View>
          <Text className="text-sm text-neutral-500">
            Created at: {formatDate(group.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    </Link>
  );
};

export default function HomeScreen() {
  const { createGroup, groups } = useGroupContext();
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState(false);

  const handleCreateNewGroup = async (name: string) => {
    try {
      await createGroup(name);
      setIsCreateGroupModalVisible(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-neutral-900">Groups</Text>
          <Text className="text-neutral-500 mt-1">Manage your research groups</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          className="flex-row items-center bg-white rounded-md px-4 py-3 mb-4 shadow-sm"
        >
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <Text className="ml-2 text-neutral-500">Search groups...</Text>
        </TouchableOpacity>

        {/* Groups List */}
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {groups.length === 0 ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-neutral-500 text-lg">No groups yet</Text>
              <Text className="text-neutral-400">Create your first group to get started</Text>
            </View>
          ) : (
            groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))
          )}
        </ScrollView>

        {/* Create Group Button */}
        <TouchableOpacity
          onPress={() => setIsCreateGroupModalVisible(true)}
          className="bg-primary-500 mx-4 mb-6 p-4 rounded-lg shadow-sm flex-row justify-center items-center"
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="font-semibold text-white text-lg ml-2">Create New Group</Text>
        </TouchableOpacity>
        <CreateGroupModal 
          isVisible={isCreateGroupModalVisible}
          onClose={() => setIsCreateGroupModalVisible(false)}
          onSubmit={handleCreateNewGroup}
        />
      </View>
    </SafeAreaView>
  );
}
