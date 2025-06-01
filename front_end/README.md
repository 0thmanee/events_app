# 🚀 AppRush 1337 Hackathon - Event Management App

**WeDesign Club** | 48-Hour Mobile App Development Challenge

---

## 📋 Project Overview

### What Is AppRush 1337?
A 48-hour hackathon where **1337 students** come together to design and build a mobile app focused on **event management** for our school. This is a competitive environment where teams create solutions that 1337 students and staff could actually use, powered by creativity, teamwork, and caffeine.

### Mission Statement
- **Empower Student Innovation**: Give 1337 students the opportunity to learn, build, and collaborate
- **Solve a Real Problem**: Design an event management app that can actually be used at 1337 to improve how we organize and attend school events

---

## 🎯 Project Specifications

### Target Users
- **👨‍🎓 1337 Students**: Discover and attend events (workshops, talks, coding nights, etc.)
- **👩‍🏫 Organizers (Staff/Clubs)**: Create and manage events
- **🔧 Admins**: Manage platform, approve events, view analytics

### Core Features (Essential)

#### 🔐 Authentication & Access
- **42 Authentication**: Users must log in using 42 Intra
- Secure session management
- Role-based access (Student/Staff/Admin)

#### 🏠 User Interface
- **Creative Homepage**: Showcase events and engage users
- **Event Discovery**: Display upcoming events with full details
- **Event Details Page**: Description, location, date, speakers, max capacity
- **Settings Page**: Customize app settings (language, theme, notifications)

#### 📅 Event Management
- **RSVP System**: Register/unregister for events with capacity limits
- **Event Calendar**: Visual calendar integration
- **Event Categories**: Workshops, talks, coding nights, social events
- **Volunteer System**: Apply for volunteer opportunities within events

#### 💰 Wallet & Rewards System
- **Digital Wallet**: Earn coins through event participation and feedback
- **Attendance Rewards**: Automatic coin rewards for attending events
- **Feedback Incentives**: Bonus coins for submitting post-event feedback
- **Coin Balance**: Track and manage personal wallet balance

#### 🛍️ Store & Customization
- **Profile Store**: Purchase custom nicknames and profile pictures
- **Customization Requests**: Submit requests for profile modifications
- **Approval Workflow**: Staff review and approve/reject customization requests
- **Reserved Payments**: Coins held until staff approval, refunded if rejected

#### 🏆 Leaderboard & Ranking
- **Student Levels**: Progress through levels based on event participation
- **Public Rankings**: Campus-wide leaderboard showing top students
- **Achievement System**: Level progression through attendance and feedback
- **Gamified Experience**: Competitive element to encourage participation

#### 🔔 Notifications & Communication
- **Push Notifications**: Event reminders and important announcements
- **Real-time Updates**: Event changes, cancellations
- **Feedback System**: Post-event ratings and comments

#### 🛠️ Admin Dashboard
- **Event Management**: Approve, remove, or manage events
- **User Management**: View registrations, attendance, and student profiles
- **Customization Requests**: Review and approve/reject profile changes
- **Wallet Management**: Monitor coin transactions and balances
- **Leaderboard Oversight**: Access student rankings and engagement metrics
- **Analytics**: Participation stats, feedback insights, and platform usage

### Optional Features (Bonus Points)

#### 💬 Social Features
- **Event Discussion**: Chat/forum for each event
- **Networking**: Connect with other attendees
- **Social Media Integration**: Share events

#### 🤖 Smart Features
- **Personalized Recommendations**: Based on interests and past attendance
- **AI Event Suggestions**: Smart matching with user preferences
- **Predictive Analytics**: Attendance forecasting

#### 📊 Advanced Management
- **Organizer Dashboard**: Detailed participation stats, feedback analytics
- **Calendar Sync**: Google/Apple Calendar integration
- **Check-in System**: QR code or manual validation for attendance
- **Waitlist Management**: Automatic notifications when spots open

#### 🔧 Technical Enhancements
- **Offline Mode**: Cache events for offline viewing
- **Multi-language Support**: French, English, Arabic
- **Dark/Light Mode**: System-based theme switching
- **Advanced Search**: Filter by category, date, location, capacity

---

## 🏆 Judging Criteria (40 Points Total)

