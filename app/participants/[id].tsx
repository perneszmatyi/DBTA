import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Participant = {
  id: string;
  name: string;
  age: number;
  hasCompletedTest: boolean;
  lastTestDate?: string;
  testResults?: {
    reactionTime: number;
    memoryScore: number;
    balanceScore: number;
    trackingScore: number;
  };
};

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <View className="bg-white p-4 rounded-lg shadow-sm">
    <View className="flex-row items-center mb-2">
      <Ionicons name={icon as any} size={20} color="#6B7280" />
      <Text className="text-neutral-500 ml-2">{label}</Text>
    </View>
    <Text className="text-2xl font-semibold text-neutral-900">{value}</Text>
  </View>
);

export default function ParticipantDetailsScreen() {
  const { id } = useLocalSearchParams();

  // Mock data for the participant
  const participant: Participant = {
    id: id as string,
    name: 'John Doe',
    age: 28,
    hasCompletedTest: true,
    lastTestDate: '2024-02-15',
    testResults: {
      reactionTime: 245,
      memoryScore: 85,
      balanceScore: 92,
      trackingScore: 78,
    },
  };

  const handleStartTest = (id: string) => {
    if (id) {
      router.push(`/tests/${id}`);
    } else {
      console.error('Participant ID is undefined');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1">
        <View className="px-4">
          {/* Header */}
          <View className="py-6">
            <View className="flex-row items-center mb-2">
              <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
                <Text className="text-primary-500 text-xl font-semibold">
                  {participant.name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text className="text-3xl font-bold text-neutral-900">{participant.name}</Text>
                <Text className="text-neutral-500">ID: {participant.id}</Text>
              </View>
            </View>
          </View>

          {/* Status Badge */}
          <View className="mb-6">
            <View className={`self-start px-4 py-2 rounded-full ${
              participant.hasCompletedTest ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Text className={`text-sm font-medium ${
                participant.hasCompletedTest ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {participant.hasCompletedTest ? 'Tests Completed' : 'Tests Pending'}
              </Text>
            </View>
          </View>

          {/* Basic Info */}
          <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-neutral-500">Age</Text>
                <Text className="text-neutral-900">{participant.age} years</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-500">Last Test Date</Text>
                <Text className="text-neutral-900">
                  {participant.lastTestDate ? new Date(participant.lastTestDate).toLocaleDateString() : 'Not tested'}
                </Text>
              </View>
            </View>
          </View>

          {/* Test Results */}
          {participant.hasCompletedTest && participant.testResults && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-neutral-900 mb-4">Previous Results</Text>
              <View className="grid grid-cols-2 gap-3">
                <StatCard 
                  label="Reaction Time" 
                  value={`${participant.testResults.reactionTime}ms`}
                  icon="flash-outline"
                />
                <StatCard 
                  label="Memory Score" 
                  value={`${participant.testResults.memoryScore}%`}
                  icon="cellular-outline"
                />
                <StatCard 
                  label="Balance Score" 
                  value={participant.testResults.balanceScore}
                  icon="fitness-outline"
                />
                <StatCard 
                  label="Tracking Score" 
                  value={participant.testResults.trackingScore}
                  icon="locate-outline"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Start Test Button */}
      <View className="px-4 py-6 bg-neutral-50">
        <TouchableOpacity
          onPress={() => handleStartTest(participant.id)}
          className="bg-primary-500 p-4 rounded-lg shadow-sm flex-row justify-center items-center"
        >
          <Ionicons name="play-circle-outline" size={24} color="white" />
          <Text className="font-semibold text-white text-lg ml-2">
            {participant.hasCompletedTest ? 'Retake Tests' : 'Start Tests'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
