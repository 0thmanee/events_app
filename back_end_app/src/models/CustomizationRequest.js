const mongoose = require('mongoose');

const customizationRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['nickname', 'picture'],
    required: true
  },
  requestedChange: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: null
  },
  reservedCoins: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to ensure coins are reserved
customizationRequestSchema.pre('save', async function(next) {
  if (this.isNew && this.reservedCoins) {
    const user = await mongoose.model('User').findById(this.user);
    if (user.wallet < this.cost) {
      throw new Error('Insufficient coins for customization request');
    }
    user.wallet -= this.cost;
    await user.save();
  }
  next();
});

// Method to handle request approval
customizationRequestSchema.methods.approve = async function() {
  const user = await mongoose.model('User').findById(this.user);
  
  if (this.type === 'nickname') {
    user.nickname = this.requestedChange;
  } else if (this.type === 'picture') {
    user.picture = this.requestedChange;
  }

  this.status = 'approved';
  await user.save();
  await this.save();
};

// Method to handle request rejection
customizationRequestSchema.methods.reject = async function(note) {
  const user = await mongoose.model('User').findById(this.user);
  
  // Refund the coins
  user.wallet += this.cost;
  this.status = 'rejected';
  this.adminNote = note;
  
  await user.save();
  await this.save();
};

const CustomizationRequest = mongoose.model('CustomizationRequest', customizationRequestSchema);
module.exports = CustomizationRequest;