| Category | Points | Focus |
|----------|---------|-------|
| **Technical Quality** | 10 pts | Clean code, solid architecture, performance |
| **UI/UX Design** | 10 pts | Intuitive and visually appealing interface |
| **Innovation** | 10 pts | Creative features and unique solutions |
| **1337 Relevance** | 10 pts | Meets the school's specific needs |

---

## 📱 Technical Stack

### Core Framework
- **React Native** with **Expo** (Custom Dev Client)
- **Expo Router** for file-based navigation
- **TypeScript** for type safety

### UI/UX Libraries
- **NativeWind** (Tailwind CSS for React Native)
- **React Native Reanimated v3** for smooth animations
- **Expo Blur** for glassmorphism effects
- **Lucide React Native** for icons
- **Linear Gradient** for advanced styling

### State & Data Management
- **React Query/TanStack Query** for server state
- **Zustand** for client state management
- **AsyncStorage** for local persistence

### Authentication & Backend
- **42 API Integration** for authentication
- **Expo SecureStore** for token management
- **Custom API Backend** (Node.js/Express or Firebase)

---

## 🗂️ Project Structure

```
hackathon/
├── 📱 app/                    # Expo Router file-based routing
│   ├── _layout.tsx           # Root layout with providers
│   ├── index.tsx             # Loading/Welcome screen
│   ├── (auth)/               # Authentication flow
│   ├── (tabs)/               # Main app tabs
│   │   ├── _layout.tsx       # Tab navigation
│   │   ├── index.tsx         # Home/Dashboard
│   │   ├── events.tsx        # Event discovery
│   │   ├── calendar.tsx      # Calendar view
│   │   ├── profile.tsx       # User profile
│   │   ├── wallet.tsx        # Digital wallet & coins
│   │   ├── store.tsx         # Customization store
│   │   ├── leaderboard.tsx   # Student rankings
│   │   └── settings.tsx      # App settings
│   └── (modal)/              # Modal routes
│       ├── event-details.tsx # Event detail modal
│       ├── admin-panel.tsx   # Admin dashboard
│       └── volunteer.tsx     # Volunteer application modal
│
├── 🧩 components/            # Reusable UI components
│   ├── Event/               # Event-related components
│   ├── Auth/                # Authentication components
│   ├── Dashboard/           # Dashboard components
│   ├── Wallet/              # Wallet & coin components
│   ├── Store/               # Store & customization components
│   ├── Leaderboard/         # Ranking & achievement components
│   ├── Volunteer/           # Volunteer system components
│   └── ui/                  # Base UI components
│
├── 🎨 assets/               # Static assets and documentation
│   ├── docs/                # Project documentation (PDFs)
│   ├── images/              # App images and icons
│   └── animations/          # Lottie animations
│
├── 🛠️ services/             # API and external services
│   ├── auth42.ts            # 42 API integration
│   ├── events.ts            # Event management API
│   ├── wallet.ts            # Wallet & coin management API
│   ├── store.ts             # Store & customization API
│   ├── leaderboard.ts       # Ranking & achievement API
│   ├── volunteers.ts        # Volunteer system API
│   └── notifications.ts     # Push notification service
│
├── 🪝 hooks/                # Custom React hooks
├── 🧮 utils/                # Helper functions
├── 📦 types/                # TypeScript definitions
└── 🏗️ constants/            # App constants and config
```

---

## 🚀 Development Phases

### Phase 1: Foundation (Day 1 Morning)
- [x] Project setup and authentication
- [x] 42 API integration
- [x] Basic navigation structure
- [x] Design system implementation

### Phase 2: Core Features (Day 1 Afternoon)
- [ ] Event discovery and listing
- [ ] Event details and RSVP system
- [ ] User dashboard
- [ ] Basic admin panel
- [ ] Digital wallet system
- [ ] Basic store functionality

### Phase 3: Advanced Features (Day 2 Morning)
- [ ] Push notifications
- [ ] Calendar integration
- [ ] Feedback system
- [ ] Advanced admin features
- [ ] Leaderboard and ranking system
- [ ] Volunteer opportunities
- [ ] Customization request workflow

### Phase 4: Polish & Optimization (Day 2 Afternoon)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Testing and bug fixes
- [ ] Gamification enhancements
- [ ] Demo preparation

