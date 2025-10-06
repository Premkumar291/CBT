import metaMaskService from './metamaskService';
import api from './api';

// MetaMask login function
export const metaMaskLogin = async () => {
  try {
    // Connect to MetaMask
    const { account } = await metaMaskService.connect();
    
    // Create a message to sign
    const message = `Login to Blockchain Voting System\nWallet: ${account}\nTimestamp: ${new Date().toISOString()}`;
    
    // Sign the message
    const signature = await metaMaskService.signMessage(message);
    
    // Send the signature and account to backend for verification
    const response = await api.post('/users/metamask-login', {
      walletAddress: account,
      message: message,
      signature: signature
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('walletAddress', account);
    }
    
    return response.data;
  } catch (error) {
    console.error('MetaMask login error:', error);
    throw error;
  }
};

// MetaMask register function
export const metaMaskRegister = async (userData) => {
  try {
    // Connect to MetaMask
    const { account } = await metaMaskService.connect();
    
    // Create a message to sign
    const message = `Register to Blockchain Voting System
Wallet: ${account}
Name: ${userData.name}
Role: ${userData.role}
Timestamp: ${new Date().toISOString()}`;
    
    // Sign the message
    const signature = await metaMaskService.signMessage(message);
    
    // Send the signature and account to backend for registration
    const response = await api.post('/users/metamask-register', {
      walletAddress: account,
      name: userData.name,
      role: userData.role,
      message: message,
      signature: signature
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('walletAddress', account);
    }
    
    return response.data;
  } catch (error) {
    console.error('MetaMask registration error:', error);
    throw error;
  }
};

// Check if user is logged in with MetaMask
export const isMetaMaskLoggedIn = () => {
  return !!localStorage.getItem('walletAddress') && !!localStorage.getItem('token');
};

// Get wallet address
export const getWalletAddress = () => {
  return localStorage.getItem('walletAddress');
};

// Logout from MetaMask
export const metaMaskLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('walletAddress');
};