const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Event = require('../src/models/Event');
const Notification = require('../src/models/Notification');

// Demo data arrays
const DEMO_USERS = [
  {
    nickname: 'Alice Chen',
    intraUsername: 'achen',
    email: 'achen@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 8,
    wallet: 450
  },
  {
    nickname: 'Marcus Johnson',
    intraUsername: 'mjohnson',
    email: 'mjohnson@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 12,
    wallet: 680
  },
  {
    nickname: 'Sofia Rodriguez',
    intraUsername: 'srodriguez',
    email: 'srodriguez@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 15,
    wallet: 890
  },
  {
    nickname: 'Ahmed Benali',
    intraUsername: 'abenali',
    email: 'abenali@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 6,
    wallet: 320
  },
  {
    nickname: 'Emma Thompson',
    intraUsername: 'ethompson',
    email: 'ethompson@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 10,
    wallet: 550
  },
  {
    nickname: 'David Kim',
    intraUsername: 'dkim',
    email: 'dkim@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 7,
    wallet: 380
  },
  {
    nickname: 'Luna Martinez',
    intraUsername: 'lmartinez',
    email: 'lmartinez@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 13,
    wallet: 720
  },
  {
    nickname: 'Ryan O\'Connor',
    intraUsername: 'roconnor',
    email: 'roconnor@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 9,
    wallet: 480
  },
  {
    nickname: 'Zara Hassan',
    intraUsername: 'zhassan',
    email: 'zhassan@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 11,
    wallet: 620
  },
  {
    nickname: 'Carlos Silva',
    intraUsername: 'csilva',
    email: 'csilva@student.42.fr',
    picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    level: 14,
    wallet: 810
  },
  {
    nickname: 'Dr. Sarah Wilson',
    intraUsername: 'swilson',
    email: 'swilson@staff.42.fr',
    picture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    role: 'staff',
    level: 20,
    wallet: 1200
  },
  {
    nickname: 'Prof. Michael Brown',
    intraUsername: 'mbrown',
    email: 'mbrown@staff.42.fr',
    picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    role: 'staff',
    level: 25,
    wallet: 1500
  },
  {
    nickname: 'Tech Lead Alex',
    intraUsername: 'asmith',
    email: 'asmith@staff.42.fr',
    picture: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    level: 30,
    wallet: 2000
  }
];