---

## 📋 User Stories

### Student User Stories
- As a **1337 student**, I want to **discover upcoming events** so I can **participate in school activities**
- As a **student**, I want to **register for events** so I can **secure my spot**
- As a **student**, I want to **receive notifications** so I **don't miss important events**
- As a **student**, I want to **view my registered events** so I can **plan my schedule**
- As a **student**, I want to **provide feedback** so I can **help improve future events**
- As a **student**, I want to **earn coins for attending events** so I can **purchase customizations**
- As a **student**, I want to **buy custom nicknames and profile pictures** so I can **personalize my profile**
- As a **student**, I want to **see my ranking on the leaderboard** so I can **compete with peers**
- As a **student**, I want to **volunteer at events** so I can **gain extra experience and recognition**

### Staff/Organizer User Stories
- As an **event organizer**, I want to **create and manage events** so I can **organize school activities**
- As an **organizer**, I want to **view registration stats** so I can **plan accordingly**
- As an **organizer**, I want to **send updates** so I can **keep attendees informed**
- As an **organizer**, I want to **manage volunteer applications** so I can **coordinate event support**
- As an **organizer**, I want to **review customization requests** so I can **maintain platform standards**

### Admin User Stories
- As an **admin**, I want to **approve events** so I can **maintain quality control**
- As an **admin**, I want to **view analytics** so I can **understand platform usage**
- As an **admin**, I want to **manage users** so I can **ensure proper access control**
- As an **admin**, I want to **oversee the wallet system** so I can **monitor coin transactions**
- As an **admin**, I want to **manage customization requests** so I can **ensure appropriate content**
- As an **admin**, I want to **access leaderboard data** so I can **track student engagement**

---

## 🏁 Deliverables

1. **📂 Source Code**: Clean, well-documented code hosted on GitHub
2. **🎥 Demo Video**: 10-15 minute functional demonstration
3. **📱 APK Build**: Working Android APK for user testing
4. **📊 Presentation**: Project overview and technical details

---

## 🎨 Design Philosophy

### Visual Identity
- **Modern & Clean**: Minimalist interface with focus on content
- **1337 Branding**: Incorporate school colors and identity
- **Professional**: Enterprise-grade design suitable for academic environment
- **Accessible**: Clear typography, proper contrast, intuitive navigation

### User Experience
- **Intuitive Navigation**: Logical flow and easy discovery
- **Quick Actions**: Streamlined RSVP and event management
- **Real-time Updates**: Live notifications and status changes
- **Responsive Design**: Optimized for various device sizes

---

## 🎭 Theme & Design System

### Minimalist Luxe Light Theme

Our app features a sophisticated **Minimalist Luxe Light Theme** that combines modern aesthetics with professional elegance. This carefully crafted design system ensures consistency across all components while providing an exceptional user experience.

#### 🎨 Color Palette

| Color | Hex Code | Usage | Description |
|-------|----------|-------|-------------|
| **Primary Background** | `#F5F5F5` | Main backgrounds, screens | Soft Off-White - Creates a clean, airy feel |
| **Secondary Background** | `#EAEAEA` | Cards, sections, inputs | Light Gray - Subtle contrast for layering |
| **Primary Text** | `#333333` | Headings, important text | Dark Gray - Excellent readability |
| **Secondary Text** | `#555555` | Body text, descriptions | Medium Gray - Comfortable reading |
| **Accent Color** | `#3EB489` | CTAs, highlights, active states | Mint Green - Vibrant yet professional |
| **Highlight Color** | `#E1C3AD` | Special elements, badges | Soft Beige - Warm luxury touch |
| **Error Color** | `#D9534F` | Errors, warnings, critical actions | Muted Red - Clear but not alarming |
| **Pure White** | `#FFFFFF` | Cards, modals, overlays | Clean contrast surfaces |

#### 🎯 Color Usage Examples

