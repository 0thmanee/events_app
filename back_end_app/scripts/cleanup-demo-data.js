const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Event = require('../src/models/Event');
const Notification = require('../src/models/Notification');
const CustomizationRequest = require('../src/models/CustomizationRequest');

async function getLoggedInUser() {
  try {
    // Try to find a user that might be the "real" logged-in user
    // Look for users that don't match our demo data patterns
    
    const demoEmails = [
      'achen@student.42.fr',
      'mjohnson@student.42.fr',
      'srodriguez@student.42.fr',
      'abenali@student.42.fr',
      'ethompson@student.42.fr',
      'dkim@student.42.fr',
      'lmartinez@student.42.fr',
      'roconnor@student.42.fr',
      'zhassan@student.42.fr',
      'csilva@student.42.fr',
      'swilson@staff.42.fr',
      'mbrown@staff.42.fr',
      'asmith@staff.42.fr'
    ];
    
    // Find users that are NOT in our demo data list
    const realUsers = await User.find({
      email: { $nin: demoEmails }
    }).sort({ createdAt: 1 }); // Get the oldest real user (likely the first created)
    
    if (realUsers.length > 0) {
      console.log(`🔍 Found ${realUsers.length} real user(s) that will be preserved:`);
      realUsers.forEach(user => {
        console.log(`   👤 ${user.nickname} (${user.email}) - ${user.role}`);
      });
      return realUsers;
    }
    
    console.log('⚠️  No real users found outside of demo data');
    return [];
    
  } catch (error) {
    console.error('❌ Error finding logged-in user:', error.message);
    return [];
  }
}

