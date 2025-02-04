import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

type LoadingScreenProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function LoadingScreen({ message = 'Loading...', fullScreen = true }: LoadingScreenProps) {
  const containerClass = fullScreen 
    ? "flex-1 justify-center items-center bg-neutral-50" 
    : "p-4 justify-center items-center";

  return (
    <View className={containerClass}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text className="text-neutral-600 mt-4 text-center font-medium">
        {message}
      </Text>
    </View>
  );
} 