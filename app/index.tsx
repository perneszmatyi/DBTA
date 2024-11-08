import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const GroupCard = ({ group }: { group: any }) => (
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
            Last active: {new Date(group.lastActive).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </Link>
);

export default function HomeScreen() {
  const groups = [
    { 
      id: 1, 
      name: 'Group 1',
      participantCount: 12,
      lastActive: '2024-02-20'
    },
    { 
      id: 2, 
      name: 'Group 2',
      participantCount: 8,
      lastActive: '2024-02-19'
    },
  ];

  const handleCreateNewGroup = () => {
    console.log('Create new group');
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
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </ScrollView>

        {/* Create Group Button */}
        <TouchableOpacity
          onPress={handleCreateNewGroup}
          className="bg-primary-500 mx-4 mb-6 p-4 rounded-lg shadow-sm flex-row justify-center items-center"
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="font-semibold text-white text-lg ml-2">Create New Group</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
