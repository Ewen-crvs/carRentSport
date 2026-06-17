```
   ██████╗ █████╗ ██████╗     ██████╗ ███████╗███╗   ██╗████████╗
  ██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
  ██║     ███████║██████╔╝    ██████╔╝█████╗  ██╔██╗ ██║   ██║
  ██║     ██╔══██║██╔══██╗    ██╔══██╗██╔══╝  ██║╚██╗██║   ██║
  ╚██████╗██║  ██║██║  ██║    ██║  ██║███████╗██║ ╚████║   ██║
   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
   ███████╗██████╗  ██████╗ ██████╗ ████████╗
   ██╔════╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝        ___________
   ███████╗██████╔╝██║   ██║██████╔╝   ██║          /           \___
   ╚════██║██╔═══╝ ██║   ██║██╔══██╗   ██║         |   CarRent    _|__
   ███████║██║     ╚██████╔╝██║  ██║   ██║      ___|____________/    |
   ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝     /__()_______________()_\
                                                  (O)          (O)
   ▒▒▒  Location de voitures de sport & luxe  ▒▒▒
```

# CarRentSport 🏎️

Application mobile **React Native (Expo)** de location de voitures de sport, luxe,
supercars et électriques. Parcourez le catalogue, géolocalisez les agences sur une
carte, calculez votre itinéraire et réservez en quelques taps.

---

## 🚀 Lancer le projet

### Prérequis

