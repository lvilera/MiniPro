# Sports Card Album - React Native Mobile App

A mobile version of the Sports Card Collection app built with React Native and Expo. Collect and organize your favorite sports cards with pack opening mechanics on iOS and Android!

## 🎯 Features

- **Multi-Sport Support**: Baseball (MLB), Basketball (NBA), and Hockey (NHL)
- **Pack Opening System**: Purchase packs with virtual currency
- **Promo Codes**: Redeem sponsor codes for free card packs
- **Rarity System**: Common, Rare, Epic, and Legendary cards
- **Touch-Based Gameplay**: Tap to place cards in your album
- **Persistent Storage**: Save your collection with AsyncStorage
- **Daily Rewards**: Login bonus system
- **Smooth Animations**: Card reveal animations and transitions
- **Cross-Platform**: Works on iOS, Android, and Web

## 📱 Screenshots

### Dashboard
- View all teams organized by sport
- Track collection statistics
- Filter by MLB, NBA, or NHL

### Store
- Purchase standard card packs
- Redeem promo codes
- View current coin balance

### Pack Opening
- Animated card reveals
- See rarity of each card pulled
- Add cards to your inventory

### Album View
- Browse team-specific card collections
- Tap empty slots to place matching cards
- Search and filter your cards
- View completion progress

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (installed automatically with npm commands)
- For iOS: macOS with Xcode
- For Android: Android Studio or Expo Go app
- For testing on device: Expo Go app ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

**Option 1: Development Server (Recommended)**
```bash
npm start
```
Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

**Option 2: Run Directly**
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Card.js         # Card display component
│   │   ├── TeamTile.js     # Team selection tile
│   │   └── StoreModal.js   # Store modal component
│   ├── screens/            # Screen components
│   │   ├── DashboardScreen.js    # Main dashboard
│   │   ├── AlbumScreen.js        # Team album view
│   │   └── PackOpeningScreen.js  # Pack reveal screen
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.js
│   ├── services/           # Business logic services
│   │   ├── GameService.js       # Game logic
│   │   └── StorageService.js    # AsyncStorage wrapper
│   ├── utils/              # Utility functions
│   │   └── GameContext.js       # React Context for state
│   └── constants/          # Constants and data
│       └── gameData.json        # Teams, promo codes, config
├── App.js                  # Root component
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎮 How to Play

### Dashboard
1. View your collection statistics at the top
2. Filter teams by sport (All, Baseball, Basketball, Hockey)
3. Tap on a team to view their album
4. Tap the store button to buy packs

### Store
1. View your current coin balance
2. Purchase standard packs (100 coins, 5 cards)
3. Enter promo codes for free packs
4. Available demo codes:
   - `COKE-NBA-2024` - 5 Basketball cards
   - `NIKE-MLB-PROMO` - 5 Baseball cards
   - `TIMHORTONS-NHL` - 5 Hockey cards
   - `GATORADE-LEGEND` - 3 cards with guaranteed rare+

### Album View
1. Tap an empty slot (shows card number)
2. Scroll through your available cards below
3. Tap a card with matching number to place it
4. Use search to find specific cards
5. Filter to show All/Placed/Empty slots

## 🎨 Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Animations**: React Native Animated API
- **Gestures**: React Native Gesture Handler

## 🧪 Testing

Run unit tests:
```bash
npm test
```

## 📊 Game Configuration

All game settings are in `src/constants/gameData.json`:
- Team data and colors
- Promo codes
- Player names
- Card counts per team (default: 300)
- Starting coins (default: 500)
- Pack prices and sizes
- Rarity odds

## 🐛 Known Limitations

- No backend server (client-side only)
- AsyncStorage has ~6MB limit on iOS, 10MB+ on Android
- No user authentication
- No card trading between users
- Album placement is tap-based (not drag-and-drop due to mobile limitations)

## 🔮 Future Enhancements

- [ ] Drag-and-drop card placement
- [ ] Multiplayer features
- [ ] Push notifications for daily bonus
- [ ] Sound effects and haptic feedback
- [ ] Achievement system
- [ ] Card animations and effects
- [ ] Export/import collections
- [ ] Backend integration
- [ ] Social features (trading, leaderboards)

## 📱 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

For detailed build instructions, see [Expo's build documentation](https://docs.expo.dev/build/introduction/).

## 🆚 Differences from Web Version

### Changed
- Drag-and-drop replaced with tap-based card placement
- Modal navigation optimized for mobile screens
- Touch gestures instead of mouse events
- AsyncStorage instead of localStorage
- Native animations using React Native Animated

### Added
- Pull-to-refresh on Dashboard (coming soon)
- Haptic feedback (coming soon)
- Native splash screen
- App icon support

### Removed
- Keyboard navigation (not applicable on mobile)
- Some CSS animations (replaced with native animations)

## 🔧 Troubleshooting

### Metro bundler issues
```bash
# Clear cache and restart
npx expo start -c
```

### iOS build issues
```bash
# Clean iOS build
cd ios && pod install && cd ..
```

### Android build issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
```

### AsyncStorage errors
- Ensure AsyncStorage is properly linked
- Try reinstalling dependencies

## 📝 License

MIT License - Feel free to use and modify for your own projects.

## 🙏 Credits

- Original web version: Sports Card Album
- Framework: Expo & React Native
- Navigation: React Navigation
- Icons: Unicode emoji characters

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Version**: 1.0.0 (React Native)
**Platform**: iOS, Android, Web
**Built With**: ❤️ and React Native
