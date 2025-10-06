const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const electionRoutes = require('./routes/electionRoutes');
const voteRoutes = require('./routes/voteRoutes');

// Import seed script
const createSampleElections = require('./scripts/seedElections');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Blockchain Voting System API' });
});

// Create sample elections on startup
createSampleElections();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});