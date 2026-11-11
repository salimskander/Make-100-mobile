import { router } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Button title="Retour à l'accueil" onPress={() => router.back()} />
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