const DEMO_EVENTS = [
  {
    title: 'React Advanced Patterns Workshop',
    category: 'workshop',
    description: 'Deep dive into advanced React patterns including compound components, render props, and hooks design patterns. Learn how to build reusable and maintainable React applications.',
    location: 'Lab A - Room 101',
    maxCapacity: 25,
    expectedTime: 4,
    rewardPoints: 25,
    status: 'upcoming',
    speakers: [{
      name: 'Sarah Wilson',
      bio: 'Senior Frontend Developer with 8+ years experience in React and modern web technologies',
      picture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
    }],
    tags: ['react', 'javascript', 'frontend', 'patterns']
  },
  {
    title: 'Machine Learning Fundamentals',
    category: 'talk',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications. Perfect for beginners wanting to understand AI and ML basics.',
    location: 'Auditorium - Main Hall',
    maxCapacity: 80,
    expectedTime: 2,
    rewardPoints: 15,
    status: 'upcoming',
    speakers: [{
      name: 'Michael Brown',
      bio: 'AI Researcher and Professor specializing in machine learning and data science',
      picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    }],
    tags: ['machine-learning', 'ai', 'data-science', 'beginner']
  },
  {
    title: 'Friday Night Coding Challenge',
    category: 'coding_night',
    description: 'Weekly competitive programming session. Solve algorithmic challenges, improve your problem-solving skills, and compete with fellow students.',
    location: 'Computer Lab - Building B',
    maxCapacity: 40,
    expectedTime: 6,
    rewardPoints: 30,
    status: 'upcoming',
    speakers: [{
      name: 'Tech Lead Alex',
      bio: 'Competitive programming expert and software engineer with 10+ years experience',
      picture: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
    }],
    tags: ['algorithms', 'competitive-programming', 'problem-solving']
  },
  {
    title: 'Student Meet & Greet',
    category: 'social',
    description: 'Casual networking event for students to meet, share experiences, and build connections. Light refreshments will be provided.',
    location: 'Student Lounge - Ground Floor',
    maxCapacity: 60,
    expectedTime: 3,
    rewardPoints: 10,
    status: 'completed',
    speakers: [],
    tags: ['networking', 'social', 'community']
  },
  {
    title: 'Docker & Kubernetes Workshop',
    category: 'workshop',
    description: 'Learn containerization with Docker and orchestration with Kubernetes. Hands-on workshop covering deployment strategies and best practices.',
    location: 'Lab C - Room 205',
    maxCapacity: 20,
    expectedTime: 5,
    rewardPoints: 35,
    status: 'upcoming',
    speakers: [{
      name: 'Carlos Silva',
      bio: 'DevOps Engineer specializing in container technologies and cloud infrastructure',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    }],
    tags: ['docker', 'kubernetes', 'devops', 'containers']
  },
  {
    title: 'Web Security Best Practices',
    category: 'talk',
    description: 'Understanding common web vulnerabilities and how to prevent them. Essential knowledge for every web developer.',
    location: 'Conference Room - Building A',
    maxCapacity: 35,
    expectedTime: 2.5,
    rewardPoints: 20,
    status: 'completed',
    speakers: [{
      name: 'Ahmed Benali',
      bio: 'Cybersecurity specialist and ethical hacker with focus on web application security',
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }],
    tags: ['security', 'web-development', 'cybersecurity']
  },
  {
    title: 'Game Development with Unity',
    category: 'workshop',
    description: 'Introduction to game development using Unity engine. Create your first 2D game from scratch.',
    location: 'Media Lab - Room 301',
    maxCapacity: 15,
    expectedTime: 6,
    rewardPoints: 40,
    status: 'upcoming',
    speakers: [{
      name: 'Emma Thompson',
      bio: 'Game developer and Unity certified instructor with 5+ years in the gaming industry',
      picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }],
    tags: ['game-development', 'unity', 'c#', 'creative']
  },
  {
    title: 'Career Fair Preparation',
    category: 'talk',
    description: 'Tips and strategies for job interviews, resume writing, and career planning in tech industry.',
    location: 'Auditorium - Main Hall',
    maxCapacity: 100,
    expectedTime: 2,
    rewardPoints: 15,
    status: 'upcoming',
    speakers: [{
      name: 'Luna Martinez',
      bio: 'HR specialist and career counselor with extensive experience in tech recruitment',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    }],
    tags: ['career', 'interview', 'professional-development']
  }
];

// Helper functions
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function createDemoUsers() {
  console.log('🧑‍💼 Creating demo users...');
  
  const users = [];
  for (const userData of DEMO_USERS) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.nickname} already exists, skipping...`);
        users.push(existingUser);
        continue;
      }

      // Calculate events and feedbacks based on level
      const eventsCount = Math.floor(userData.level * 2 + Math.random() * 10);
      const feedbackCount = Math.floor(eventsCount * 0.7 + Math.random() * 5);
      
      const user = new User({
        ...userData,
        password: await bcrypt.hash('password123', 10), // Default password for demo
        intraId: `${userData.intraUsername}_${Date.now()}`, // Fake intra ID
        eventsAttended: [], // Will be populated when creating events
        feedbacksGiven: [], // Will be populated when creating events
        settings: {
          language: 'en',
          theme: 'light',
          notifications: {
            eventReminders: true,
            eventStarting: true,
            newEvents: true,
            eventChanges: true,
            pushEnabled: true
          },
          timezone: 'Africa/Casablanca'
        }
      });

      await user.save();
      users.push(user);
      console.log(`✅ Created user: ${userData.nickname} (${userData.role})`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.nickname}:`, error.message);
    }
  }
  
  return users;
}

