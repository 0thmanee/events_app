# 1337 Events Backend

Backend API for the 1337 Events Management System. This system handles event organization, user management, and gamification features for the 1337 school community.

## Features

### 🔐 Authentication & Access
- 42 OAuth integration
- JWT-based session management
- Role-based access control (Student/Staff/Admin)

### 📅 Event Management
- Event creation and approval workflow
- RSVP system with capacity limits
- Volunteer management system
- Event categories and tags
- Feedback collection

### 💰 Rewards & Gamification
- Digital wallet system
- Points for attendance and feedback
- Customization store
- Achievement system
- Leaderboard rankings

### 👥 User Features
- Profile management
- Settings customization
- Event participation tracking
- Volunteer applications
- Discussion participation

### 🛠️ Admin Features
- User management
- Event approval system
- Analytics dashboard
- Platform statistics
- Customization request handling

## Tech Stack

- Node.js
- Express
- MongoDB
- JWT Authentication
- 42 OAuth

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone [repository-url]
cd 1337-events-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run build` - Build for production
- `npm run migrate` - Run database migrations

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed endpoint documentation.

## Project Structure

```
src/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── services/        # Business logic
└── scripts/         # Utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow ESLint rules
- Write tests for new features
- Update documentation when changing API
- Use conventional commits

## Security

- All endpoints require authentication (except login/register)
- Admin routes protected with role checks
- JWT tokens expire after 7 days
- Password hashing with bcrypt
- Input validation on all routes

## License

This project is licensed under the ISC License.

## Setup Instructions

For detailed setup instructions, see [SETUP.md](SETUP.md).

## Credits

Built with ❤️ by WeDesign Club for the 1337 Community
