# 🚀 Hackathon Project: High-Performance Mobile App with React Native + Expo

Welcome to our hackathon mobile application — a UI/UX-focused, highly interactive experience built using **React Native with Expo**, powered by a **custom development client** to fully unlock native capabilities. This README is optimized for collaborative development in tools like **Cursor AI**, ensuring that all team members and AI pair programmers can understand, extend, and debug the app efficiently.

---

## 🧠 Goal

Deliver a mobile experience that is:
- ✅ Fast and reliable
- ✨ Visually stunning and animated
- 🧭 Intuitive and smooth to navigate
- 📱 Native-like in performance
- 🛠️ Easily extendable for future iterations

---

## ⚙️ Tech Stack Overview

### Core Framework
| Tool | Description |
|------|-------------|
| **React Native** | Cross-platform mobile development (JavaScript + native rendering) |
| **Expo** | Simplifies setup, deployment, and builds |
| **Custom Dev Client** | Unlocks native capabilities not available in Expo Go |

### UI/UX Libraries
| Tool | Purpose |
|------|---------|
| `nativewind` | Utility-first styling with Tailwind syntax |
| `react-native-reanimated v3` | Smooth, performant animations |
| `react-native-gesture-handler` | Drag, swipe, and gesture control |
| `@shopify/react-native-skia` | Custom drawing, UI effects, canvas-level control |
| `lottie-react-native` | High-quality animations for loaders and transitions |
| `expo-blur` | Native blur and glassmorphism effects |
| `lucide-react-native` / `phosphor-react-native` | Icon libraries for elegant interfaces |

### Navigation & Architecture
| Tool | Purpose |
|------|---------|
| `expo-router` | File-based routing (like Next.js) |
| `expo-linking`, `expo-constants` | For deep linking and routing config |
| `react-native-safe-area-context` | Handle notch, status bar, and padding areas |
| `react-native-screens` | Optimized screen rendering performance |
| `zustand` | Lightweight state management (optional, can use context too) |

### Build & Deployment
| Tool | Description |
|------|-------------|
| `eas-cli` | Expo Application Services CLI for builds |
| `expo-dev-client` | Builds a custom Expo Go alternative with native module support |
| `expo-updates` | Over-the-air (OTA) updates |
| `expo-build-properties` | Control `gradle`, `Podfile`, and native build settings in managed workflow |

---

## 📁 Project Structure (Optimized for Cursor AI)

```
hackathon/
├── 📱 app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx           # Root layout with providers, gesture handlers
│   ├── index.tsx             # Welcome/onboarding screen
│   └── (tabs)/               # Tab navigation group
│       ├── _layout.tsx       # Tab bar configuration
│       ├── index.tsx         # Home tab
│       ├── explore.tsx       # Explore/discover tab
│       ├── profile.tsx       # User profile tab
│       └── settings.tsx      # App settings tab
│
├── 🧩 components/            # Reusable UI components
│   ├── Button.tsx            # Animated button with haptic feedback
│   ├── Card.tsx              # Glass-morphism card components
│   ├── LoadingSpinner.tsx    # Lottie-powered loading states
│   └── ui/                   # Atomic design components
│       ├── Typography.tsx    # Text components with consistent styling
│       ├── Input.tsx         # Form input with validation states
│       └── Modal.tsx         # Animated modal/bottom sheet
│
├── 🎨 assets/                # Static assets
│   ├── images/               # PNG, JPG, WebP images
│   ├── fonts/                # Custom font files
│   └── animations/           # Lottie JSON files
│
├── 🪝 hooks/                 # Custom React hooks
│   ├── useAnimatedValue.ts   # Reanimated utilities
│   ├── useKeyboard.ts        # Keyboard state management
│   └── useHaptics.ts         # Haptic feedback wrapper
│
├── 🛠️ utils/                 # Helper functions
│   ├── animations.ts         # Reusable animation configs
│   ├── colors.ts             # Color palette and theme helpers
│   └── dimensions.ts         # Screen size and responsive utilities
│
├── 📦 types/                 # TypeScript definitions
│   ├── navigation.ts         # Navigation param types
│   └── api.ts                # API response interfaces
│
├── 🏗️ constants/             # App-wide constants
│   ├── Colors.ts             # Design system colors
│   ├── Layout.ts             # Spacing, sizing constants
│   └── Config.ts             # Environment variables
│
├── 📚 lib/                   # Third-party integrations
│   ├── analytics.ts          # Event tracking setup
│   └── storage.ts            # Async storage wrapper
│
├── 🔧 services/              # API and external services
│   ├── api.ts                # REST API client
│   └── auth.ts               # Authentication logic
│
├── ⚙️ Configuration Files
│   ├── app.json              # Expo configuration
│   ├── babel.config.js       # Babel + Reanimated + NativeWind
│   ├── metro.config.js       # Metro bundler config
│   ├── tailwind.config.js    # Tailwind CSS customization
│   ├── global.css            # Global styles for NativeWind
│   └── package.json          # Dependencies and scripts
│
└── 📖 Documentation
    ├── README.md             # This file
    ├── CONTRIBUTING.md       # Development guidelines
    └── DEPLOYMENT.md         # Build and release process
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli` (for builds)

