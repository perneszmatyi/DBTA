import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AttentionTestProps {
  onComplete: () => void;
}

const AttentionTest: React.FC<AttentionTestProps> = ({ onComplete }) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-green-600">Attention Test</Text>
      <Text className="text-lg mb-8 text-center px-4">Measure your ability to focus and maintain attention.</Text>
      <TouchableOpacity onPress={onComplete} className="bg-green-500 p-4 rounded-lg shadow-md">
        <Text className="text-white text-center font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AttentionTest;
