import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useParticipantContext } from '@/context/ParticipantContext';
import Header from '@/components/navigation/Header';
import LoadingScreen from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';

type FormData = {
  firstName: string;
  lastName: string;
  age: string;
  gender: 'male' | 'female';
  drivingExperience: string;
  intoxicationLevel: string;
};

export default function NewParticipantScreen() {
  const { groupId } = useLocalSearchParams();
  const { addParticipant } = useParticipantContext();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: '',
    gender: 'male',
    drivingExperience: '',
    intoxicationLevel: ''
  });

  const handleSubmit = async () => {
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) errors.push('First name');
    if (!formData.lastName.trim()) errors.push('Last name');
    if (!formData.age.trim()) errors.push('Age');
    if (!formData.gender) errors.push('Gender');
    if (!formData.intoxicationLevel.trim()) errors.push('Blood Alcohol Content');
    if (!formData.drivingExperience.trim()) errors.push('Driving experience');

    if (errors.length > 0) {
      Alert.alert(
        'Missing Information',
        `Please fill in the following fields:\n${errors.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    setIsCreating(true);
    try {
      const participantData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: Number(formData.age.trim()),
        gender: formData.gender,
        drivingExperience: formData.drivingExperience.trim(),
        intoxicationLevel: formData.intoxicationLevel.trim(),
        hasCompletedTest: false,
        lastTestDate: null
      };

      await addParticipant(groupId as string, participantData);
      router.back();
    } catch (error) {
      console.error('Error creating participant:', error);
      Alert.alert('Error', 'Failed to create participant');
    } finally {
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return <LoadingScreen message="Creating participant..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <Stack.Screen 
        options={{
          headerShown: false
        }}
      />
      <Header 
        title="New Participant"
        showBack={true}
      />

      <View className="flex-1 p-4">
        <View className="space-y-4">
          <View>
            <Text className="text-neutral-600 mb-1">First Name *</Text>
            <TextInput
              className="bg-white p-3 rounded-lg"
              value={formData.firstName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
              placeholder="Enter first name"
            />
          </View>

          <View>
            <Text className="text-neutral-600 mb-1">Last Name *</Text>
            <TextInput
              className="bg-white p-3 rounded-lg"
              value={formData.lastName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
              placeholder="Enter last name"
            />
          </View>

          <View>
            <Text className="text-neutral-600 mb-1">Age *</Text>
            <TextInput
              className="bg-white p-3 rounded-lg"
              value={formData.age}
              onChangeText={(text) => setFormData(prev => ({ ...prev, age: text.replace(/[^0-9]/g, '') }))}
              placeholder="Enter age"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text className="text-neutral-600 mb-1">Gender *</Text>
            <View className="flex-row space-x-3">
              {(['male', 'female'] as const).map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => setFormData(prev => ({ ...prev, gender }))}
                  className={`flex-1 p-3 rounded-lg flex-row justify-center items-center ${
                    formData.gender === gender ? 'bg-primary-500' : 'bg-white'
                  }`}
                >
                  <Ionicons 
                    name={gender === 'male' ? 'male' : 'female'} 
                    size={20} 
                    color={formData.gender === gender ? 'white' : '#666'}
                  />
                  <Text className={`ml-2 capitalize ${
                    formData.gender === gender ? 'text-white' : 'text-neutral-700'
                  }`}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-neutral-600 mb-1">Driving Experience (years) *</Text>
            <TextInput
              className="bg-white p-3 rounded-lg"
              value={formData.drivingExperience}
              onChangeText={(text) => setFormData(prev => ({ ...prev, drivingExperience: text.replace(/[^0-9]/g, '') }))}
              placeholder="Enter driving experience"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text className="text-neutral-600 mb-1">Blood Alcohol Content *</Text>
            <TextInput
              className="bg-white p-3 rounded-lg"
              value={formData.intoxicationLevel}
              onChangeText={(text) => setFormData(prev => ({ ...prev, intoxicationLevel: text }))}
              placeholder="Enter BAC level"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary-500 py-4 rounded-lg mt-8"
        >
          <Text className="text-white text-center font-medium">Create Participant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 