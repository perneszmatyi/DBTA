import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/navigation/Header';
import { useParticipantContext } from '@/context/ParticipantContext';
import { useGroupContext } from '@/context/GroupContext';
import LoadingScreen from '@/components/LoadingScreen';
import { Timestamp } from 'firebase/firestore';

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <View className="bg-white p-4 rounded-lg shadow-sm">
    <View className="flex-row items-center mb-2">
      <Ionicons name={icon as any} size={20} color="#6B7280" />
      <Text className="text-neutral-500 ml-2">{label}</Text>
    </View>
    <Text className="text-2xl font-semibold text-neutral-900">{value}</Text>
  </View>
);

const formatDate = (date: Timestamp | Date | null) => {
  if (!date) return 'Not tested yet';
  
  const d = date instanceof Timestamp ? date.toDate() : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}/${month}/${day}`;
};

export default function ParticipantDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { currentParticipant, participants, deleteParticipant } = useParticipantContext();
  const { currentGroup } = useGroupContext();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Any initial data loading can go here
      } catch (error) {
        console.error('Error loading participant data:', error);
        Alert.alert('Error', 'Failed to load participant data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Find the participant in the list
  const participant = participants.find(p => p.id === id) || currentParticipant;

  const handleStartTest = (participantId: string) => {
    if (participantId) {
      router.replace(`/tests/${participantId}`);
    } else {
      console.error('Participant ID is undefined');
    }
  };

  const handleDeleteParticipant = async () => {
    setIsMenuVisible(false);
    setIsDeleting(true);
    try {
      if (participant && currentGroup) {
        await deleteParticipant(participant.id, currentGroup.id);
        router.replace(`/groups/${currentGroup.id}`);
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
      Alert.alert('Error', 'Failed to delete participant');
    } finally {
      setIsDeleting(false);
    }
  };

  const MenuModal = () => (
    <Modal
      transparent={true}
      visible={isMenuVisible}
      onRequestClose={() => setIsMenuVisible(false)}
      animationType="fade"
    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1} 
        onPress={() => setIsMenuVisible(false)}
      >
        <View className="absolute top-20 right-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <TouchableOpacity
            onPress={handleDeleteParticipant}
            className="flex-row items-center px-4 py-3"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text className="ml-2 text-red-500">Delete Participant</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (isLoading) {
    return <LoadingScreen message="Loading participant details..." />;
  }

  if (isDeleting) {
    return <LoadingScreen message="Deleting participant..." />;
  }

  if (!participant || !currentGroup) {
    return <LoadingScreen message="Loading participant details..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <Stack.Screen 
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'none'
        }}
      />
      <Header 
        title="Participant Details" 
        path={() => router.replace(`/groups/${currentGroup.id}`)}
        rightElement={
          <TouchableOpacity 
            onPress={() => setIsMenuVisible(true)}
            className="p-2"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#6B7280" />
          </TouchableOpacity>
        }
      />
      <MenuModal />
      <ScrollView className="flex-1">
        <View className="px-4">
          {/* Header */}
          <View className="py-6">
            <View className="flex-row items-center mb-2">
              <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
                <Text className="text-primary-500 text-xl font-semibold">
                  {participant.firstName.charAt(0)}
                </Text>
              </View>
              <View>
                <Text className="text-3xl font-bold text-neutral-900">
                  {`${participant.firstName} ${participant.lastName}`}
                </Text>
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
                <Text className="text-neutral-500">Gender</Text>
                <Text className="text-neutral-900 capitalize">{participant.gender}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-500">Driving Experience</Text>
                <Text className="text-neutral-900">{participant.drivingExperience} years</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-500">Intoxication Level</Text>
                <Text className="text-neutral-900">{participant.intoxicationLevel}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-500">Last Test Date</Text>
                <Text className="text-neutral-900">
                  {formatDate(participant.lastTestDate)}
                </Text>
              </View>
            </View>
          </View>
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
