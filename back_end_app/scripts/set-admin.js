const mongoose = require('mongoose');
const User = require('../src/models/User');

async function setAdminRole() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management');
    console.log('Connected to MongoDB');

    // Find the obouchta user
    const targetUsername = 'obouchta';
    
    console.log(`Looking for user with intraUsername: ${targetUsername}...`);
    
    // Try to find by intraUsername first
    let user = await User.findOne({ intraUsername: targetUsername });
    
    // If not found by intraUsername, try by nickname
    if (!user) {
      console.log(`User not found by intraUsername, trying nickname...`);
      user = await User.findOne({ nickname: targetUsername });
    }
    
    // If still not found, try by email
    if (!user) {
      console.log(`User not found by nickname, trying email...`);
      user = await User.findOne({ email: { $regex: targetUsername, $options: 'i' } });
    }

    if (!user) {
      console.log('❌ User "obouchta" not found!');
      console.log('Available users:');
      const allUsers = await User.find({}, 'nickname intraUsername email role').limit(10);
      allUsers.forEach(u => {
        console.log(`  - ${u.nickname} (${u.intraUsername || 'no intra'}) [${u.email}] - Role: ${u.role}`);
      });
      return;
    }

    console.log(`Found user: ${user.nickname} (${user.intraUsername || 'no intra'}) [${user.email}]`);
    console.log(`Current role: ${user.role}`);

    // Update user role to admin
    const updatedUser = await User.findByIdAndUpdate(
      user._id, 
      { role: 'admin' }, 
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      console.log(`✅ Successfully updated ${updatedUser.nickname} to admin role!`);
      console.log(`New role: ${updatedUser.role}`);
    } else {
      console.log('❌ Failed to update user role');
    }

  } catch (error) {
    console.error('❌ Error setting admin role:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  setAdminRole();
}

module.exports = setAdminRole; 