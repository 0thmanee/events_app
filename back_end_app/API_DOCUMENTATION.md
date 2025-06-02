# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## User Authentication Endpoints

### 1. Register User
```
POST /users/register
```
Request body:
```json
{
  "email": "string",
  "password": "string",
  "nickname": "string"
}
```
Response:
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "nickname": "string",
    "picture": "string|null",
    "wallet": "number",
    "level": "number"
  },
  "token": "string"
}
```

### 2. Login User
```
POST /users/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response: Same as register

### 3. 42 Authentication
```
GET /users/auth/42
```
Response:
```json
{
  "authUrl": "string" // URL to redirect user for 42 authentication
}
```

### 4. 42 Callback
```
GET /users/auth/42/callback?code=<code>
```
Response: Same as login response

## User Profile & Settings

### 1. Get Profile
```
GET /users/profile
Authorization: Required
```
Response:
```json
{
  "id": "string",
  "email": "string",
  "nickname": "string",
  "picture": "string|null",
  "wallet": "number",
  "level": "number",
  "eventsAttended": [
    {
      "title": "string",
      "time": "date"
    }
  ],
  "feedbacksGiven": [
    {
      "title": "string"
    }
  ]
}
```

### 2. Update Profile
```
PATCH /users/profile
Authorization: Required
```
Request body:
```json
{
  "nickname": "string",
  "picture": "string"
}
```
Response: Updated user object

### 3. Update Settings
```
PATCH /users/settings
Authorization: Required
```
Request body:
```json
{
  "language": "en|fr",
  "theme": "light|dark",
  "notifications": {
    "eventReminders": "boolean",
    "eventStarting": "boolean",
    "newEvents": "boolean",
    "eventChanges": "boolean"
  },
  "timezone": "string"
}
```
Response:
```json
{
  "settings": {
    "language": "string",
    "theme": "string",
    "notifications": {
      "eventReminders": "boolean",
      "eventStarting": "boolean",
      "newEvents": "boolean",
      "eventChanges": "boolean"
    },
    "timezone": "string"
  }
}
```

### 4. Get User Stats
```
GET /users/stats
Authorization: Required
```
Response:
```json
{
  "eventsAttended": "number",
  "feedbacksGiven": "number",
  "currentLevel": "number",
  "wallet": "number",
  "pointsToNextLevel": "number"
}
```

## Event Management

### 1. Create Event
```
POST /events
Authorization: Required
```
Request body:
```json
{
  "title": "string",
  "description": "string",
  "time": "date",
  "expectedTime": "number",
  "location": "string",
  "maxCapacity": "number",
  "speakers": [
    {
      "name": "string",
      "bio": "string",
      "picture": "string"
    }
  ]
}
```
Response: Created event object

