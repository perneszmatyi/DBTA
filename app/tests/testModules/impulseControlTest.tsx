import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ImpulseControlTestProps {
  onComplete: () => void;
}

const ImpulseControlTest: React.FC<ImpulseControlTestProps> = ({ onComplete }) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-blue-600">Impulse Control Test</Text>
      <Text className="text-lg mb-8 text-center px-4">Test your ability to control impulses.</Text>
      <TouchableOpacity onPress={onComplete} className="bg-blue-500 p-4 rounded-lg shadow-md">
        <Text className="text-white text-center font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImpulseControlTest;
