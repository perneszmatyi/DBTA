import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TestIntro from '@/components/TestIntro';

type BalanceTestProps = {
  onComplete: (results: {
    averageDeviation: number;
    maxDeviation: number;
    testDuration: number;
  }) => void;
};

const BalanceTest = ({ onComplete }: BalanceTestProps) => {
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [testFinished, setTestFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted) {
      setTestFinished(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [testStarted, timeLeft]);

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(10);
    setTestFinished(false);
    // TODO: Start accelerometer data collection
  };

  const handleComplete = () => {
    onComplete({
      averageDeviation: 0,
      maxDeviation: 0,
      testDuration: 10
    });
  };

  if (testFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Test Completed!</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleComplete}
        >
          <Text style={styles.buttonText}>Continue to Next Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!testStarted) {
    return (
      <TestIntro
        title="Testing Balance"
        description="Hold your phone steady against your chest while standing:"
        instructions={["Stand with feet together", "Hold phone flat against chest", "Stay as still as possible for 10 seconds"]}
        onStart={startTest}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Testing Balance</Text>
      <Text style={styles.timer}>{timeLeft}</Text>
      {/* TODO: Add real-time feedback components */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#6b46c1',
  },
  description: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    color: '#4a5568',
  },
  button: {
    backgroundColor: '#6b46c1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6b46c1',
    marginVertical: 20,
  },
});

export default BalanceTest;
