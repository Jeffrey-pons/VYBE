![VYBE](./assets/images/logos/VYBE_logo_white_transparent_home.png)

# VYBE - L'application qui répertorie tous les évènements à proximité de toi

VYBE est votre compagnon idéal pour ne plus jamais rater un événement culturel ou festif ! Découvrez facilement concerts, festivals, théâtres, cinémas, comédies et soirées près de chez vous.

## Demo

Essayez VYBE maintenant !

- Application mobile : Télécharger sur l'App Store | Télécharger sur Google Play
- Version web (préconisation à l'avenir) : vybe.com
- [@Prototype Figma](https://www.figma.com/proto/88qfSth9QuRSjHDFPeRLKV/Wireframes---Maquette---Prototype-Vybe?node-id=4-23&p=f&t=t6oLc7uMHQ3nf5ys-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=4%3A6)

## Screenshots

![App Screenshot](/assets/images/img/screenshot.webp)

## Features

- Authentification
- Géolocalisation 
- Filtres de recherche
- Notifications push
- Espace utilisateur 
- Favoris
- Redirection vers le site d'achat de billet
- Suggestion basées sur les données utilisateurs

## Tech Stack

- **Client:** React native, Expo, Redux,
- **Server:** Firebase, Firestore

### Statistiques d'utilisation

- #### 10,000 utilisateurs actifs mensuels
- #### +500 événements référencés par mois
- #### 4./5 note moyenne sur les stores
- #### 15 villes couvertes en France

## Prérequis
Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (v18+) - [Télécharger ici](https://nodejs.org/)
- **Git** - [Télécharger ici](https://git-scm.com/downloads)
- **Expo CLI** - [Documentation](https://docs.expo.dev/)

  ```bash
  npm install -g expo-cli
  ```

## Installation

 #### Clonez le projet et installez les dépendances :

```bash
git clone https://github.com/VYBE-Project/VYBE.git
cd VYBE
npm install
```
#### Démarrez l'application :

```
npx expo start
```

#### Ou avec npm :
```
npm start
```

## Running Tests

#### Tests unitaires
```bash
  npm test
```

#### Tests avec coverage
```bash
npm run test:coverage
```

#### Tests E2E
```bash
npm run test:e2e
```

#### Linter
```bash
npm run lint
```

#### Format du code
```bash
npm run format
```
## Deployment

#### Déploiement avec EAS
```
eas build:configure
```
####  Build de production
```
eas build --platform all
```
####  Soumission aux stores
```
eas submit --platform all
```

## Optimizations

#### Performance

- Images optimisées : Compression automatique avec expo-image et cache intelligent
- Lazy loading : Chargement différé des listes avec FlatList optimisé
- Mémoire : Gestion automatique du cache avec react-query et nettoyage des listeners

#### UX/UI

- Animations fluides : Reanimated 3 pour des transitions 60fps
- Feedback haptique : Vibrations contextuelles avec expo-haptics
- Micro-interactions : Animations de boutons et loading states
- Accessibilité : Support complet des lecteurs d'écran et navigation clavier

#### Données

- Cache intelligent : Stratégie de cache avec TTL adaptatif
- Pagination : Chargement infini optimisé
- Compression : Gzip sur toutes les requêtes API

## Contributing

Les contributions sont les bienvenues ! Voici comment contribuer :

- Fork le projet
- Créer une branche pour votre fonctionnalité
```
git checkout -b feature/AmazingFeature
```
- Commit vos changements
```
git commit -m 'feat: Add some AmazingFeature'
```
- Push vers la branche
```
git push origin feature/AmazingFeature
```
- Ouvrir une Pull Request

#### Conventions de commit

- feat: Nouvelle fonctionnalité
- fix: Correction de bug
- docs: Documentation
- style: Formatage
- refactor: Refactorisation
- test: Tests

## Documentation

Consultez la documentation officielle pour en savoir plus :

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [Firebase documentation](https://firebase.google.com/docs)

## Used By

VYBE est utilisé pour :

- Étudiants/Jeunes adultes - Pour découvrir des événements 
- Touristes - Pour explorer la culture locale
- Familles - Pour trouver des activités adaptées
- Organisateurs - Pour promouvoir leurs événements

## FAQ

#### L'application est-elle gratuite ?

- Oui, VYBE est entièrement gratuite avec toutes ses fonctionnalités de base.

#### Sur quelles plateformes est disponible VYBE ?

- VYBE est disponible sur iOS, Android et dans un futur proche en version web.

#### Comment ajouter mon événement ?

- Contactez-nous à ponsjeffrey@gmail.com avec les détails de votre événement.

#### L'app fonctionne-t-elle hors ligne ?

- Actuellement, une connexion internet est requise pour utiliser l'application Vybe.

## Support

Besoin d'aide ? Contactez-nous :

- Email : support@vybe.com
- Bug Reports : GitHub Issues
- Réseaux sociaux : @Vybe

## Lessons Learned

### Ce que nous avons appris

- React Native : Développement cross-platform efficace
- Firebase : Architecture serverless scalable
- UX Mobile : Importance du design centré utilisateur
- Géolocalisation : Défis de la précision et de la batterie

### Défis rencontrés

- Performance : Optimisation du rendu des listes longues
- Localisation : Gestion des fuseaux horaires multiples
- APIs tierces : Intégration avec OpenAgenda API

## Related

Projets similaires et inspirations :

- [Eventbrite](https://www.eventbrite.fr/)
- [Meetup](https://www.meetup.com/fr-FR/)
- [Facebook Events](https://www.facebook.com/?locale=fr_FR)

## License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Authors

- [@Jeffrey Pons](https://github.com/Jeffrey-pons) - Développeur principal
- Manon Adoue- UI/UX Designer

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

## Feedback

#### Laisser un avis

- App Store : Noter VYBE sur iOS
- Google Play : Noter VYBE sur Android
- Product Hunt : Voter pour VYBE

#### Nous contacter directement

- Suggestions générales : feedback@vybe-app.com
- Signaler un bug : GitHub Issues
- Demande de fonctionnalité : GitHub Discussions

#### Rejoindre la communauté

- Instagram : @vybe.app - Découvrez les événements en photos

#### Programme bêta
Envie de tester les nouvelles fonctionnalités en avant-première ?

- iOS TestFlight : Devenir bêta testeur iOS
- Android Beta : Devenir bêta testeur Android

Les bêta testeurs reçoivent un accès prioritaire aux nouvelles fonctionnalités et contribuent directement à l'amélioration de l'app !