import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ReactionTimeTestProps {
  onComplete: () => void;
}

const ReactionTimeTest: React.FC<ReactionTimeTestProps> = ({ onComplete }) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-red-600">Reaction Time Test</Text>
      <Text className="text-lg mb-8 text-center px-4">Test your speed of response to visual stimuli.</Text>
      <TouchableOpacity onPress={onComplete} className="bg-red-500 p-4 rounded-lg shadow-md">
        <Text className="text-white text-center font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReactionTimeTest;
