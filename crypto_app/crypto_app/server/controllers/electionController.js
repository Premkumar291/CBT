const { v4: uuidv4 } = require('uuid');
const { elections, users } = require('../config/db');
const Election = require('../models/Election');

// Create a new election (admin only)
const createElection = (req, res) => {
  try {
    const { title, description, startDate, endDate, candidates } = req.body;
    const adminId = req.user.id;

    // Validate input
    if (!title || !description || !startDate || !endDate || !candidates || candidates.length < 2) {
      return res.status(400).json({ 
        message: 'Title, description, start date, end date, and at least 2 candidates are required' 
      });
    }

    // Check if admin exists
    const admin = users.find(user => user.id === adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create elections' });
    }

    // Create new election
    const newElection = new Election(
      uuidv4(),
      title,
      description,
      new Date(startDate),
      new Date(endDate),
      candidates,
      adminId
    );

    elections.push(newElection);

    res.status(201).json({
      message: 'Election created successfully',
      election: newElection
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all elections
const getAllElections = (req, res) => {
  try {
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get election by ID
const getElectionById = (req, res) => {
  try {
    const { id } = req.params;
    const election = elections.find(election => election.id === id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Activate an election (admin only)
const activateElection = (req, res) => {
  try {
    const { id } = req.params;
    const election = elections.find(election => election.id === id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can activate elections' });
    }

    election.activate();
    
    res.json({
      message: 'Election activated successfully',
      election
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Deactivate an election (admin only)
const deactivateElection = (req, res) => {
  try {
    const { id } = req.params;
    const election = elections.find(election => election.id === id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can deactivate elections' });
    }

    election.deactivate();
    
    res.json({
      message: 'Election deactivated successfully',
      election
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createElection, 
  getAllElections, 
  getElectionById, 
  activateElection, 
  deactivateElection 
};