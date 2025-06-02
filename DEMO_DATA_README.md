# Demo Data Scripts for 1337 Events

This directory contains scripts to populate and manage demo data for presentation and testing purposes.

## 🎯 What's Included

### Demo Data Population Script
- **Location**: `back_end_app/scripts/populate-demo-data.js`
- **Purpose**: Creates realistic demo data for presentation demos

### Demo Data Cleanup Script
- **Location**: `back_end_app/scripts/cleanup-demo-data.js`
- **Purpose**: Safely removes demo data while preserving real user accounts

### Interactive Management Script
- **Location**: `demo-scripts.sh`
- **Purpose**: User-friendly interface to manage demo data

## 📊 Demo Data Includes

### Users (13 total)
- **10 Students** with varying levels (6-15) and realistic profile pictures
- **2 Staff Members** with higher levels and wallets
- **1 Admin** with full permissions
- All users have profile pictures from Unsplash
- Realistic names and email addresses (@student.42.fr, @staff.42.fr)

### Events (8 total)
- **React Advanced Patterns Workshop** (upcoming)
- **Machine Learning Fundamentals** (upcoming) 
- **Friday Night Coding Challenge** (upcoming)
- **Docker & Kubernetes Workshop** (upcoming)
- **Game Development with Unity** (upcoming)
- **Career Fair Preparation** (upcoming)
- **Student Meet & Greet** (completed)
- **Web Security Best Practices** (completed)

### Realistic Event Data
- **Attendees**: 50-90% capacity for upcoming events, 60-100% for completed
- **Volunteers**: 0-3 volunteers per event with applications
- **Feedbacks**: 30-70% feedback rate for completed events (4-5 star ratings)
- **Discussions**: 0-5 discussion messages per event
- **Speakers**: Real speaker profiles with bios and pictures

### Additional Data
- **Notifications**: Event reminders and general announcements
- **User Statistics**: Realistic levels, wallets, and activity based on participation
- **Leaderboard**: Properly ranked users with varying XP and achievements

## 🚀 Quick Start

### Option 1: Interactive Script (Recommended)
```bash
# From project root directory
./demo-scripts.sh
```

This opens an interactive menu where you can:
1. Check database status
2. Populate demo data
3. Clean up demo data
4. Reset database completely

### Option 2: Direct Commands

#### Populate Demo Data
```bash
cd back_end_app
node scripts/populate-demo-data.js
```

#### Clean Up Demo Data
```bash
cd back_end_app
node scripts/cleanup-demo-data.js
```

#### Complete Database Reset
```bash
cd back_end_app
node scripts/cleanup-demo-data.js --reset
```

## ⚠️ Important Notes

### Data Safety
- **Cleanup script preserves real users** by detecting non-demo email patterns
- **Demo emails**: `*@student.42.fr`, `*@staff.42.fr` with specific usernames
- **Real user detection**: Any user NOT matching demo patterns is preserved
- **Activity reset**: Preserved users get their event activity reset to clean state

### Database Requirements
- **MongoDB must be running** before executing scripts
- **Environment variables**: Scripts use `MONGODB_URI` or default to `mongodb://localhost:27017/school_management`
- **Dependencies**: Backend `node_modules` will be installed if missing

### Demo Account Credentials
All demo users have the same password for testing: `password123`

Example demo accounts:
- **Student**: `achen@student.42.fr` / `password123`
- **Staff**: `swilson@staff.42.fr` / `password123`  
- **Admin**: `asmith@staff.42.fr` / `password123`

## 🎨 Profile Pictures

All demo users include high-quality profile pictures from Unsplash:
- Properly sized (150x150px)
- Face-cropped for consistent appearance
- Diverse representation
- Professional quality for realistic appearance

## 📱 Perfect for Presentations

The demo data is designed to look realistic and professional:

### Dashboard Features
- **Active leaderboard** with realistic rankings
- **Upcoming events** with proper scheduling
- **User statistics** that make sense mathematically
- **Notification system** with sample messages

### Event Management
- **Full event lifecycle** represented (pending → upcoming → completed)
- **Realistic attendance patterns** 
- **Proper feedback system** with comments and ratings
- **Volunteer management** with applications

### User Experience
- **Profile pictures everywhere** (dashboard, leaderboard, events)
- **Consistent branding** with 42 School email patterns
- **Realistic activity levels** based on user engagement
- **Professional speaker profiles** with bios

## 🧹 Cleanup Details

### What Gets Deleted
- ✅ ALL events (demo and real)
- ✅ ALL demo users (based on email patterns)
- ✅ ALL notifications
- ✅ ALL customization requests
- ✅ Event attendance records
- ✅ Feedback submissions

### What Gets Preserved
- ✅ Real user accounts (non-demo emails)
- ✅ User settings and preferences
- ✅ Database structure and indexes

### Reset vs Cleanup
- **Cleanup**: Removes demo data, preserves real users
- **Reset**: Complete database wipe (use with extreme caution)

## 🎬 Demo Flow Recommendation

1. **Clean Start**: Run cleanup script to ensure clean state
2. **Populate**: Run demo data population
3. **Present**: Showcase features with realistic data
4. **Clean Up**: Remove demo data after presentation
5. **Production Ready**: Database is clean for real use

## 🔧 Troubleshooting

### Common Issues

**Script Permission Denied**
```bash
chmod +x demo-scripts.sh
```

**MongoDB Connection Failed**
- Ensure MongoDB is running
- Check `MONGODB_URI` environment variable
- Verify database name matches your setup

**Missing Dependencies**
```bash
cd back_end_app
npm install
```

**Demo Data Already Exists**
- Scripts detect existing data and skip duplicates
- Run cleanup first for fresh population

### Verification

Check if demo data was created successfully:
```bash
# Option 1: Use interactive script
./demo-scripts.sh
# Choose option 1 to show database status

# Option 2: Direct MongoDB query
mongo school_management --eval "db.users.countDocuments(); db.events.countDocuments();"
```

## 📋 Script Output

Both scripts provide detailed console output:
- 🚀 Progress indicators
- ✅ Success confirmations  
- ⚠️ Warnings and important notes
- ❌ Error messages with details
- 📊 Summary statistics

Example successful output:
```
🎉 Demo data population completed successfully!
📊 Summary:
   👥 Users created: 13
   📅 Events created: 8
   🏆 Leaderboard ready with realistic data
   💰 Users have varying wallet amounts and levels
   🔔 Notifications created for engagement
```

## 🎯 Next Steps

After populating demo data:

1. **Start Backend**: `cd back_end_app && npm run dev`
2. **Start Frontend**: `cd front_end && npm start`
3. **Login with demo account** to test features
4. **Present features** with realistic data
5. **Clean up** when finished with `cleanup-demo-data.js`

The demo data makes your 1337 Events app look production-ready and professional for any presentation or demo! 