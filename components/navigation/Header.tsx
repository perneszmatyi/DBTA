import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  title?: string;
  path?: () => void;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  testProgress?: {
    current: number;
    total: number;
  };
}

export default function Header({ 
  title, 
  path = () => router.back(),
  showBack = true, 
  rightElement,
  testProgress 
}: HeaderProps) {
  const router = useRouter();

  return (
    <View className="px-4 py-6 bg-neutral-50 flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity 
            onPress={path}
            className="mr-2"
          >
            <Ionicons name="chevron-back" size={24} color="#404040" />
          </TouchableOpacity>
        )}
        
        <View>
          {title && (
            <Text className="text-xl font-semibold text-neutral-900">
              {title}
            </Text>
          )}
          {testProgress && (
            <Text className="text-sm text-neutral-500">
              Test {testProgress.current} of {testProgress.total}
            </Text>
          )}
        </View>
      </View>

      {rightElement && (
        <View>
          {rightElement}
        </View>
      )}
    </View>
  );
}