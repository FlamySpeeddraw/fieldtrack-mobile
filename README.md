# FieldTrack Mobile

Instructions rapides pour cloner, installer et lancer le projet mobile.

**Prérequis**:
- Node.js installé (version compatible avec le projet).
- Expo CLI (fourni par `npx`, pas besoin d'installation globale).

**Installation (local)**:

- **Clone**: Clone le dépôt

```
git clone https://github.com/FlamySpeeddraw/fieldtrack-mobile.git
```

- **Se placer dans le dossier**: remplace `fieldtrack-mobile` si ton dossier a un autre nom

```
cd fieldtrack-mobile
```

- **Installer les dépendances**:

```
npm i
```

**Lancer le projet en local (sur mobile)**:

- Pour tester sur un téléphone avec Expo Go (Android / iOS) :

```
npx expo start
```

- Ouvre l'application Expo Go sur ton téléphone et scanne le QR code fourni par Expo.

**Important — configuration de l'URL de l'API**:

- Si ton API tourne en local (sur la même machine que l'émulateur/phone), il faut mettre l'adresse IPv4 de ton PC dans le fichier `constants/general.constants.ts` à la place de `localhost`.
- Pour trouver l'IPv4 sur Windows, ouvre un terminal (cmd ou PowerShell) et exécute :

```
ipconfig
```

- Cherche la valeur `Adresse IPv4` (par ex. `192.168.1.42`) pour l'interface réseau que tu utilises (Wi‑Fi ou Ethernet).
- Remplace l'URL/host dans `constants/general.constants.ts` par `http://<ADRESSE_IPV4>:<PORT>` (ex. `http://192.168.1.42:3000`).


**Commandes utiles récapitulées**:

```
git clone https://github.com/FlamySpeeddraw/fieldtrack-mobile.git
cd fieldtrack-mobile
npm i
npx expo start
```


