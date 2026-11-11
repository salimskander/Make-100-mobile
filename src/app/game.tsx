import { router } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <Button title="Voir le résultat" onPress={() => router.replace('/result')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
