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

import { scanDigits } from '@/services/ocr';

const REQUIRED_DIGITS = 6;

type Step = 'camera' | 'reading' | 'select';

export default function ScanScreen() {
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
        <ActivityIndicator size="large" />
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
          <Pressable style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Autoriser l’appareil photo</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Ouvrir les réglages</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // 2. Lecture en cours
  if (step === 'reading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Lecture des chiffres…</Text>
      </View>
    );
  }

  // 3. Choix des 6 chiffres
  if (step === 'select') {
    const isComplete = selectedIndexes.length === REQUIRED_DIGITS;
    return (
      <ScrollView contentContainerStyle={styles.selectContainer}>
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
                style={[styles.digit, isSelected && styles.digitSelected]}
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

        <Pressable
          style={[styles.button, !isComplete && styles.buttonDisabled]}
          onPress={startGame}
          disabled={!isComplete}
        >
          <Text style={styles.buttonText}>Lancer la partie</Text>
        </Pressable>
        <Pressable onPress={() => setStep('camera')}>
          <Text style={styles.link}>Reprendre une photo</Text>
        </Pressable>
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

      <View style={styles.bottomBar}>
        {error !== null && <Text style={styles.errorOnCamera}>{error}</Text>}
        <Pressable
          style={[styles.captureButton, !isCameraReady && styles.buttonDisabled]}
          onPress={takePhotoAndRead}
          disabled={!isCameraReady}
        >
          <Text style={styles.buttonText}>Prendre la photo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hint: {
    color: '#64748B',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#2563EB',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  frame: {
    width: '85%',
    height: 140,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    gap: 12,
  },
  errorOnCamera: {
    color: '#FFFFFF',
    backgroundColor: '#DC2626',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  captureButton: {
    backgroundColor: '#2563EB',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectContainer: {
    padding: 24,
    gap: 16,
  },
  digitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  digit: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  digitText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  digitTextSelected: {
    color: '#FFFFFF',
  },
  digitOrder: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 11,
    color: '#FFFFFF',
  },
});