import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CreateGroupModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (groupName: string) => void;
}

export default function CreateGroupModal({ isVisible, onClose, onSubmit }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = () => {
    if (groupName.trim()) {
      onSubmit(groupName.trim());
      setGroupName('');
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-[90%] rounded-xl p-6">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-semibold text-neutral-900">
                  Create New Group
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Input */}
              <TextInput
                className="bg-neutral-100 px-4 py-3 rounded-lg mb-6"
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setGroupName}
                autoFocus
              />

              {/* Buttons */}
              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity 
                  onPress={onClose}
                  className="px-4 py-2"
                >
                  <Text className="text-neutral-500 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSubmit}
                  className="bg-primary-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Create Group</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}