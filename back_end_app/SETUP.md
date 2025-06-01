# Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Environment Variables
Create a `.env` file with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
REDIRECT_URI=http://localhost:5173/auth/42/callback
FORTYTWO_CLIENT_ID=your_42_client_id
FORTYTWO_CLIENT_SECRET=your_42_client_secret
PUSH_NOTIFICATION_KEY=your_push_notification_key
```

## Installation
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Features Overview

### Authentication
- 42 OAuth integration
- JWT-based session management
- Role-based access control

### Event Management
- Event creation and approval workflow
- RSVP system with capacity limits
- Volunteer management
- Feedback system
- Event categories and tags

### Rewards System
- Digital wallet for coins
- Points for attendance and feedback
- Store for profile customizations
- Achievement system

### Admin Features
- User management
- Event approval system
- Analytics dashboard
- Platform statistics

## API Documentation
See `API_DOCUMENTATION.md` for detailed endpoint documentation.

## Models

### User
- Authentication details
- Profile information
- Wallet and level
- Event participation
- Settings preferences

### Event
- Event details and metadata
- Attendee management
- Volunteer system
- Feedback collection
- Discussion system

### CustomizationRequest
- Profile customization requests
- Approval workflow
- Coin management

### Analytics
- Platform statistics
- User engagement metrics
- Event analytics
- Daily statistics

## Development

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
npm run migrate
```

### Code Linting
```bash
npm run lint
```

## Production Deployment
1. Set environment variables for production
2. Build the application:
```bash
npm run build
```
3. Start the server:
```bash
npm start
```

## Security Considerations
- All endpoints require authentication except login/register
- Admin routes protected with role checks
- JWT tokens expire after 7 days
- Password hashing with bcrypt
- CORS configuration required for production