async function createDemoEvents(users) {
  console.log('📅 Creating demo events...');
  
  const events = [];
  const now = new Date();
  
  for (let i = 0; i < DEMO_EVENTS.length; i++) {
    const eventData = DEMO_EVENTS[i];
    
    try {
      // Check if event already exists
      const existingEvent = await Event.findOne({ title: eventData.title });
      if (existingEvent) {
        console.log(`⚠️  Event "${eventData.title}" already exists, skipping...`);
        events.push(existingEvent);
        continue;
      }

      // Set event time based on status
      let eventTime;
      if (eventData.status === 'completed') {
        // Past events (1-30 days ago)
        eventTime = getRandomDate(
          new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        );
      } else if (eventData.status === 'upcoming') {
        // Future events (1-60 days from now)
        eventTime = getRandomDate(
          new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
        );
      } else {
        // Default to near future
        eventTime = getRandomDate(
          new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        );
      }

      // Find a staff member or admin to be the creator
      const creator = users.find(u => u.role === 'staff' || u.role === 'admin') || users[0];
      
      // Create attendees (50-90% capacity for upcoming events, 60-100% for completed)
      const capacityFillRate = eventData.status === 'completed' 
        ? 0.6 + Math.random() * 0.4  // 60-100%
        : 0.5 + Math.random() * 0.4; // 50-90%
      
      const attendeeCount = Math.floor(eventData.maxCapacity * capacityFillRate);
      const potentialAttendees = users.filter(u => u.role === 'student');
      const selectedAttendees = getRandomElements(potentialAttendees, attendeeCount);
      
      const attendees = selectedAttendees.map(user => ({
        user: user._id,
        status: eventData.status === 'completed' ? 'attended' : 'registered',
        checkInTime: eventData.status === 'completed' ? eventTime : null
      }));

      // Create volunteers (0-3 per event)
      const volunteerCount = Math.floor(Math.random() * 4);
      const potentialVolunteers = users.filter(u => u.role === 'student');
      const selectedVolunteers = getRandomElements(potentialVolunteers, volunteerCount);
      
      const volunteers = selectedVolunteers.map(user => ({
        user: user._id,
        role: ['helper', 'organizer', 'technical_support'][Math.floor(Math.random() * 3)],
        status: 'approved',
        application: {
          experience: 'Previous experience in similar events',
          motivation: 'Want to help the community and gain experience',
          timeCommitment: '3-4 hours'
        }
      }));

      // Create feedbacks for completed events
      const feedbacks = [];
      if (eventData.status === 'completed') {
        const feedbackCount = Math.floor(attendeeCount * (0.3 + Math.random() * 0.4)); // 30-70% feedback rate
        const feedbackUsers = getRandomElements(selectedAttendees, feedbackCount);
        
        for (const user of feedbackUsers) {
          feedbacks.push({
            user: user._id,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars (mostly positive)
            comment: [
              'Great event! Learned a lot and had fun.',
              'Very informative and well-organized.',
              'Excellent speaker and content quality.',
              'Would definitely attend similar events.',
              'Good networking opportunity.',
              'Perfect balance of theory and practice.',
              'Inspiring and motivating session.',
              'Clear explanations and good examples.'
            ][Math.floor(Math.random() * 8)]
          });
        }
      }

      // Create discussions (0-5 per event)
      const discussionCount = Math.floor(Math.random() * 6);
      const discussionUsers = getRandomElements(users, discussionCount);
      const discussions = discussionUsers.map(user => ({
        user: user._id,
        message: [
          'Looking forward to this event!',
          'Any prerequisites for this session?',
          'Will there be hands-on exercises?',
          'Can\'t wait to learn more about this topic.',
          'Great to see such interesting events.',
          'Hope to network with fellow students.',
          'This sounds very relevant to my current projects.'
        ][Math.floor(Math.random() * 7)],
        createdAt: getRandomDate(
          new Date(eventTime.getTime() - 7 * 24 * 60 * 60 * 1000),
          eventTime
        )
      }));

      const event = new Event({
        ...eventData,
        time: eventTime,
        creator: creator._id,
        attendees,
        volunteers,
        feedbacks,
        discussions
      });

      await event.save();
      events.push(event);
      
      // Update user statistics for attended events
      if (eventData.status === 'completed') {
        for (const attendee of selectedAttendees) {
          if (!attendee.eventsAttended.includes(event._id)) {
            attendee.eventsAttended.push(event._id);
            attendee.wallet += eventData.rewardPoints;
          }
        }
        
        // Update feedbacks given
        for (const feedback of feedbacks) {
          const user = selectedAttendees.find(u => u._id.equals(feedback.user));
          if (user && !user.feedbacksGiven.includes(event._id)) {
            user.feedbacksGiven.push(event._id);
            user.wallet += 5; // Bonus for feedback
          }
        }
        
        // Save all updated users
        await Promise.all(selectedAttendees.map(user => user.save()));
      }
      
      console.log(`✅ Created event: ${eventData.title} (${eventData.status}) - ${attendeeCount}/${eventData.maxCapacity} attendees`);
    } catch (error) {
      console.error(`❌ Error creating event "${eventData.title}":`, error.message);
    }
  }
  
  return events;
}

