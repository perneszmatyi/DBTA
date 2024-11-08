import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TestCompleteProps = {
  title?: string;
  message?: string;
  onComplete: () => void;
  results?: Record<string, number | string>;
};

export default function TestComplete({ 
  title = "Test Completed!",
  message = "Great job completing the test.",
  onComplete,
  results
}: TestCompleteProps) {
  return (
    <View className="flex-1 bg-neutral-50 items-center justify-center px-6">
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
        </View>
        <Text className="text-2xl font-semibold text-neutral-900 text-center mb-2">
          {title}
        </Text>
        <Text className="text-neutral-500 text-center mb-6">
          {message}
        </Text>

        {results && (
          <View className="w-full bg-white rounded-lg p-4 mb-8">
            {Object.entries(results).map(([key, value]) => (
              <View key={key} className="flex-row justify-between py-2">
                <Text className="text-neutral-500">{key}</Text>
                <Text className="text-neutral-900 font-medium">{value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={onComplete}
        className="bg-primary-500 w-full p-4 rounded-lg shadow-sm flex-row justify-center items-center"
      >
        <Text className="font-semibold text-white text-lg">
          Continue to Next Test
        </Text>
      </TouchableOpacity>
    </View>
  );
}