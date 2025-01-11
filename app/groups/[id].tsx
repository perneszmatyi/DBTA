import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/navigation/Header';
import AddParticipantModal from '@/components/AddparticipantModal';
import { useParticipantContext } from '@/context/ParticipantContext';
import { useGroupContext } from '@/context/GroupContext';

const ParticipantListItem = ({ participant, onPress }: { participant: any; onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="mb-3 bg-white rounded-lg shadow-sm overflow-hidden"
  >
    <View className="p-4 flex-row justify-between items-center">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
          <Text className="text-primary-500 font-semibold">{participant.firstName.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-neutral-900">{`${participant.firstName} ${participant.lastName}`}</Text>
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
  const { participants, fetchParticipants, addParticipant } = useParticipantContext();
  const { deleteGroup } = useGroupContext();
  const [isAddParticipantModalVisible, setIsAddParticipantModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchParticipants(id as string);
    }
  }, [id]);

  const handleAddParticipant = async (participantData: any) => {
    try {
      await addParticipant(id as string, {
        ...participantData,
        age: parseInt(participantData.age),
        hasCompletedTest: false,
        lastTestDate: null
      });
      setIsAddParticipantModalVisible(false);
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  const handleParticipantPress = (participantId: string) => {
    router.push(`/participants/${participantId}`);
  };

  const handleDeleteGroup = async () => {
    setIsMenuVisible(false);
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroup(id as string);
              router.replace('/');
            } catch (error) {
              console.error('Error deleting group:', error);
              Alert.alert('Error', 'Failed to delete group. Please try again.');
            }
          }
        }
      ]
    );
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
            onPress={handleDeleteGroup}
            className="flex-row items-center px-4 py-3"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text className="ml-2 text-red-500">Delete Group</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <Header 
        title="Group Details" 
        path={() => router.replace(`/`)}
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
          onPress={() => setIsAddParticipantModalVisible(true)}
          className="bg-primary-500 mx-4 mb-6 p-4 rounded-lg shadow-sm flex-row justify-center items-center"
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="font-semibold text-white text-lg ml-2">Add Participant</Text>
        </TouchableOpacity>
        <AddParticipantModal
          isVisible={isAddParticipantModalVisible}
          onClose={() => setIsAddParticipantModalVisible(false)}
          onSubmit={handleAddParticipant}
        />  
      </View>
    </SafeAreaView>
  );
}
