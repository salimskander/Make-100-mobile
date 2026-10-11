
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { generateNumbers } from '@/features/game/generate-numbers';

export default function HomeScreen() {
  const [numbers, setNumbers] = useState<number[]>([]);

  function handleGenerate() {
    setNumbers(generateNumbers());
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Make 100</Text>

      <View style={styles.numbersContainer}>
        {numbers.map((number, index) => (
          <Text key={index} style={styles.number}>
            {number}
          </Text>
        ))}
      </View>

      <Button title="Générer" onPress={handleGenerate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  number: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
  },
});