async function confirmDeletion() {
  // In a real scenario, you might want to add interactive confirmation
  // For now, we'll just log what we're about to do
  console.log('⚠️  WARNING: This will delete ALL demo data from the database!');
  console.log('📋 Operations to perform:');
  console.log('   🗑️  Delete ALL events');
  console.log('   🗑️  Delete ALL demo users (preserving real users)');
  console.log('   🗑️  Delete ALL notifications');
  console.log('   🗑️  Delete ALL customization requests');
  console.log('');
  
  // Add a small delay for safety
  console.log('⏳ Starting cleanup in 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return true;
}

async function deleteAllEvents() {
  try {
    console.log('🗑️  Deleting all events...');
    
    const eventCount = await Event.countDocuments();
    console.log(`   Found ${eventCount} events to delete`);
    
    if (eventCount === 0) {
      console.log('   ✅ No events to delete');
      return { deletedCount: 0 };
    }
    
    const result = await Event.deleteMany({});
    console.log(`   ✅ Deleted ${result.deletedCount} events`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error deleting events:', error.message);
    throw error;
  }
}

async function deleteDemoUsers(preserveUsers = []) {
  try {
    console.log('🗑️  Deleting demo users...');
    
    const preserveIds = preserveUsers.map(user => user._id);
    
    // Count users to delete
    const userCount = await User.countDocuments({
      _id: { $nin: preserveIds }
    });
    
    console.log(`   Found ${userCount} users to delete`);
    console.log(`   Preserving ${preserveUsers.length} real users`);
    
    if (userCount === 0) {
      console.log('   ✅ No users to delete');
      return { deletedCount: 0 };
    }
    
    // Delete users except preserved ones
    const result = await User.deleteMany({
      _id: { $nin: preserveIds }
    });
    
    console.log(`   ✅ Deleted ${result.deletedCount} demo users`);
    
    // Reset preserved users' event data and wallet if needed
    for (const user of preserveUsers) {
      if (user.eventsAttended.length > 0 || user.feedbacksGiven.length > 0) {
        console.log(`   🔄 Resetting activity data for ${user.nickname}`);
        user.eventsAttended = [];
        user.feedbacksGiven = [];
        user.wallet = Math.max(user.wallet, 100); // Ensure they have some starting credits
        user.level = 1; // Reset to level 1
        await user.save();
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Error deleting demo users:', error.message);
    throw error;
  }
}

async function deleteAllNotifications() {
  try {
    console.log('🗑️  Deleting all notifications...');
    
    const notificationCount = await Notification.countDocuments();
    console.log(`   Found ${notificationCount} notifications to delete`);
    
    if (notificationCount === 0) {
      console.log('   ✅ No notifications to delete');
      return { deletedCount: 0 };
    }
    
    const result = await Notification.deleteMany({});
    console.log(`   ✅ Deleted ${result.deletedCount} notifications`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error deleting notifications:', error.message);
    throw error;
  }
}

async function deleteAllCustomizationRequests() {
  try {
    console.log('🗑️  Deleting all customization requests...');
    
    const requestCount = await CustomizationRequest.countDocuments();
    console.log(`   Found ${requestCount} customization requests to delete`);
    
    if (requestCount === 0) {
      console.log('   ✅ No customization requests to delete');
      return { deletedCount: 0 };
    }
    
    const result = await CustomizationRequest.deleteMany({});
    console.log(`   ✅ Deleted ${result.deletedCount} customization requests`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error deleting customization requests:', error.message);
    throw error;
  }
}

async function verifyCleanup() {
  try {
    console.log('🔍 Verifying cleanup...');
    
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();
    const notificationCount = await Notification.countDocuments();
    const requestCount = await CustomizationRequest.countDocuments();
    
    console.log('📊 Database state after cleanup:');
    console.log(`   📅 Events: ${eventCount}`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🔔 Notifications: ${notificationCount}`);
    console.log(`   🎨 Customization Requests: ${requestCount}`);
    
    if (eventCount === 0 && notificationCount === 0 && requestCount === 0) {
      console.log('✅ Cleanup completed successfully!');
      return true;
    } else {
      console.log('⚠️  Some data may not have been cleaned up properly');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error verifying cleanup:', error.message);
    return false;
  }
}

async function resetDatabase() {
  try {
    console.log('🔄 Performing complete database reset...');
    
    // Delete everything except indexes
    await Event.collection.drop().catch(() => console.log('   Events collection already empty'));
    await Notification.collection.drop().catch(() => console.log('   Notifications collection already empty'));
    await CustomizationRequest.collection.drop().catch(() => console.log('   Customization requests collection already empty'));
    
    // For users, only delete demo users
    const preserveUsers = await getLoggedInUser();
    if (preserveUsers.length > 0) {
      const preserveIds = preserveUsers.map(user => user._id);
      await User.deleteMany({ _id: { $nin: preserveIds } });
      console.log(`   ✅ Deleted all users except ${preserveUsers.length} preserved users`);
    } else {
      console.log('   ⚠️  No users to preserve, keeping all users (use with caution!)');
    }
    
    console.log('✅ Database reset completed!');
    
  } catch (error) {
    console.error('❌ Error during database reset:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🧹 Starting demo data cleanup...');
    console.log('');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    console.log('');
    
    // Find users to preserve
    const preserveUsers = await getLoggedInUser();
    console.log('');
    
    // Confirm before proceeding
    const confirmed = await confirmDeletion();
    if (!confirmed) {
      console.log('❌ Cleanup cancelled by user');
      return;
    }
    
    console.log('🚀 Starting cleanup operations...');
    console.log('');
    
    // Perform cleanup operations
    const eventsResult = await deleteAllEvents();
    const notificationsResult = await deleteAllNotifications();
    const requestsResult = await deleteAllCustomizationRequests();
    const usersResult = await deleteDemoUsers(preserveUsers);
    
    console.log('');
    console.log('📊 Cleanup Summary:');
    console.log(`   🗑️  Events deleted: ${eventsResult.deletedCount}`);
    console.log(`   🗑️  Users deleted: ${usersResult.deletedCount}`);
    console.log(`   🗑️  Notifications deleted: ${notificationsResult.deletedCount}`);
    console.log(`   🗑️  Customization requests deleted: ${requestsResult.deletedCount}`);
    console.log(`   👤 Users preserved: ${preserveUsers.length}`);
    console.log('');
    
    // Verify cleanup
    await verifyCleanup();
    
    console.log('');
    console.log('🎉 Demo data cleanup completed successfully!');
    console.log('💡 The database is now clean and ready for fresh data or production use.');
    
  } catch (error) {
    console.error('💥 Error during cleanup:', error);
    console.log('');
    console.log('⚠️  Cleanup may have been incomplete. Please check the database manually.');
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const resetMode = args.includes('--reset') || args.includes('-r');

if (resetMode) {
  // Reset mode: Complete database wipe
  console.log('🚨 RESET MODE: This will completely wipe the database!');
  console.log('');
  
  (async () => {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
      await mongoose.connect(mongoUri);
      await resetDatabase();
    } catch (error) {
      console.error('💥 Error during reset:', error);
    } finally {
      await mongoose.disconnect();
      process.exit(0);
    }
  })();
} else {
  // Normal cleanup mode
  if (require.main === module) {
    main();
  }
}

module.exports = {
  deleteAllEvents,
  deleteDemoUsers,
  deleteAllNotifications,
  deleteAllCustomizationRequests,
  getLoggedInUser,
  resetDatabase
}; 