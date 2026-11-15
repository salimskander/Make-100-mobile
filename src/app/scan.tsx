import { router } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Button title="Lancer la partie" onPress={() => router.replace('/game')} />
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
