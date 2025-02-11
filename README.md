# ![VYBE](./assets/images/logos/VYBE_logo_white_transparent (2).png)

# VYBE - L'Application qui répertorie tous les évènements à proximité de toi

## 🪧 À propos
**VYBE** est une application qui te permet de découvrir facilement tous les évènements culturels et festifs autour de toi : festivals, concerts, théâtres, cinémas, comédies, soirées... Ne rate plus aucun évènement près de chez toi !

# FEATURES : 
- Géolocalisation : Localiser des évènements à proximité
- Recherche avancée (filtre)
- Notifications : évènements à venir / changement de programme
- QR CODES : Afficher son billet à l'entrée de l'event
- Espace utilisateur
- Redirection vers le site d'achat de billet
- Suggestion basées sur les données utilisateurs
- Favoris

## 📦 Prérequis
Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (v18+) - [Télécharger ici](https://nodejs.org/)
- **Expo CLI** - [Documentation](https://docs.expo.dev/)
  ```bash
  npm install -g expo-cli
  ```
- **Git** - [Télécharger ici](https://git-scm.com/downloads)

## 🚀 Installation
Clonez le projet et installez les dépendances :

```bash
git clone https://github.com/VYBE-Project/VYBE.git
cd VYBE
npm install
```

Démarrez l'application :

```bash
npx expo start
```

Ou avec npm :

```bash
npm start
```

## 🛠️ Utilisation
### Obtenir un nouveau projet
Lorsque vous êtes prêt, lancez :

```bash
npm run reset-project
```

Cette commande déplacera le code de démarrage dans le répertoire **app-example** et créera un répertoire **app** vierge dans lequel vous pourrez commencer à développer.

### Proposer une amélioration ou une correction
1. Forker le projet
2. Créez une branche pour votre modification :
   ```bash
   git checkout -b feature/amélioration
   ```
3. Faites vos modifications et committez-les :
   ```bash
   git commit -m "Ajout d'une nouvelle fonctionnalité"
   ```
4. Poussez votre branche :
   ```bash
   git push origin feature/amélioration
   ```
5. Ouvrez une **Pull Request** depuis GitHub

## 🏗️ Construit avec
### Langages & Frameworks
- **React Native** - [Documentation](https://reactnative.dev/)
- **Expo** - [Documentation](https://docs.expo.dev/)
- **Firebase** - Authentification, Firestore, Storage - [Documentation](https://firebase.google.com/docs)

### Outils
#### CI/CD
- **GitHub Actions** - Automatisation des tests et des déploiements - [Documentation](https://github.com/features/actions)

#### Déploiement
- **EAS (Expo Application Services)** - Build et déploiement simplifiés - [Documentation](https://expo.dev/eas)

## 📚 Documentation
Consultez la documentation officielle pour en savoir plus :

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [Firebase documentation](https://firebase.google.com/docs)

## 🏷️ Gestion des versions
Nous utilisons la **gestion sémantique des versions** (SemVer) pour la numérotation des versions. Consultez [la page des Releases](https://github.com/VYBE-Project/vybe-app/releases) pour voir les dernières versions.


