import api from './api';

// Create a new election
export const createElection = async (electionData) => {
  try {
    const response = await api.post('/elections', electionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get all elections
export const getAllElections = async () => {
  try {
    const response = await api.get('/elections');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get election by ID
export const getElectionById = async (id) => {
  try {
    const response = await api.get(`/elections/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Activate an election
export const activateElection = async (id) => {
  try {
    const response = await api.put(`/elections/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Deactivate an election
export const deactivateElection = async (id) => {
  try {
    const response = await api.put(`/elections/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};