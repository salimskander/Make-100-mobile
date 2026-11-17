# Déploiement de Make 100

L'application est compilée avec **EAS Build** (Expo Application Services) : la compilation Android se fait sur les serveurs d'Expo, sans Android Studio en local.

## 1. Prérequis

- Node.js 24.12 ou plus
- Un compte Expo membre de l'organisation `make-100`
- Être connecté à EAS : `npx eas-cli@latest login` (vérifier avec `npx eas-cli@latest whoami`)
- Dépendances installées : `npm ci`

## 2. Configuration

| Fichier | Rôle |
|---|---|
| `app.json` | Nom, identifiant Android (`com.salimskander.make100`), permissions (caméra), propriétaire EAS (`make-100`) |
| `eas.json` | Profils de build : `development`, `preview`, `production` |

La clé de signature Android (keystore) est générée et conservée par EAS au premier build. Elle n'est jamais commitée dans le dépôt.

## 3. Les trois profils de build

| Profil | Format | Usage | Commande |
|---|---|---|---|
| `development` | APK | Développement : contient le client de développement, charge le JavaScript depuis Metro | `npx eas-cli@latest build -p android --profile development` |
| `preview` | APK | Test et démonstration : application autonome, sans Metro | `npx eas-cli@latest build -p android --profile preview` |
| `production` | AAB | Publication sur le Google Play Store | `npx eas-cli@latest build -p android --profile production` |

Le numéro de version est géré par EAS (`appVersionSource: remote`) et augmente automatiquement à chaque build de production (`autoIncrement`).

## 4. Quand faut-il reconstruire ?

- **Modification JavaScript ou TypeScript** (écrans, logique) : pas de nouveau build pendant le développement, Metro recharge l'application.
- **Ajout d'un module natif** (ex. `expo-camera`, `expo-text-extractor`) ou modification des `plugins` / permissions dans `app.json` : **nouveau build obligatoire**.

Modules natifs du projet : `expo-camera`, `expo-text-extractor` (Google ML Kit), `expo-sensors`, `expo-notifications`, `@react-native-community/netinfo`, `@react-native-async-storage/async-storage`, `expo-dev-client`.

`expo-text-extractor` et `expo-dev-client` ne sont pas inclus dans Expo Go : le scan OCR ne fonctionne qu'avec un build EAS.

## 5. Installer un build

1. Ouvrir le lien affiché à la fin du build (ou le QR code) sur le téléphone Android.
2. Télécharger l'APK et autoriser l'installation d'applications de sources inconnues.
3. Pour un build `development` : lancer `npx expo start --dev-client`, puis ouvrir l'application.

## 6. Publication sur le Play Store

1. Lancer le build `production` (fichier `.aab`).
2. Envoyer le build avec `npx eas-cli@latest submit -p android`, ou le téléverser dans la Google Play Console.
3. Le publier d'abord sur la piste **Tests internes**, avant une publication publique.

> Un compte Google Play Console (payant) est nécessaire pour cette étape.

## 7. Builds réalisés

| Date | Profil | Lien |
|---|---|---|
| 16/11/2026 | `development` | https://expo.dev/accounts/make-100/projects/Make-100-mobile/builds/9ab655f1-0c93-42db-bdce-5249dcb98989 |
| À compléter | `preview` | |
| À compléter | `production` | |
