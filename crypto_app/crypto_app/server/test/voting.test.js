const request = require('supertest');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('../routes/userRoutes');
const electionRoutes = require('../routes/electionRoutes');
const voteRoutes = require('../routes/voteRoutes');

// Create Express app
const app = express();

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

describe('Voting System API', () => {
  let adminToken, voterToken, electionId;

  // Test user registration and login
  test('should register and login admin user', async () => {
    // Register admin
    const adminRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });
    
    expect(adminRes.status).toBe(201);
    expect(adminRes.body.token).toBeDefined();
    adminToken = adminRes.body.token;

    // Login admin
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });

  test('should register and login voter user', async () => {
    // Register voter
    const voterRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Voter User',
        email: 'voter@test.com',
        password: 'password123',
        role: 'voter'
      });
    
    expect(voterRes.status).toBe(201);
    expect(voterRes.body.token).toBeDefined();
    voterToken = voterRes.body.token;
  });

  test('should create an election', async () => {
    const res = await request(app)
      .post('/api/elections')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Election',
        description: 'A test election',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        candidates: ['Candidate 1', 'Candidate 2', 'Candidate 3']
      });
    
    expect(res.status).toBe(201);
    expect(res.body.election).toBeDefined();
    electionId = res.body.election.id;
  });

  test('should activate election', async () => {
    const res = await request(app)
      .put(`/api/elections/${electionId}/activate`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.election.isActive).toBe(true);
  });

  test('should cast a vote', async () => {
    const res = await request(app)
      .post('/api/votes')
      .set('Authorization', `Bearer ${voterToken}`)
      .send({
        electionId: electionId,
        candidate: 'Candidate 1'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.vote).toBeDefined();
    expect(res.body.vote.candidate).toBe('Candidate 1');
  });

  test('should get election results', async () => {
    const res = await request(app)
      .get(`/api/votes/results/${electionId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.results['Candidate 1']).toBe(1);
  });
});