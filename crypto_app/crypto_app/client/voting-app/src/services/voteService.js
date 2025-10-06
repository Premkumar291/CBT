import api from './api';

// Cast a vote
export const castVote = async (voteData) => {
  try {
    const response = await api.post('/votes', voteData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get election results
export const getResults = async (electionId) => {
  try {
    const response = await api.get(`/votes/results/${electionId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Verify a vote
export const verifyVote = async (voteId) => {
  try {
    const response = await api.get(`/votes/verify/${voteId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get blockchain verification details for an election
export const getBlockchainVerification = async (electionId) => {
  try {
    const response = await api.get(`/votes/blockchain/${electionId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};