- **Node.js** ≥ 20 (testé sur `v20.19.5`)
- **npm**
- L'app **Expo Go** sur votre téléphone, ou un simulateur iOS / émulateur Android
- Des comptes / clés pour les services externes (voir [Configuration](#-configuration))

> ⚠️ **Note importante :** la cartographie repose sur `@rnmapbox/maps`, un module
> natif **qui ne fonctionne pas dans Expo Go**. Pour les écrans Carte et Itinéraire,
> il faut un **development build** (`expo run:ios` / `expo run:android`). Le reste de
> l'app (catalogue, réservations, favoris, auth) fonctionne dans Expo Go.

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# puis renseigner les valeurs dans .env (voir section Configuration)

# 3. (Optionnel) Peupler la base Appwrite avec des données de démo
node scripts/seed.js
```

### Démarrage

```bash
npm start          # Démarre le serveur Expo (QR code Expo Go)
npm run ios        # Development build iOS (requis pour Mapbox)
npm run android    # Development build Android (requis pour Mapbox)
npm run web        # Version web
```

---

## 🔑 Configuration

Copiez `.env.example` vers `.env` et renseignez les clés suivantes :

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | Endpoint Appwrite (ex. `https://cloud.appwrite.io/v1`) |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | ID du projet Appwrite |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | ID de la base de données |
| `EXPO_PUBLIC_APPWRITE_CARBOOK_COLLECTION_ID` | Collection des réservations |
| `EXPO_PUBLIC_APPWRITE_CARS_COLLECTION_ID` | Collection des voitures |
| `EXPO_PUBLIC_APPWRITE_AGENCIES_COLLECTION_ID` | Collection des agences |
| `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Token public Mapbox (carte + itinéraires) |
| `EXPO_PUBLIC_API_NINJAS_KEY` | Clé API Ninjas (enrichissement des specs) |

Pour le **script de seed** uniquement, ajoutez aussi une clé serveur Appwrite :

```bash
APPWRITE_API_KEY=...   # Clé API serveur avec permissions databases.read / databases.write
```

> Toutes les variables exposées au client sont préfixées `EXPO_PUBLIC_` (convention Expo).

### Modèle de données Appwrite

Trois collections sont attendues :

- **cars** — `name, brand, category, price, rating, reviews, seats, transmission, fuel, horsepower, acceleration, topSpeed, image, description, available, agencyId`
- **agencies** — `name, latitude, longitude, address`
- **carbook** (réservations) — `userId, carId, carName, carImage, pricePerDay, startDate, endDate, totalPrice, status, agencyId, agencyName, extraKm, extraKmPrice`

Le script `scripts/seed.js` crée 5 agences (Paris / Lyon) et 8 voitures de démo
(Porsche, Mercedes-AMG, Audi RS6, Bugatti Chiron, Tesla Plaid, Ferrari, Lamborghini…).

---

## 🛠️ Choix techniques

| Domaine | Technologie | Pourquoi |
|---------|-------------|----------|
| **Framework** | Expo SDK 54 + React Native 0.81 (New Architecture) | Workflow rapide, builds natifs, OTA |
| **Langage / UI** | React 19, JSX | — |
| **Styling** | NativeWind 4 + TailwindCSS 3 | Utilitaires Tailwind directement en RN, thème centralisé |
| **Navigation** | React Navigation 7 (Native Stack + Bottom Tabs) | Flux auth conditionnel + onglets imbriqués |
| **État serveur / cache** | TanStack React Query 5 | Cache, retry, invalidation, états loading/error gratuits |
| **Backend (BaaS)** | Appwrite (`react-native-appwrite`) | Auth + base de données managées |
| **Cartographie** | Mapbox (`@rnmapbox/maps`) + Directions API | Carte des agences & calcul d'itinéraire |
| **Géolocalisation** | `expo-location` | Position utilisateur (fallback Paris si refusé) |
| **Notifications** | `expo-notifications` | Confirmations locales (avec fallback Expo Go) |
| **Stockage local** | AsyncStorage | Persistance des favoris hors-ligne |
| **API externe** | API Ninjas (Cars) | Enrichissement specs réelles, dégradation gracieuse |
| **Dates / UI** | `@react-native-community/datetimepicker`, `slider`, `expo-linear-gradient`, `reanimated`, `gesture-handler` | Pickers natifs, animations |

### Architecture du code

Organisation **Atomic Design** + séparation services / hooks / écrans :

```
src/
├── components/
│   ├── atoms/        # Button, Badge, IconButton, Typography
│   ├── molecules/    # CarCard, SearchBar, CategoryFilter, FeatureItem
│   └── organisms/    # Header, CarList
├── config/           # appwrite, mapbox, queryClient
├── context/          # AuthContext (état utilisateur global)
├── hooks/            # useCars, useBookings, useFavorites, useLocation
├── navigation/       # AppNavigator (auth flow + tabs)
├── screens/          # Home, CarDetail, Booking, Bookings, Route,
│                     # Map, Favorites, Profile, Login, Register
├── services/         # auth, car, booking, location, notification,
│                     # storage, api (couche d'accès aux données)
└── theme/            # colors, spacing, fontSize, borderRadius
```

**Principes appliqués :**
- Les **services** isolent tout accès aux données (Appwrite, API, AsyncStorage) et
  normalisent les documents en objets propres (`mapCarDoc`, `formatBooking`…).
- Les **hooks** (React Query + hooks custom) encapsulent la logique métier et exposent
  des états `loading / success / error` aux écrans.
- Les **erreurs externes dégradent gracieusement** : API Ninjas indisponible →
  tableau vide ; permission GPS refusée → position Paris par défaut ; notifications
  indisponibles (Expo Go) → silencieux.
- **Thème centralisé** partagé entre `theme/colors.js` et `tailwind.config.js`
  (look épuré : fond clair, cartes sombres, accents rose doux).

---

## ✨ Fonctionnalités implémentées

### 🔐 Authentification
- Inscription (création de compte + login automatique) et connexion par email/mot de passe via Appwrite
- Persistance de session au démarrage et déconnexion
- Navigation conditionnelle : écrans d'auth si déconnecté, onglets principaux sinon
- Messages d'erreur traduits en français

### 🚗 Catalogue de voitures
- Liste de toutes les voitures depuis Appwrite
- Filtrage par catégorie : **Tous / Sport / Luxury / Supercar / Electric**
- Recherche par nom, marque ou catégorie (filtre côté client)
- Écran de détail complet : specs (puissance, 0-100, vitesse max, places, boîte, carburant), note, avis, description, disponibilité
- Enrichissement optionnel des specs via l'API Ninjas

### ❤️ Favoris
- Ajout / retrait en favori avec persistance locale (AsyncStorage)
- Écran dédié listant les voitures favorites
- Notification locale lors de l'ajout

### 📅 Réservations
- Sélection des dates de début/fin (date pickers natifs)
- Gestion du kilométrage : **200 km inclus**, puis **2 €/km supplémentaire**
- Récapitulatif de prix calculé dynamiquement (nb de jours × prix + extras)
- Aperçu carte de l'agence de retrait
- Création de la réservation dans Appwrite + notification locale de confirmation
- Liste des réservations de l'utilisateur, avec annulation possible

### 🗺️ Carte & Itinéraire
- Carte Mapbox des agences de location avec nombre de voitures par agence
- Géolocalisation de l'utilisateur (avec fallback Paris)
- Calcul et affichage de l'itinéraire routier vers l'agence (Mapbox Directions API), avec distance et durée

### 👤 Profil
- Informations de l'utilisateur connecté
- Déconnexion

### 🔔 Notifications
- Notifications locales pour la confirmation de réservation et l'ajout aux favoris
- Demande de permissions au démarrage, avec fallback propre sous Expo Go

---

## 📦 Scripts npm

| Commande | Effet |
|----------|-------|
| `npm start` | Démarre le serveur de développement Expo |
| `npm run ios` | Build et lance sur iOS (requis pour Mapbox) |
| `npm run android` | Build et lance sur Android (requis pour Mapbox) |
| `npm run web` | Lance la version web |
| `node scripts/seed.js` | Peuple la base Appwrite avec les données de démo |

---

<div align="center">

**CarRentSport** — Projet mobile · React Native · Expo

🏁

</div>