### 2. Get All Events
```
GET /events
Query Parameters:
- status: "pending|approved|upcoming|ongoing|completed|cancelled"
- upcoming: "boolean"
```
Response:
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "time": "date",
    "expectedTime": "number",
    "location": "string",
    "maxCapacity": "number",
    "attendeeCount": "number",
    "status": "string",
    "speakers": [...],
    "attendees": [...]
  }
]
```

### 3. Get Event Details
```
GET /events/:id
```
Response: Detailed event object including feedbacks

### 4. Register for Event
```
POST /events/:id/attend
Authorization: Required
```
Response:
```json
{
  "message": "Successfully registered for event"
}
```

### 5. Unregister from Event
```
POST /events/:id/unattend
Authorization: Required
```
Response:
```json
{
  "message": "Successfully unregistered from event"
}
```

### 6. Submit Event Feedback
```
POST /events/:id/feedback
Authorization: Required
```
Request body:
```json
{
  "rating": "number (1-5)",
  "comment": "string"
}
```
Response: Created feedback object

## Admin Endpoints

### 1. Get All Users
```
GET /users/all
Authorization: Required (Admin only)
```
Response: Array of user objects

### 2. Make User Admin
```
PATCH /users/make-admin/:userId
Authorization: Required (Admin only)
```
Response:
```json
{
  "message": "User role updated to admin",
  "user": {...}
}
```

### 3. Approve Event
```
PATCH /events/:id/approve
Authorization: Required (Admin only)
```
Response: Updated event object

### 4. Delete Event
```
DELETE /events/:id
Authorization: Required (Admin only)
```
Response:
```json
{
  "message": "Event deleted successfully"
}
```

### 5. Get Event Statistics
```
GET /events/:id/stats
Authorization: Required (Admin only)
```
Response:
```json
{
  "totalAttendees": "number",
  "maxCapacity": "number",
  "registeredCount": "number",
  "attendedCount": "number",
  "absentCount": "number",
  "averageRating": "number",
  "feedbackCount": "number",
  "detailedAttendance": [...]
}
```

### 6. Mark Attendance
```
PATCH /events/:id/attendance
Authorization: Required (Admin only)
```
Request body:
```json
{
  "userId": "string",
  "status": "registered|attended|absent"
}
```
Response: Updated event object

## Store & Customization

### 1. Get Store Items
```
GET /api/store/items
Authorization: Required
```
Response:
```json
{
  "customizations": {
    "nickname": {
      "cost": 50,
      "description": "Change your nickname"
    },
    "picture": {
      "cost": 100,
      "description": "Change your profile picture"
    }
  }
}
```

### 2. Submit Customization Request
```
POST /api/store/request
Authorization: Required
```
Request body:
```json
{
  "type": "nickname|picture",
  "requestedChange": "string"
}
```
Response: Customization request object

### 3. Get User's Requests
```
GET /api/store/requests
Authorization: Required
```
Response: Array of user's customization requests

### 4. Admin: Get Pending Requests
```
GET /api/store/admin/requests
Authorization: Required (Admin only)
```
Response: Array of pending customization requests

### 5. Admin: Approve Request
```
POST /api/store/admin/requests/:requestId/approve
Authorization: Required (Admin only)
```
Response:
```json
{
  "message": "Request approved successfully",
  "request": {...}
}
```

### 6. Admin: Reject Request
```
POST /api/store/admin/requests/:requestId/reject
Authorization: Required (Admin only)
```
Request body:
```json
{
  "note": "string"
}
```
Response:
```json
{
  "message": "Request rejected successfully",
  "request": {...}
}
```

## Leaderboard & Achievements

### 1. Get Global Leaderboard
```
GET /api/leaderboard
Authorization: Required
```
Response:
```json
[
  {
    "rank": "number",
    "nickname": "string",
    "picture": "string",
    "level": "number",
    "wallet": "number",
    "stats": {
      "eventsAttended": "number",
      "feedbacksGiven": "number"
    }
  }
]
```

### 2. Get User's Ranking
```
GET /api/leaderboard/me
Authorization: Required
```
Response:
```json
{
  "userRank": "number",
  "totalUsers": "number",
  "nearbyUsers": [
    {
      "rank": "number",
      "nickname": "string",
      "picture": "string",
      "level": "number",
      "wallet": "number",
      "isCurrentUser": "boolean"
    }
  ]
}
```

### 3. Get User's Achievements
```
GET /api/leaderboard/achievements
Authorization: Required
```
Response:
```json
{
  "achievements": {
    "earned": [
      {
        "name": "string",
        "description": "string",
        "type": "attendance|feedback|level",
        "requirement": "number",
        "progress": 100
      }
    ],
    "inProgress": [
      {
        "name": "string",
        "description": "string",
        "type": "attendance|feedback|level",
        "requirement": "number",
        "progress": "number"
      }
    ]
  },
  "stats": {
    "eventsAttended": "number",
    "feedbacksGiven": "number",
    "level": "number",
    "wallet": "number"
  }
}
```

## Analytics & Admin Dashboard

### 1. Get Platform Overview
```
GET /api/analytics/overview
Authorization: Required (Admin only)
```
Response:
```json
{
  "totalUsers": "number",
  "activeEvents": "number",
  "totalAttendance": "number",
  "averageEventRating": "number",
  "lastUpdated": "date"
}
```

### 2. Get Daily Statistics
```
GET /api/analytics/daily
Authorization: Required (Admin only)
Query Parameters:
- startDate: "YYYY-MM-DD"
- endDate: "YYYY-MM-DD"
```
Response: Array of daily statistics

### 3. Get Event Analytics
```
GET /api/analytics/events
Authorization: Required (Admin only)
Query Parameters:
- category: "workshop|talk|vibe_coding|social|other"
- startDate: "YYYY-MM-DD"
- endDate: "YYYY-MM-DD"
```
Response: Array of event analytics data

### 4. Get User Engagement Metrics
```
GET /api/analytics/engagement
Authorization: Required (Admin only)
```
Response:
```json
{
  "totalUsers": "number",
  "activeUsers": "number",
  "averageEventsPerUser": "number",
  "totalCoinsEarned": "number",
  "totalCoinsSpent": "number",
  "userEngagement": [...]
}
```

### 5. Get Category Statistics
```
GET /api/analytics/categories
Authorization: Required (Admin only)
```
Response:
```json
[
  {
    "_id": "string (category)",
    "count": "number",
    "totalAttendees": "number",
    "averageRating": "number"
  }
]
```

### 6. Get Volunteer Statistics
```
GET /api/analytics/volunteers
Authorization: Required (Admin only)
```
Response:
```json
[
  {
    "_id": "string (status)",
    "count": "number",
    "byRole": [
      {
        "role": "string",
        "eventId": "string",
        "eventTitle": "string"
      }
    ]
  }
]
```

### 7. Get Customization Request Statistics
```
GET /api/analytics/customizations
Authorization: Required (Admin only)
```
Response:
```json
[
  {
    "_id": "string (status)",
    "count": "number",
    "totalCoins": "number",
    "byType": [
      {
        "type": "string",
        "cost": "number",
        "userId": "string"
      }
    ]
  }
]
```

### 8. Update Analytics Data
```
POST /api/analytics/update
Authorization: Required (Admin only)
```
Response:
```json
{
  "message": "Analytics updated successfully"
}
```

## Error Responses

All endpoints may return error responses in the following format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden (e.g., not admin)
- 404: Not Found
- 500: Server Error
