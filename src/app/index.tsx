
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  insertSymbol,
  removeSymbol
} from '@/features/game/expression';
import { generateNumbers } from '@/features/game/generate-numbers';

const SYMBOLS = ['+', '−', '×', '÷', '^', '(', ')'];

export default function HomeScreen() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [slots, setSlots] = useState<string[]>(Array(7).fill(''));
  const [position, setPosition] = useState(0);
  const [cursor, setCursor] = useState(0);

  function handleGenerate() {
    setNumbers(generateNumbers());
    setSlots(Array(7).fill(''));
    setPosition(0);
    setCursor(0);
  }

  function handleInsert(symbol: string) {
    const next = insertSymbol(slots, position, cursor, symbol);

    if (next !== slots) {
      setSlots(next);
      setCursor(cursor + 1);
    }
  }

  function handleRemove() {
    if (cursor === 0) return;

    setSlots(removeSymbol(slots, position, cursor));
    setCursor(cursor - 1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Make 100</Text>

      {numbers.length === 6 && (
        <>
          <View style={styles.expressionContainer}>
            {numbers.map((number, index) => (
              <View key={index} style={styles.group}>
                {Array.from(
                  { length: slots[index].length + 1 },
                  (_, offset) => (
                    <View key={offset} style={styles.group}>
                      <Pressable
                        style={styles.cursorArea}
                        onPress={() => {
                          setPosition(index);
                          setCursor(offset);
                        }}
                      >
                        {position === index && cursor === offset && (
                          <View style={styles.cursor} />
                        )}
                      </Pressable>

                      {offset < slots[index].length && (
                        <Text style={styles.symbol}>
                          {slots[index][offset]}
                        </Text>
                      )}
                    </View>
                  )
                )}

                <Text style={styles.number}>{number}</Text>
              </View>
            ))}

            {Array.from(
              { length: slots[6].length + 1 },
              (_, offset) => (
                <View key={offset} style={styles.group}>
                  <Pressable
                    style={styles.cursorArea}
                    onPress={() => {
                      setPosition(6);
                      setCursor(offset);
                    }}
                  >
                    {position === 6 && cursor === offset && (
                      <View style={styles.cursor} />
                    )}
                  </Pressable>

                  {offset < slots[6].length && (
                    <Text style={styles.symbol}>
                      {slots[6][offset]}
                    </Text>
                  )}
                </View>
              )
            )}
          </View>

          <View style={styles.keyboard}>
            {SYMBOLS.map((symbol) => (
              <Pressable
                key={symbol}
                style={styles.key}
                onPress={() => handleInsert(symbol)}
              >
                <Text style={styles.keyText}>{symbol}</Text>
              </Pressable>
            ))}

            <Pressable style={styles.key} onPress={handleRemove}>
              <Text style={styles.keyText}>⌫</Text>
            </Pressable>
          </View>
        </>
      )}

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
  expressionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
  },
  symbol: {
    fontSize: 28,
    color: '#000000',
  },
  cursorArea: {
    width: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursor: {
    width: 2,
    height: 30,
    backgroundColor: '#2563EB',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  key: {
    width: 64,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
  keyText: {
    fontSize: 26,
    color: '#000000',
  },
});
