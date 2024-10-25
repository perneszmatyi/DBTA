import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type MemoryTestProps = {
  onComplete: () => void;
};

const MemoryTest = ({ onComplete }: MemoryTestProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-yellow-600">Memory Test</Text>
      <Text className="text-lg mb-8 text-center px-4">Assess your short-term memory capacity.</Text>
      <TouchableOpacity onPress={onComplete} className="bg-yellow-500 p-4 rounded-lg shadow-md">
        <Text className="text-white text-center font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MemoryTest;