### Installation

```bash
# Clone and install dependencies
cd hackathon
npm install

# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web browser (for quick testing)
npm run web
```

### Development Client Setup

```bash
# Build custom development client
eas build --profile development --platform ios
eas build --profile development --platform android

# Install the custom client on your device
# Then run your development server
npx expo start --dev-client
```

---

## 🎯 Key Features Implemented

### ✨ Animations & Interactions
- **Entrance animations** on all screens using `react-native-reanimated`
- **Gesture-based interactions** with `react-native-gesture-handler`
- **Haptic feedback** for user actions
- **Smooth page transitions** via Expo Router

### 🎨 Visual Design
- **Glassmorphism effects** using `expo-blur`
- **Custom gradient backgrounds** per screen
- **Consistent design system** via Tailwind CSS
- **Dark/light mode support** (system-based)

### 🧭 Navigation
- **File-based routing** with Expo Router
- **Tab navigation** with blur backgrounds
- **Deep linking** ready for external navigation
- **Type-safe navigation** with TypeScript

### 📱 Mobile-First UX
- **Safe area handling** for notch/status bar
- **Optimized for both iOS and Android**
- **60fps animations** via native driver
- **Keyboard-aware layouts**

---

## 🛠️ Development Guidelines

### Code Style & Architecture

```typescript
// ✅ Good: Use consistent prop interfaces
interface ScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'ScreenName'>;
}

// ✅ Good: Destructure shared values for Reanimated
const { width, height } = Dimensions.get('window');
const translateX = useSharedValue(0);

// ✅ Good: Use semantic naming for animations
const fadeInUp = FadeInUp.delay(200).springify();
```

### Performance Best Practices

1. **Avoid inline styles** — use `className` with NativeWind
2. **Optimize images** — use WebP format, proper sizing
3. **Lazy load screens** — implement `lazy()` for complex components
4. **Use `runOnJS` sparingly** — keep animations on native thread

### Testing

```bash
# Run linter
npm run lint

# Type checking
npm run type-check

# Test on multiple devices
npm run ios --device
npm run android --device
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```bash
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_ANALYTICS_KEY=your_analytics_key
```

### Custom Build Settings

EAS Build profiles in `eas.json`:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

---

## 📈 Performance Monitoring

- **Flipper integration** for debugging
- **React DevTools** for component inspection
- **Reanimated DevTools** for animation debugging
- **Metro bundler analysis** for bundle size optimization

---

## 🚀 Deployment

### Development Builds
```bash
eas build --profile development --platform all
```

### Production Builds
```bash
eas build --profile production --platform all
```

### Over-the-Air Updates
```bash
eas update --branch production --message "Feature update"
```

---

## 🤝 Contributing

1. **Create feature branch** from `main`
2. **Follow naming convention**: `feature/component-name` or `fix/issue-description`
3. **Test on both platforms** before submitting PR
4. **Update documentation** if adding new features

---

## 📚 Learning Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Development Build](https://docs.expo.dev/development/introduction/)

---

## 🆘 Troubleshooting

### Common Issues

**Metro bundler cache issues:**
```bash
npx expo start --clear
```

**iOS build fails:**
```bash
cd ios && pod install --repo-update
```

**Android gradle issues:**
```bash
cd android && ./gradlew clean
```

---

**Happy coding! 🎉** This project structure and tech stack should give you a solid foundation for building high-performance mobile apps with React Native and Expo. 