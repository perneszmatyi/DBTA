// components/TestIntro.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TestIntroProps = {
  title: string;
  description: string;
  instructions: string[];
  onStart: () => void;
};

export default function TestIntro({ title, description, instructions, onStart }: TestIntroProps) {
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(3);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    
    if (counting) {
      setCount(3);
      
      countdown = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setTimeout(() => {
              onStart();
            }, 0);
            return 1;
          }
          // Animate number change
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdown) {
        clearInterval(countdown);
        setCount(3);
      }
    };
  }, [counting, onStart]);

  const handlePress = () => {
    setCounting(true);
  };

  if (counting) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <Animated.Text 
          style={{ opacity: fadeAnim }}
          className="text-8xl font-bold text-primary-500"
        >
          {count}
        </Animated.Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 px-6">
      {/* Header */}
      <View className="flex-1 justify-center">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="fitness-outline" size={32} color="#2563EB" />
          </View>
          <Text className="text-3xl font-bold text-neutral-900 text-center mb-2">
            {title}
          </Text>
          <Text className="text-lg text-neutral-500 text-center">
            {description}
          </Text>
        </View>

        {/* Instructions */}
        <View className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <Text className="text-lg font-semibold text-neutral-900 mb-4">
            Instructions
          </Text>
          <View className="space-y-4">
            {instructions.map((instruction, index) => (
              <View key={index} className="flex-row">
                <View className="w-6 h-6 bg-primary-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-500 font-medium">
                    {index + 1}
                  </Text>
                </View>
                <Text className="flex-1 text-neutral-700 leading-6">
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Start Button */}
      <View className="py-6">
        <TouchableOpacity 
          className="bg-primary-500 p-4 rounded-lg shadow-sm flex-row justify-center items-center"
          onPress={handlePress}
        >
          <Ionicons name="play-circle-outline" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Start Test
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}