import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';


type Participant = {
  id: string;
  name: string;
  age: number;
  hasCompletedTest: boolean;
};

const handleStartTest = (id: string) => {
  if (id) {
    router.replace(`/tests/${id}`);
  } else {
    console.error('Participant ID is undefined');
  }
};

export default function ParticipantDetailsScreen() {
  const { id } = useLocalSearchParams();

  // Mock data for the participant
  const participant: Participant = {
    id: id as string,
    name: 'John Doe',
    age: 28,
    hasCompletedTest: true,
  };



  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Participant Details</Text>
      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Text className="text-lg font-semibold mb-2">Name: {participant.name}</Text>
        <Text className="text-md mb-2">Age: {participant.age}</Text>
        <Text className="text-md mb-2">
        </Text>
      </View>
      
        <TouchableOpacity
          onPress={() => handleStartTest(participant.id)}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="font-bold text-white text-lg text-center">Start Test</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}
