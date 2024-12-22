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
  Keyboard
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

  const handleSubmit = () => {
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
              {/* Enhanced Header */}
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
                  <Text className="text-lg font-semibold text-neutral-900 mb-4 flex-row items-center">
                    Personal Information
                  </Text>
                  <View className="space-y-4">
                    <View>
                      <TextInput
                        className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                        placeholderTextColor="#999"
                      />
                    </View>
                    <View>
                      <TextInput
                        className="bg-neutral-50 mt-4 px-4 py-3.5 rounded-xl border border-neutral-200"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                        placeholderTextColor="#999"
                      />
                    </View>
                    <View>
                      <TextInput
                        className="bg-neutral-50 mt-4 mb-8 px-4 py-3.5 rounded-xl border border-neutral-200"
                        placeholder="Age"
                        value={formData.age}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>
                    
                    {/* Enhanced Gender Selection */}
                    <View className="flex-row space-x-3">
                      {['male', 'female'].map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          onPress={() => setFormData(prev => ({ ...prev, gender: gender as 'male' | 'female' }))}
                          className={`flex-1 py-3.5 px-4 mr-2 rounded-xl flex-row justify-center items-center space-x-2 ${
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

                {/* Testing Context */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-neutral-900 mb-4 flex-row items-center">
                    Testing Context
                  </Text>
                  <TextInput
                    className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                    placeholder="Blood Alcohol Content (BAC)"
                    value={formData.intoxicationLevel}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, intoxicationLevel: text }))}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Driving Background */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-neutral-900 mb-4 flex-row items-center">
                    Driving Background
                  </Text>
                  <TextInput
                    className="bg-neutral-50 px-4 py-3.5 rounded-xl border border-neutral-200"
                    placeholder="Years of driving experience"
                    value={formData.drivingExperience}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, drivingExperience: text }))}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}