import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { colors, pressedStyle, radius, shadow, spacing, typography } from '@/constants/theme';
import { scanDigits } from '@/services/ocr';

const REQUIRED_DIGITS = 6;

type Step = 'camera' | 'reading' | 'select';

export default function ScanScreen() {
  const insets = useSafeAreaInsets(); // hauteur de la barre de navigation du téléphone, en bas
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [step, setStep] = useState<Step>('camera');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [detectedDigits, setDetectedDigits] = useState<number[]>([]);
  // Positions (dans detectedDigits) des chiffres choisis, dans l'ordre où le joueur les touche
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function takePhotoAndRead() {
    setError(null);
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
    if (!photo) return;

    setStep('reading');
    try {
      const digits = await scanDigits(photo.uri);
      if (digits.length < REQUIRED_DIGITS) {
        setError(
          `Seulement ${digits.length} chiffre(s) détecté(s). Rapproche-toi et réessaie.`,
        );
        setStep('camera');
        return;
      }
      setDetectedDigits(digits);
      setSelectedIndexes([]);
      setStep('select');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'La lecture de la photo a échoué.');
      setStep('camera');
    }
  }

  function toggleDigit(index: number) {
    setSelectedIndexes((current) => {
      if (current.includes(index)) {
        return current.filter((i) => i !== index); // déjà choisi : on le retire
      }
      if (current.length >= REQUIRED_DIGITS) {
        return current; // déjà 6 chiffres : on ignore
      }
      return [...current, index];
    });
  }

  function startGame() {
    const digits = selectedIndexes.map((i) => detectedDigits[i]).join('');
    router.replace({ pathname: '/game', params: { digits } });
  }

  // 1. Permission caméra
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.textMuted} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          L’appareil photo est nécessaire pour lire les chiffres d’une photo.
        </Text>
        {permission.canAskAgain ? (
          <Button title="Autoriser l’appareil photo" onPress={requestPermission} />
        ) : (
          <Button title="Ouvrir les réglages" onPress={() => Linking.openSettings()} />
        )}
      </View>
    );
  }

  // 2. Lecture en cours
  if (step === 'reading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.textMuted} />
        <Text style={styles.hint}>Lecture des chiffres…</Text>
      </View>
    );
  }

  // 3. Choix des 6 chiffres
  if (step === 'select') {
    const isComplete = selectedIndexes.length === REQUIRED_DIGITS;
    return (
      <ScrollView contentContainerStyle={[styles.selectContainer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Text style={styles.title}>
          Choisis {REQUIRED_DIGITS} chiffres ({selectedIndexes.length}/{REQUIRED_DIGITS})
        </Text>
        <Text style={styles.hint}>L’ordre dans lequel tu les touches sera l’ordre de la partie.</Text>

        <View style={styles.digitGrid}>
          {detectedDigits.map((digit, index) => {
            const order = selectedIndexes.indexOf(index);
            const isSelected = order !== -1;
            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [styles.digit, isSelected && styles.digitSelected, pressed && pressedStyle]}
                onPress={() => toggleDigit(index)}
              >
                <Text style={[styles.digitText, isSelected && styles.digitTextSelected]}>
                  {digit}
                </Text>
                {isSelected && <Text style={styles.digitOrder}>{order + 1}</Text>}
              </Pressable>
            );
          })}
        </View>

        <Button title="Lancer la partie" onPress={startGame} disabled={!isComplete} />
        <Button title="Reprendre une photo" variant="secondary" onPress={() => setStep('camera')} />
      </ScrollView>
    );
  }

  // 4. Visée
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />
      {/* Cadre de visée, posé par-dessus la caméra */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.overlayText}>Place les chiffres dans le cadre</Text>
      </View>

      <View style={[styles.bottomBar, { bottom: insets.bottom + spacing.xxl }]}>
        {error !== null && <Text style={styles.errorOnCamera}>{error}</Text>}
        {/* Pilule blanche : la pilule noire disparaîtrait sur l'image sombre de la caméra */}
        <Button
          title="Prendre la photo"
          variant="secondary"
          onPress={takePhotoAndRead}
          disabled={!isCameraReady}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  message: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // L'image de la caméra est sombre : fond noir le temps qu'elle s'affiche, textes en blanc
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  frame: {
    width: '85%',
    height: 140,
    borderWidth: 2,
    borderColor: colors.onPrimary,
    borderRadius: radius.lg,
  },
  overlayText: {
    ...typography.body,
    color: colors.onPrimary,
  },
  bottomBar: {
    position: 'absolute', // la position du bas est calculée avec la zone sûre, dans le composant
    left: spacing.xl,
    right: spacing.xl,
    gap: spacing.md,
  },
  errorOnCamera: {
    ...typography.caption,
    color: colors.onPrimary,
    backgroundColor: colors.error,
    padding: spacing.sm,
    borderRadius: radius.md,
    textAlign: 'center',
  },
  selectContainer: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  digitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  digit: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    boxShadow: shadow.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitSelected: {
    backgroundColor: colors.primary,
  },
  digitText: {
    ...typography.heading,
    color: colors.text,
  },
  digitTextSelected: {
    color: colors.onPrimary,
  },
  digitOrder: {
    position: 'absolute',
    top: 2,
    right: 4,
    ...typography.caption,
    color: colors.onPrimary,
  },
});
