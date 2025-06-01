const mongoose = require('mongoose');
const Event = require('../src/models/Event');
const User = require('../src/models/User');

async function fixEvents() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management');
    console.log('Connected to MongoDB');

    // Find all events
    const events = await Event.find({});
    console.log(`Found ${events.length} events to check`);

    let fixedCount = 0;
    
    // Get a default admin user to assign as creator if missing
    const adminUser = await User.findOne({ role: 'admin' });
    const defaultCreatorId = adminUser ? adminUser._id : null;

    for (const event of events) {
      let needsUpdate = false;
      const updates = {};

      // Check and fix creator
      if (!event.creator) {
        if (defaultCreatorId) {
          updates.creator = defaultCreatorId;
          needsUpdate = true;
          console.log(`  - Fixing creator for event: ${event.title}`);
        }
      }

      // Check and fix maxCapacity
      if (!event.maxCapacity || event.maxCapacity <= 0) {
        updates.maxCapacity = Math.max(50, event.attendees.length + 10);
        needsUpdate = true;
        console.log(`  - Fixing maxCapacity for event: ${event.title}`);
      }

      // Check and fix location
      if (!event.location || event.location.trim() === '') {
        updates.location = '1337 Campus';
        needsUpdate = true;
        console.log(`  - Fixing location for event: ${event.title}`);
      }

      // Check and fix other potential issues
      if (!event.description || event.description.trim() === '') {
        updates.description = 'Event description will be updated soon.';
        needsUpdate = true;
        console.log(`  - Fixing description for event: ${event.title}`);
      }

      if (!event.time) {
        updates.time = new Date();
        needsUpdate = true;
        console.log(`  - Fixing time for event: ${event.title}`);
      }

      if (!event.expectedTime || event.expectedTime <= 0) {
        updates.expectedTime = 2; // Default 2 hours
        needsUpdate = true;
        console.log(`  - Fixing expectedTime for event: ${event.title}`);
      }

      if (!event.category) {
        updates.category = 'other';
        needsUpdate = true;
        console.log(`  - Fixing category for event: ${event.title}`);
      }

      // Apply updates if needed
      if (needsUpdate) {
        try {
          await Event.findByIdAndUpdate(event._id, updates, { 
            runValidators: true,
            new: true 
          });
          fixedCount++;
          console.log(`✓ Fixed event: ${event.title}`);
        } catch (error) {
          console.error(`✗ Failed to fix event ${event.title}:`, error.message);
        }
      }
    }

    console.log(`\nFixed ${fixedCount} events out of ${events.length} total events`);
    console.log('Event fix script completed successfully');

  } catch (error) {
    console.error('Error running event fix script:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  fixEvents();
}

module.exports = fixEvents; 