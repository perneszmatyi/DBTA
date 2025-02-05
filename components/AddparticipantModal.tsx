import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AddParticipantProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (participant: {
    firstName: string;
    lastName: string;
    age: string;
    gender: 'male' | 'female';
    intoxicationLevel: string;
    drivingExperience: string;
  }) => void;
}

export default function AddParticipantModal({ isVisible, onClose, onSubmit }: AddParticipantProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    intoxicationLevel: '',
    drivingExperience: ''
  });

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) errors.push('First name');
    if (!formData.lastName.trim()) errors.push('Last name');
    if (!formData.age.trim()) errors.push('Age');
    if (!formData.gender) errors.push('Gender');
    if (!formData.intoxicationLevel.trim()) errors.push('Blood Alcohol Content');
    if (!formData.drivingExperience.trim()) errors.push('Driving experience');

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      Alert.alert(
        'Missing Information',
        `Please fill in the following fields:\n${errors.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    onSubmit(formData);
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: 'male',
      intoxicationLevel: '',
      drivingExperience: ''
    });
    onClose();
  };

  const handleAgeChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, age: numericValue }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-white rounded-t-3xl h-[90%] shadow-lg">
              {/* Header */}
              <View className="flex-row justify-between items-center p-5 border-b border-neutral-200">
                <TouchableOpacity 
                  onPress={onClose}
                  className="p-2 -ml-2"
                >
                  <Ionicons name="close-outline" size={24} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-neutral-900">Add Participant</Text>
                <TouchableOpacity 
                  onPress={handleSubmit}
                  className="bg-primary-500 px-4 py-2 rounded-full"
                >
                  <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1 px-5 pt-2">
                {/* Personal Information */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-neutral-900 mb-4">
                    Personal Information
                    <Text className="text-red-500"> *</Text>
                  </Text>
                  <View className="space-y-6">
                    <View>
                      <Text className="text-neutral-600 mb-2">First Name *</Text>
                      <TextInput
                        className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                        placeholderTextColor="#999"
                      />
                    </View>
                    <View>
                      <Text className="text-neutral-600 mb-2">Last Name *</Text>
                      <TextInput
                        className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                        placeholderTextColor="#999"
                      />
                    </View>
                    <View>
                      <Text className="text-neutral-600 mb-2">Age *</Text>
                      <TextInput
                        className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                        placeholder="Enter age"
                        value={formData.age}
                        onChangeText={handleAgeChange}
                        keyboardType="numeric"
                        maxLength={3}
                        placeholderTextColor="#999"
                      />
                    </View>
                    
                    {/* Gender Selection */}
                    <View>
                      <Text className="text-neutral-600 mb-2">Gender *</Text>
                      <View className="flex-row space-x-3">
                        {['male', 'female'].map((gender) => (
                          <TouchableOpacity
                            key={gender}
                            onPress={() => setFormData(prev => ({ ...prev, gender: gender as 'male' | 'female' }))}
                            className={`flex-1 py-3.5 px-4 rounded-xl flex-row justify-center items-center space-x-2 ${
                              formData.gender === gender ? 'bg-primary-500' : 'bg-neutral-50 border border-neutral-200'
                            }`}
                          >
                            <Ionicons 
                              name={gender === 'male' ? 'male' : 'female'} 
                              size={18} 
                              color={formData.gender === gender ? 'white' : '#666'}
                            />
                            <Text className={`text-center capitalize ${
                              formData.gender === gender ? 'text-white' : 'text-neutral-700'
                            }`}>
                              {gender}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Testing Context */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-neutral-900 mb-4">
                    Testing Context
                    <Text className="text-red-500"> *</Text>
                  </Text>
                  <View>
                    <Text className="text-neutral-600 mb-2">Blood Alcohol Content (BAC) *</Text>
                    <TextInput
                      className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                      placeholder="Enter BAC level"
                      value={formData.intoxicationLevel}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, intoxicationLevel: text }))}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Driving Background */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-neutral-900 mb-4">
                    Driving Background
                    <Text className="text-red-500"> *</Text>
                  </Text>
                  <View>
                    <Text className="text-neutral-600 mb-2">Years of driving experience *</Text>
                    <TextInput
                      className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                      placeholder="Enter years of experience"
                      value={formData.drivingExperience}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, drivingExperience: text }))}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}