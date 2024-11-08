import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Participant = {
  id: string;
  name: string;
  age: number;
  hasCompletedTest: boolean;
};

const ParticipantListItem = ({ participant, onPress }: { participant: Participant; onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="mb-3 bg-white rounded-lg shadow-sm overflow-hidden"
  >
    <View className="p-4 flex-row justify-between items-center">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
          <Text className="text-primary-500 font-semibold">{participant.name.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-neutral-900">{participant.name}</Text>
          <Text className="text-neutral-500">Age: {participant.age}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center">
        <View className={`px-3 py-1 rounded-full mr-3 ${
          participant.hasCompletedTest ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          <Text className={`text-sm ${
            participant.hasCompletedTest ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {participant.hasCompletedTest ? 'Completed' : 'Pending'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
    </View>
  </TouchableOpacity>
);

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const participants: Participant[] = [
    { id: '1', name: 'Alice', age: 25, hasCompletedTest: true },
    { id: '2', name: 'Bob', age: 30, hasCompletedTest: false },
    { id: '3', name: 'Charlie', age: 22, hasCompletedTest: true },
  ];

  const handleAddParticipant = () => {
    console.log('Add participant');
  };

  const handleParticipantPress = (participantId: string) => {
    router.push(`/participants/${participantId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-neutral-900">Group Details</Text>
          <Text className="text-neutral-500 mt-1">Manage participants and tests</Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row mb-6">
          <View className="flex-1 bg-white p-4 rounded-lg shadow-sm mr-2">
            <Text className="text-neutral-500">Total</Text>
            <Text className="text-2xl font-semibold text-neutral-900">{participants.length}</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-lg shadow-sm ml-2">
            <Text className="text-neutral-500">Completed</Text>
            <Text className="text-2xl font-semibold text-neutral-900">
              {participants.filter(p => p.hasCompletedTest).length}
            </Text>
          </View>
        </View>

        {/* Search/Filter Bar */}
        <TouchableOpacity 
          className="flex-row items-center bg-white rounded-lg px-4 py-3 mb-4 shadow-sm"
        >
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <Text className="ml-2 text-neutral-500">Search participants...</Text>
        </TouchableOpacity>

        {/* Participants List */}
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ParticipantListItem 
              participant={item} 
              onPress={() => handleParticipantPress(item.id)}
            />
          )}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        />

        {/* Add Participant Button */}
        <TouchableOpacity
          onPress={handleAddParticipant}
          className="bg-primary-500 mx-4 mb-6 p-4 rounded-lg shadow-sm flex-row justify-center items-center"
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="font-semibold text-white text-lg ml-2">Add Participant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