async function createDemoNotifications(users, events) {
  console.log('🔔 Creating demo notifications...');
  
  try {
    const notifications = [];
    const sampleUsers = getRandomElements(users.filter(u => u.role === 'student'), 5);
    
    // Event reminder notifications
    for (const user of sampleUsers) {
      const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 2);
      
      for (const event of upcomingEvents) {
        const notification = new Notification({
          title: 'Event Reminder',
          message: `Don't forget! "${event.title}" starts tomorrow at ${event.time.toLocaleTimeString()}.`,
          type: 'event_reminder',
          recipients: [{
            user: user._id,
            read: Math.random() > 0.5,
            delivered: true,
            deliveredAt: new Date()
          }],
          relatedEvent: event._id,
          sent: true,
          sentAt: new Date(),
          pushNotification: {
            enabled: true,
            sent: true,
            sentAt: new Date()
          }
        });
        
        notifications.push(notification);
      }
    }
    
    // General notifications
    const generalNotifications = [
      {
        title: 'Welcome to 1337 Events!',
        message: 'Discover amazing events, learn new skills, and connect with your peers.',
        type: 'general'
      },
      {
        title: 'New Workshop Series',
        message: 'We\'ve added exciting new workshops to our catalog. Check them out!',
        type: 'general'
      }
    ];
    
    for (const notifData of generalNotifications) {
      const notification = new Notification({
        ...notifData,
        recipients: sampleUsers.map(user => ({
          user: user._id,
          read: Math.random() > 0.3,
          delivered: true,
          deliveredAt: new Date()
        })),
        sent: true,
        sentAt: new Date(),
        pushNotification: {
          enabled: true,
          sent: true,
          sentAt: new Date()
        }
      });
      
      notifications.push(notification);
    }
    
    await Notification.insertMany(notifications);
    console.log(`✅ Created ${notifications.length} demo notifications`);
    
  } catch (error) {
    console.error('❌ Error creating notifications:', error.message);
  }
}

async function updateUserLevels(users) {
  console.log('📊 Updating user levels based on activity...');
  
  try {
    for (const user of users) {
      const eventsPoints = user.eventsAttended.length * 10;
      const feedbackPoints = user.feedbacksGiven.length * 5;
      const totalPoints = eventsPoints + feedbackPoints;
      
      user.level = Math.floor(totalPoints / 50) + 1;
      await user.save();
    }
    
    console.log('✅ Updated user levels based on activity');
  } catch (error) {
    console.error('❌ Error updating user levels:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting demo data population...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Create demo data
    const users = await createDemoUsers();
    const events = await createDemoEvents(users);
    await createDemoNotifications(users, events);
    await updateUserLevels(users);
    
    console.log('🎉 Demo data population completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users created: ${users.length}`);
    console.log(`   📅 Events created: ${events.length}`);
    console.log(`   🏆 Leaderboard ready with realistic data`);
    console.log(`   💰 Users have varying wallet amounts and levels`);
    console.log(`   🔔 Notifications created for engagement`);
    
  } catch (error) {
    console.error('💥 Error during demo data population:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createDemoUsers,
  createDemoEvents,
  createDemoNotifications,
  DEMO_USERS,
  DEMO_EVENTS
}; 