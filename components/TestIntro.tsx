// components/TestIntro.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type TestIntroProps = {
  title: string;
  description: string;
  instructions: string[];
  onStart: () => void;
};

export default function TestIntro({ title, description, instructions, onStart }: TestIntroProps) {
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(3);


  // The countdown funcitionality needs to be changed later
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

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-5">
      {!counting ? (
        <>
          <Text className="text-3xl font-bold mb-6 text-purple-700">{title}</Text>
          <Text className="text-lg mb-8 text-center text-gray-600">{description}</Text>
          <View className="w-full space-y-3 mb-8">
            {instructions.map((instruction, index) => (
              <Text key={index} className="text-base text-gray-700">
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>
          <TouchableOpacity 
            className="bg-purple-700 px-6 py-3 rounded-lg shadow-md"
            onPress={handlePress}
          >
            <Text className="text-white font-bold text-lg">Start Test</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text className="text-6xl font-bold text-purple-700">{count}</Text>
      )}
    </View>
  );
};