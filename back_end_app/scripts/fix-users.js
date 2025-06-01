const mongoose = require('mongoose');
const User = require('../src/models/User');

async function fixUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to check`);

    let fixedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      // Check and fix eventsAttended array
      if (!user.eventsAttended || !Array.isArray(user.eventsAttended)) {
        updates.eventsAttended = [];
        needsUpdate = true;
        console.log(`  - Fixing eventsAttended for user: ${user.nickname}`);
      }

      // Check and fix feedbacksGiven array
      if (!user.feedbacksGiven || !Array.isArray(user.feedbacksGiven)) {
        updates.feedbacksGiven = [];
        needsUpdate = true;
        console.log(`  - Fixing feedbacksGiven for user: ${user.nickname}`);
      }

      // Check and fix wallet
      if (typeof user.wallet !== 'number' || user.wallet < 0) {
        updates.wallet = 0;
        needsUpdate = true;
        console.log(`  - Fixing wallet for user: ${user.nickname}`);
      }

      // Check and fix level
      if (typeof user.level !== 'number' || user.level < 1) {
        updates.level = 1;
        needsUpdate = true;
        console.log(`  - Fixing level for user: ${user.nickname}`);
      }

      // Check and fix role
      if (!user.role || !['user', 'student', 'staff', 'admin'].includes(user.role)) {
        updates.role = 'student';
        needsUpdate = true;
        console.log(`  - Fixing role for user: ${user.nickname}`);
      }

      // Apply updates if needed
      if (needsUpdate) {
        try {
          await User.findByIdAndUpdate(user._id, updates, { 
            runValidators: true,
            new: true 
          });
          fixedCount++;
          console.log(`✓ Fixed user: ${user.nickname}`);
        } catch (error) {
          console.error(`✗ Failed to fix user ${user.nickname}:`, error.message);
        }
      }
    }

    console.log(`\nFixed ${fixedCount} users out of ${users.length} total users`);
    console.log('User fix script completed successfully');

  } catch (error) {
    console.error('Error running user fix script:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  fixUsers();
}

module.exports = fixUsers; 