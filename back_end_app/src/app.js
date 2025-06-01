require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const storeRoutes = require('./routes/storeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : '*',  // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  // Always bind to 0.0.0.0 to allow external connections
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Log available network addresses
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    console.log('\nAvailable on:');
    console.log(`Local:            http://localhost:${PORT}`);
    
    // Find and display all network interfaces
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal addresses
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`On Your Network:   http://${net.address}:${PORT}`);
        }
      }
    }
    console.log('\nPress CTRL-C to stop');
  });
}

module.exports = app;
