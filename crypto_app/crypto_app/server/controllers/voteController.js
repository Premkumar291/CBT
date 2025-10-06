const { v4: uuidv4 } = require('uuid');
const Web3 = require('web3');
const { elections, votes } = require('../config/db');
const Vote = require('../models/Vote');
const { voteBlockchain } = require('../config/blockchain');

// Cast a vote
const castVote = async (req, res) => {
  try {
    const { electionId, candidate } = req.body;
    const voterId = req.user.id;

    // Find election
    const election = elections.find(election => election.id === electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if election is active
    if (!election.isActive) {
      return res.status(400).json({ message: 'Election is not active' });
    }

    // Check if user has already voted using blockchain verification
    if (election.hasVoted(voterId) || voteBlockchain.hasUserVotedInElection(electionId, voterId)) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Check if candidate is valid
    if (!election.candidates.includes(candidate)) {
      return res.status(400).json({ message: 'Invalid candidate' });
    }

    // Add vote to election
    election.addVote(candidate);
    election.recordVoter(voterId);

    // Add vote to blockchain
    const voteData = {
      electionId,
      voterId,
      candidate,
      timestamp: new Date().toISOString()
    };
    
    const newBlock = voteBlockchain.addNewBlock(voteData);
    const blockchainHash = newBlock.hash;

    // Create vote record
    const newVote = new Vote(
      uuidv4(),
      electionId,
      voterId,
      candidate,
      new Date(),
      blockchainHash
    );

    votes.push(newVote);

    res.status(201).json({
      message: 'Vote cast successfully',
      vote: {
        id: newVote.id,
        electionId: newVote.electionId,
        candidate: newVote.candidate,
        timestamp: newVote.timestamp,
        blockchainHash: newVote.blockchainHash
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get election results
const getResults = (req, res) => {
  try {
    const { electionId } = req.params;
    
    // Find election
    const election = elections.find(election => election.id === electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Only admins or after election completion can view results
    if (req.user.role !== 'admin' && !election.isCompleted) {
      return res.status(403).json({ message: 'Results are not available yet' });
    }

    res.json({
      electionId,
      results: election.getResults(),
      totalVotes: Object.values(election.getResults()).reduce((a, b) => a + b, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify vote on blockchain (simplified)
const verifyVote = async (req, res) => {
  try {
    const { voteId } = req.params;
    
    // Find vote
    const vote = votes.find(vote => vote.id === voteId);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    // Verify vote on blockchain
    const block = voteBlockchain.findBlockByHash(vote.blockchainHash);
    const isVerified = !!block;
    
    res.json({
      message: 'Vote verification details',
      voteId: vote.id,
      blockchainHash: vote.blockchainHash,
      isVerified: isVerified,
      blockData: isVerified ? block.data : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get blockchain verification details for an election
const getBlockchainVerification = (req, res) => {
  try {
    const { electionId } = req.params;
    
    // Find election
    const election = elections.find(election => election.id === electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Get blockchain votes for this election
    const blockchainVotes = voteBlockchain.getVotesForElection(electionId);
    
    // Get blockchain integrity status
    const isChainValid = voteBlockchain.isChainValid();
    
    res.json({
      electionId,
      blockchainVotes: blockchainVotes.length - 1, // Subtract genesis block
      isChainValid,
      message: 'Blockchain verification details'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { castVote, getResults, verifyVote, getBlockchainVerification };