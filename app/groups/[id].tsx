import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Participant = {
  id: string;
  name: string;
  age: number;
  hasCompletedTest: boolean;
};

const ParticipantListItem = ({ participant, onPress }: { participant: Participant; onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="p-4 bg-white mb-2 rounded-lg border border-gray-300 flex-row justify-between items-center"
  >
    <View>
      <Text className="text-lg font-semibold">{participant.name}</Text>
      <Text className="text-sm text-gray-600">Age: {participant.age}</Text>
    </View>
    <View className={`px-2 py-1 rounded ${participant.hasCompletedTest ? 'bg-green-200' : 'bg-yellow-200'}`}>
      <Text className="text-xs">
        {participant.hasCompletedTest ? 'Test Completed' : 'No Test'}
      </Text>
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
    // Navigate to add participant screen
    console.log('Add participant');
  };

  const handleParticipantPress = (participantId: string) => {
    router.push(`/participants/${participantId}`);
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Group Details and Participants</Text>
      <Text className="text-md mb-4">Group ID: {id}</Text>
      <View className="flex-1 bg-gray-100 rounded-lg p-2">
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ParticipantListItem 
              participant={item} 
              onPress={() => handleParticipantPress(item.id)}
            />
          )}
        />
      </View>
      <TouchableOpacity
        onPress={handleAddParticipant}
        className="mt-4 bg-blue-500 p-3 rounded-lg"
      >
        <Text className="font-bold text-white text-lg text-center">Add Participant</Text>
      </TouchableOpacity>
    </View>
  );
}
