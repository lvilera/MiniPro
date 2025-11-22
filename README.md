# Sports Card Album - Pack Opening Edition

A modern, accessible web application for collecting and organizing sports cards with pack opening mechanics.

## 🎯 Features

- **Multi-Sport Support**: Baseball (MLB), Basketball (NBA), and Hockey (NHL)
- **Pack Opening System**: Purchase packs with virtual currency
- **Promo Codes**: Redeem sponsor codes for free card packs
- **Rarity System**: Common, Rare, Epic, and Legendary cards
- **Drag & Drop**: Intuitive card placement with validation
- **Persistent Storage**: Save your collection locally
- **Daily Rewards**: Login bonus system
- **Accessibility**: Full ARIA support and keyboard navigation

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (for development)

### Installation

1. Clone or download this repository
2. Install dependencies (for development):
   ```bash
   npm install
   ```

### Running the Application

**Option 1: Direct Browser Access**
Simply open `index.html` in your web browser.

**Option 2: Local Server (Recommended)**
```bash
npm start
```
Then visit `http://localhost:8080`

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## 🛠️ Development

### Project Structure

```
MiniPro/
├── index.html              # Main HTML structure
├── styles.css              # All CSS styles and themes
├── app.js                  # Application logic
├── data.json               # Game data (teams, promo codes, config)
├── app.test.js             # Unit tests
├── package.json            # Dependencies and scripts
├── .eslintrc.json          # ESLint configuration
└── README.md               # This file
```

### Key Improvements (v2.0)

#### 1. **Separation of Concerns**
- Split monolithic HTML into separate files
- Externalized data to JSON
- Modular CSS with clear organization
- Structured JavaScript with utility functions

#### 2. **Critical Bug Fixes**
- ✅ **Team Validation**: Cards can only be placed in slots matching both number AND team
- ✅ **Visual Indicators**: Slots highlight when dragging matching cards
- ✅ **Memory Leak Fix**: Removed global function pollution
- ✅ **Duplicate Names**: Expanded player name pool (50×50 = 2,500 combinations)

#### 3. **Performance Optimizations**
- ✅ **Debounced Search**: 300ms debounce on search input
- ✅ **Efficient Filtering**: Optimized grid filtering
- ✅ **DOM Caching**: Elements cached for reuse
- ✅ **Event Delegation**: Reduced event listener overhead

#### 4. **Error Handling**
- ✅ Try-catch blocks throughout
- ✅ Safe localStorage operations
- ✅ Safe JSON parsing
- ✅ Graceful degradation on failures

#### 5. **Accessibility (WCAG 2.1 AA)**
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader support
- ✅ Semantic HTML
- ✅ Proper heading hierarchy

#### 6. **Testing & Quality**
- ✅ Unit tests with Jest
- ✅ ESLint configuration
- ✅ Code coverage tracking
- ✅ Build scripts

## 🎮 How to Play

### Dashboard
1. View your collection statistics
2. Filter by sport (All, Baseball, Basketball, Hockey)
3. Click on a team to view their album

### Store
1. Click the "STORE" button
2. Purchase standard packs (100 coins, 5 cards)
3. Enter promo codes for free packs

### Album View
1. Drag cards from "Your Cards" section
2. Drop them into matching slots (number + team must match)
3. Use search/filter to find specific cards
4. Return cards to inventory by dragging back

### Keyboard Navigation
- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons and cards
- **Arrow Keys**: Navigate grid (keyboard mode)
- **Escape**: Cancel selection

## 🎟️ Demo Promo Codes

- `COKE-NBA-2024`: 5 Basketball cards
- `NIKE-MLB-PROMO`: 5 Baseball cards
- `TIMHORTONS-NHL`: 5 Hockey cards
- `GATORADE-LEGEND`: 3 cards with guaranteed rare+
- `SUBWAY-SPORTS`: 4 cards from any sport

Each code can only be redeemed once.

## 🎨 Color Schemes

The app supports multiple theme schemes:
- **Default**: Red/Pink theme
- **Cosmos**: Blue space theme
- **Aqua**: Green/Teal theme
- **Dark**: Purple/Cyan theme
- **Solar**: Orange/Pink theme
- **Thunder**: Yellow/Gray theme

Schemes automatically apply based on selected team.

## 📊 Rarity System

| Rarity    | Drop Rate | Color  |
|-----------|-----------|--------|
| Common    | 70%       | Gray   |
| Rare      | 20%       | Blue   |
| Epic      | 8%        | Purple |
| Legendary | 2%        | Gold   |

## 🔧 Configuration

Edit `data.json` to customize:
- Team data
- Promo codes
- Player names
- Card counts per team
- Starting coins
- Pack prices
- Rarity odds

## 🐛 Known Limitations

- No server-side validation (client-side only)
- LocalStorage has ~5-10MB limit
- No user authentication
- No mobile touch optimization (planned)
- No card trading between users

## 🔮 Future Enhancements

- [ ] Mobile responsive design
- [ ] Touch-friendly drag & drop
- [ ] Card trading system
- [ ] Achievements/badges
- [ ] Sound effects
- [ ] Animations enhancements
- [ ] Export/import collections
- [ ] Multiplayer features
- [ ] Backend integration

## 📱 Native Apps

Want to convert this to a native mobile or desktop app? We've got you covered!

### Available Options:

1. **PWA (Progressive Web App)** - ⭐ Easiest
   - Works on all platforms
   - Installable from browser
   - Already configured!
   - See: `NATIVE_APP_GUIDE.md`

2. **Capacitor (Mobile Apps)** - iOS & Android
   - Native mobile apps
   - App Store & Play Store ready
   - `npm run capacitor:add:android`
   - See: `NATIVE_APP_GUIDE.md`

3. **Electron (Desktop Apps)** - Windows, Mac, Linux
   - Professional desktop apps
   - `npm run electron`
   - See: `NATIVE_APP_GUIDE.md`

**📖 Complete Guide:** See [NATIVE_APP_GUIDE.md](NATIVE_APP_GUIDE.md) for detailed instructions!

## 📝 License

MIT License - Feel free to use and modify for your own projects.

## 🙏 Credits

- Fonts: Google Fonts (Orbitron, Share Tech Mono)
- Icons: Unicode emoji characters
- Testing: Jest framework

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Version**: 2.0.0
**Last Updated**: 2025-01-22
