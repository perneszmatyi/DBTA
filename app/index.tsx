import React from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const groups = [
    { id: 1, name: 'Group 1' },
    { id: 2, name: 'Group 2' },
    { id: 3, name: 'Group 3' },
    { id: 4, name: 'Group 4' },
    { id: 5, name: 'Group 5' },
  ];

  const handleCreateNewGroup = () => {
    // Logic to create a new group
    console.log('Create new group');
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4">
        <Text className="font-bold text-lg mb-4 text-center">Welcome to the Home Screen!</Text>
        <ScrollView className="flex-1">
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Link
                className="mt-2 bg-blue-500 p-2 rounded-lg w-full"
                href={`/groups/${item.id}`}
              >
                <Text className="font-bold text-white text-lg text-center">{item.name}</Text>
              </Link>
            )}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            scrollEnabled={false}
          />
        </ScrollView>
        <TouchableOpacity
          onPress={handleCreateNewGroup}
          className="mt-4 bg-green-500 p-3 rounded-lg"
        >
          <Text className="font-bold text-white text-lg text-center">Create New Group</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
