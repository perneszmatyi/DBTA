import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type BalanceTestProps = {
  onComplete: () => void;
};

const BalanceTest = ({ onComplete }: BalanceTestProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-purple-600">Balance Test</Text>
      <Text className="text-lg mb-8 text-center px-4">Evaluate your balance and stability.</Text>
      <TouchableOpacity onPress={onComplete} className="bg-purple-500 p-4 rounded-lg shadow-md">
        <Text className="text-white text-center font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BalanceTest;
