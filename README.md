# Make 100

Application mobile développée avec **React Native, Expo et TypeScript**.

Ce README regroupe les commandes et les règles que nous utilisons pour travailler ensemble sur le projet.

## 1. Installer le projet

À faire une seule fois sur chaque ordinateur :

```bash
git clone https://github.com/salimskander/Make-100-mobile.git
cd Make-100-mobile
npm ci
```

- `git clone` : récupère le projet GitHub sur l'ordinateur.
- `cd Make-100-mobile` : entre dans le dossier du projet.
- `npm ci` : installe les dépendances avec les versions exactes du `package-lock.json`, pour éviter que nous travaillions avec des versions différentes.

**Important :** pas besoin de relancer `npm ci` chaque jour. On le relance notamment lorsque les dépendances du projet ont changé.

---

## 2. Lancer l'application

Nous travaillons avec deux environnements différents.

| | Salim | Ibra |
|---|---|---|
| Téléphone | iPhone 11 | Android |
| Application | Expo Go | Development build |
| Commande | `npx expo start --go` | `npx expo start --dev-client` |

### 2.1 Ali (Expo Go)

Dans le terminal, à la racine du projet :

```bash
npx expo start --go
```

Cette commande démarre **Metro**, le serveur de développement qui prépare le code JavaScript de l'application et l'envoie au téléphone.

L'option `--go` force l'utilisation d'Expo Go, même si le projet contient `expo-dev-client`.

Ensuite :

1. Ouvrir l'appareil photo de l'iPhone.
2. Scanner le QR code affiché dans le terminal.
3. Ouvrir le lien avec Expo Go.

Les changements JavaScript et TypeScript sont généralement pris en compte automatiquement grâce à Fast Refresh.

**Attention :** les fonctionnalités qui nécessitent des modules natifs absents d'Expo Go, comme certaines bibliothèques OCR, ne pourront pas être testées dans cet environnement.

### 2.2 Ibra (avec development build)

Le development build doit déjà être installé sur le téléphone Android.

Dans le terminal, à la racine du projet :

```bash
npx expo start --dev-client
```

Cette commande démarre Metro pour le **development build**, et non pour Expo Go.

Ensuite :

1. Ouvrir le development build de Make 100 sur Android.
2. Scanner le QR code affiché dans le terminal, ou sélectionner le serveur de développement s'il apparaît dans l'application.
3. Attendre le chargement du projet.

Le development build contient les modules natifs intégrés au moment de sa compilation. Il permet donc de tester des fonctionnalités qui ne sont pas disponibles dans Expo Go.

**Pas besoin de reconstruire l'APK après chaque modification du code.** Il faut généralement reconstruire seulement lorsqu'une modification nécessite un changement du code ou de la configuration native.

### 2.3 Créer ou mettre à jour le development build Android

Si Ibra n'a pas encore de development build compatible avec le projet, ou si de nouveaux modules natifs nécessitent une recompilation :

```bash
eas build --platform android --profile development
```

Cette commande demande à EAS de compiler une version Android de développement.

Elle suppose que le projet EAS est configuré, qu'Ibra dispose des accès nécessaires et que le profil `development` existe dans `eas.json`.

Une fois le build terminé, Ibra installe l'APK obtenu sur son téléphone, puis lance :

```bash
npx expo start --dev-client
```

**À retenir :** `eas build` crée l'application native ; `expo start` lance le serveur qui lui fournit le code JavaScript pendant le développement.

### 2.4 Si le Wi-Fi bloque la connexion

Sur certains réseaux, notamment à l'école, le téléphone peut ne pas réussir à contacter Metro.

Ali :

```bash
npx expo start --go --tunnel
```

Ibra :

```bash
npx expo start --dev-client --tunnel
```

`--tunnel` utilise un tunnel réseau pour permettre au téléphone d'accéder au serveur sans connexion directe sur le même réseau local.

Le tunnel peut nécessiter `@expo/ngrok` et être plus lent ou moins fiable qu'une connexion locale.

### 2.5 Si l'application ne se met pas à jour

Ali :

```bash
npx expo start --go --clear
```

Ibra :

```bash
npx expo start --dev-client --clear
```

`--clear` vide le cache Metro. Cette option est utile si une ancienne version du code semble rester affichée ou si Metro rencontre un problème de cache.

---

## 3. Organisation Git

Nous utilisons une organisation simple : **une branche principale `main` et des branches temporaires pour chaque tâche**.

`main` représente la version commune et validée du projet.

Nous ne développons pas directement dessus : chaque fonctionnalité ou correction passe par une branche puis une Pull Request.

### 3.1 Nommage des branches

| Préfixe | Utilisation | Exemple |
|---|---|---|
| `feat/` | Fonctionnalité | `feat/game-screen` |
| `fix/` | Correction de bug | `fix/expression-validation` |
| `refactor/` | Réorganisation du code | `refactor/game-engine` |
| `chore/` | Configuration ou maintenance | `chore/expo-config` |
| `docs/` | Documentation | `docs/readme` |

On utilise des noms courts, en anglais et séparés par des tirets.

