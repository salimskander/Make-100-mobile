import {
  AndroidImportance,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { Platform } from 'react-native';

const DAILY_CHALLENGE_ID = 'daily-challenge';
const CHANNEL_ID = 'daily-challenge';
const DAILY_HOUR = 18;
const DAILY_MINUTE = 0;

// Affiche aussi la notification quand l'app est ouverte
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Android 8+ : toute notification doit appartenir à un « canal », réglable par l'utilisateur
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Défi du jour',
    importance: AndroidImportance.DEFAULT,
  });
}

// Demande l'autorisation d'envoyer des notifications (obligatoire depuis Android 13)
async function ensurePermission(): Promise<boolean> {
  const current = await getPermissionsAsync();
  if (current.granted) return true;
  const requested = await requestPermissionsAsync();
  return requested.granted;
}

export async function isDailyChallengeScheduled(): Promise<boolean> {
  const scheduled = await getAllScheduledNotificationsAsync();
  return scheduled.some((notification) => notification.identifier === DAILY_CHALLENGE_ID);
}

// Programme la notification tous les jours à l'heure fixée. Renvoie false si l'autorisation est refusée.
export async function scheduleDailyChallenge(): Promise<boolean> {
  if (!(await ensurePermission())) return false;
  await ensureAndroidChannel();
  await cancelDailyChallenge(); // évite d'avoir deux rappels programmés
  await scheduleNotificationAsync({
    identifier: DAILY_CHALLENGE_ID,
    content: {
      title: 'Défi du jour',
      body: 'Un nouveau Make 100 t’attend : sauras-tu faire 100 avec 6 chiffres ?',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: DAILY_HOUR,
      minute: DAILY_MINUTE,
      channelId: CHANNEL_ID,
    },
  });
  return true;
}

export async function cancelDailyChallenge(): Promise<void> {
  await cancelScheduledNotificationAsync(DAILY_CHALLENGE_ID);
}