```javascript
// Primary color palette implementation
const colors = {
  primaryBg: '#F5F5F5',      // Screen backgrounds
  secondaryBg: '#EAEAEA',    // Card backgrounds
  primaryText: '#333333',    // Headings, titles
  secondaryText: '#555555',  // Body text, descriptions
  accent: '#3EB489',         // Buttons, links, active states
  highlight: '#E1C3AD',      // Badges, special elements
  error: '#D9534F',          // Error states, alerts
  white: '#FFFFFF',          // Modal backgrounds, cards
  lightAccent: '#3EB48920',  // Accent with 20% opacity
  lightHighlight: '#E1C3AD30', // Highlight with 30% opacity
  cardBorder: '#E0E0E0',     // Subtle borders
  shadow: '#00000015'        // Subtle shadow overlay
};
```

#### 🔧 Design Principles

##### **1. Hierarchy & Typography**
- **Font Weight Progression**: 400 (normal) → 500 (medium) → 600 (semibold) → 700 (bold) → 900 (black)
- **Letter Spacing**: Strategic spacing for readability and elegance
- **Monospace Elements**: Technical elements use monospace fonts for authenticity

##### **2. Spacing & Layout**
- **8pt Grid System**: All spacing follows 8-point increments
- **Consistent Margins**: 16px, 24px, 32px, 40px standard spacing
- **Card Padding**: 20px internal padding for optimal content breathing

##### **3. Shadows & Elevation**
- **Subtle Depth**: Soft shadows with low opacity (0.08-0.15)
- **Consistent Elevation**: 4px, 8px, 16px shadow offsets
- **Accent Shadows**: Key elements use accent color shadows

##### **4. Interactive Elements**
- **Spring Animations**: Natural feeling interactions with React Native Reanimated
- **Hover States**: Subtle scale (0.96-1.04) and opacity changes
- **Touch Feedback**: Immediate visual response to user interactions

#### 🌟 Component Styling

##### **Buttons & CTAs**
```javascript
// Primary Action Button
{
  backgroundColor: colors.white,
  borderWidth: 2,
  borderColor: colors.accent,
  borderRadius: 16,
  shadowColor: colors.accent,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  elevation: 8,
}
```

##### **Cards & Containers**
```javascript
// Card Component Styling
{
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.cardBorder,
  borderRadius: 20,
  shadowColor: colors.primaryText,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 6,
}
```

##### **Loading States**
- **Skeleton Screens**: Use secondary background color for placeholders
- **Progress Indicators**: Accent color with subtle glow effects
- **Shimmer Effects**: Subtle light overlays for loading animations

#### 🎪 Animation Philosophy

##### **Entrance Animations**
- **Staggered Reveals**: Elements appear with 100-200ms delays
- **Scale & Fade**: Combination of scale (0.95→1.0) and opacity (0→1)
- **Smooth Easing**: `Easing.out(Easing.quad)` for natural feel

##### **Interaction Feedback**
- **Spring Physics**: `withSpring()` for button presses and gestures
- **Micro-interactions**: Subtle icon rotations and color transitions
- **Loading States**: Elegant skeleton screens with shimmer effects

#### 🔍 Accessibility Features

##### **Contrast Ratios**
- **Primary Text**: 12.6:1 contrast ratio (WCAG AAA compliant)
- **Secondary Text**: 7.4:1 contrast ratio (WCAG AA compliant)
- **Interactive Elements**: Minimum 3:1 contrast for focus states

##### **Touch Targets**
- **Minimum Size**: 44px minimum touch target size
- **Spacing**: 8px minimum between interactive elements
- **Visual Feedback**: Clear pressed and focused states

#### 🎨 Theme Implementation

The theme is consistently applied across all components using:

1. **Centralized Color Constants**: Single source of truth for all colors
2. **Reusable Style Objects**: Consistent shadow, border, and spacing patterns
3. **Component-Level Theming**: Each component imports and uses the theme consistently
4. **Animated Transitions**: Smooth theme changes using React Native Reanimated

This design system ensures a cohesive, professional, and accessible user experience that reflects the high standards of the 1337 community while maintaining modern aesthetic appeal.

---

## 🔧 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser

# Build for production
npm run build
```

---

## 🏆 Success Metrics

- **Technical Excellence**: Clean architecture, optimal performance
- **User Experience**: Intuitive interface, smooth interactions
- **Innovation**: Unique features that set us apart
- **1337 Integration**: Seamless fit with school ecosystem
- **Scalability**: Ready for real-world deployment at 1337

---

**Built with ❤️ by WeDesign Club for the 1337 Community** 