### 3.2 Commencer une nouvelle tâche

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/game-screen
```

Explications :

- `git switch main` : revient sur notre branche principale locale.
- `git pull --ff-only origin main` : récupère la dernière version de `main` sur GitHub, sans créer de commit de fusion automatique.
- `git switch -c feat/game-screen` : crée une branche dédiée à la tâche et s'y positionne.

**On commence chaque nouvelle branche depuis un `main` à jour.**

### 3.3 Enregistrer les modifications

```bash
git status
git add .
git commit -m "feat: add game screen"
```

- `git status` : vérifie la branche actuelle et les fichiers modifiés.
- `git add .` : prépare les modifications du dossier courant pour le commit.
- `git commit -m "..."` : enregistre ces modifications dans l'historique Git local.

Avant `git add .`, on vérifie qu'aucun fichier sensible ou inutile ne risque d'être ajouté.

On privilégie des commits cohérents avec des messages explicites.

### 3.4 Envoyer sa branche sur GitHub

Au premier envoi :

```bash
git push -u origin feat/game-screen
```

- `git push` : envoie les commits vers GitHub.
- `origin` : désigne notre dépôt GitHub.
- `-u` : associe la branche locale à sa branche distante.

Après ce premier envoi, il suffit de faire :

```bash
git push
```

Cela met à jour la branche sur GitHub, sans modifier directement `main`.

### 3.5 Créer une Pull Request

Une fois la tâche terminée :

1. Ouvrir le dépôt sur GitHub.
2. Aller dans **Pull requests → New pull request**.
3. Choisir `main` comme destination et notre branche comme source.
4. Décrire brièvement les changements réalisés.
5. Demander une relecture à l'autre.
6. Fusionner après validation.

On privilégie **Squash and merge** pour conserver un historique principal simple.

### 3.6 Après la fusion

```bash
git switch main
git pull --ff-only origin main
git branch -d feat/game-screen
```

On revient sur `main`, on récupère la version fusionnée, puis on supprime la branche locale devenue inutile.

Après un squash, Git peut refuser `-d` parce qu'il ne reconnaît pas les commits comme fusionnés. Si la Pull Request est bien fusionnée et que tout le travail est sauvegardé, on peut supprimer la branche avec `git branch -D feat/game-screen`.

On supprime également la branche distante depuis GitHub.

---

## 4. Travailler en parallèle

Nous pouvons développer deux fonctionnalités différentes en même temps, chacun sur sa branche.

Exemple :

- Salim : `feat/game-engine`
- Ibra : `feat/game-screen`

Chacun travaille, commit et push sur sa propre branche.

Lorsque l'une des branches est fusionnée dans `main`, l'autre développeur peut récupérer les nouveautés.

Depuis sa branche de travail, après avoir enregistré ses modifications :

```bash
git fetch origin
git merge origin/main
```

- `git fetch origin` : récupère les dernières informations du dépôt distant sans modifier les fichiers de travail.
- `git merge origin/main` : intègre les dernières modifications de `main` dans la branche actuelle.

Si Git détecte un conflit, on le résout dans VS Code, puis on vérifie le code avant de terminer la fusion.

**On ne force jamais un push sur `main`.**

---

## 5. Conventions de commits

Format :

```text
type: description courte
```

Exemples :

```bash
git commit -m "feat: add number generation"
git commit -m "fix: prevent division by zero"
git commit -m "refactor: simplify game logic"
git commit -m "chore: update Expo configuration"
git commit -m "docs: update README"
```

Le message décrit ce qui a changé, de manière concise.

---

## 6. Règles de développement

Notre priorité est la **qualité du code sans sur-ingénierie**.

- **TypeScript :** typer correctement les données et éviter `any` sans raison.
- **Simplicité :** privilégier les solutions les plus simples qui répondent au besoin.
- **Composants :** extraire un composant lorsqu'il est réutilisé ou lorsque cela améliore réellement la lisibilité.
- **Logique métier :** garder les calculs et les règles de Make 100 indépendants de l'interface.
- **Duplication :** éviter de recopier la même logique à plusieurs endroits.
- **Dépendances :** n'installer une bibliothèque que lorsqu'elle apporte un bénéfice concret.
- **Configuration :** ne pas modifier les fichiers générés par Expo sans nécessité.
- **Sécurité :** ne jamais commiter de secrets, de clés privées ou de fichiers de signature.
- **Tests :** vérifier le fonctionnement des modifications sur les environnements concernés.

Pour vérifier les types :

```bash
npx tsc --noEmit
```

Pour analyser le code avec ESLint :

```bash
npx expo lint
```

Ces commandes sont utiles avant une Pull Request, mais elles ne remplacent pas un test de l'application sur téléphone.

---

## 7. Récapitulatif des commandes utiles

| Action | Commande |
|---|---|
| Installer les dépendances | `npm ci` |
| Lancer Expo Go (Salim) | `npx expo start --go` |
| Lancer le development build (Ibra) | `npx expo start --dev-client` |
| Expo Go avec tunnel | `npx expo start --go --tunnel` |
| Development build avec tunnel | `npx expo start --dev-client --tunnel` |
| Recréer le build Android | `eas build --platform android --profile development` |
| Vérifier les fichiers Git | `git status` |
| Récupérer `main` | `git pull --ff-only origin main` |
| Créer une branche | `git switch -c feat/nom` |
| Préparer les modifications | `git add .` |
| Créer un commit | `git commit -m "type: description"` |
| Envoyer sa branche | `git push` |

---

**Principe commun :** garder une organisation Git simple et un code lisible, sans ajouter de complexité qui n'apporte rien au projet.