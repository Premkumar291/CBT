const { v4: uuidv4 } = require('uuid');
const { elections, users } = require('../config/db');
const Election = require('../models/Election');

// Create sample elections
const createSampleElections = () => {
  // Create a sample admin user if none exists
  let adminUser = users.find(user => user.role === 'admin');
  
  if (!adminUser) {
    adminUser = {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // dummy hashed password
      role: 'admin',
      walletAddress: null,
      hasVoted: false,
      voteHistory: []
    };
    users.push(adminUser);
    console.log('Created sample admin user');
  }

  // Clear existing elections
  elections.length = 0;

  // Sample Election 1: University Student Council
  const election1 = new Election(
    uuidv4(),
    'University Student Council Election',
    'Vote for your representatives in the Student Council for the upcoming academic year.',
    new Date(Date.now() - 24 * 60 * 60 * 1000), // Started 1 day ago
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // Ends in 1 week
    ['Alex Johnson', 'Maria Garcia', 'David Smith', 'Sarah Williams'],
    adminUser.id
  );
  election1.activate(); // Activate the election
  elections.push(election1);

  // Sample Election 2: Community Park Development
  const election2 = new Election(
    uuidv4(),
    'Community Park Development Project',
    'Vote on the proposed development plans for the new community park.',
    new Date(Date.now() + 24 * 60 * 60 * 1000), // Starts in 1 day
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Ends in 2 weeks
    ['Option A: Sports Facilities', 'Option B: Playground & Gardens', 'Option C: Both Projects'],
    adminUser.id
  );
  elections.push(election2);

  // Sample Election 3: Board of Directors Election
  const election3 = new Election(
    uuidv4(),
    'Board of Directors Election',
    'Annual election for the Board of Directors positions.',
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Started 1 week ago
    new Date(Date.now() - 24 * 60 * 60 * 1000), // Ended 1 day ago
    ['Jennifer Brown', 'Michael Davis', 'Robert Wilson', 'Lisa Taylor', 'James Miller'],
    adminUser.id
  );
  election3.deactivate(); // Deactivate as it's completed
  elections.push(election3);

  console.log('Sample elections created successfully!');
  console.log(`1. ${election1.title} - Active`);
  console.log(`2. ${election2.title} - Upcoming`);
  console.log(`3. ${election3.title} - Completed`);
};

module.exports = createSampleElections;