import { ethers } from 'ethers';

class MetaMaskService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connect() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = accounts[0];

      return {
        account: this.account,
        provider: this.provider,
        signer: this.signer
      };
    } catch (error) {
      throw new Error('Failed to connect to MetaMask: ' + error.message);
    }
  }

  // Get current account
  async getCurrentAccount() {
    if (!this.isMetaMaskInstalled()) {
      return null;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length > 0) {
        this.account = accounts[0];
        return this.account;
      }
      return null;
    } catch (error) {
      console.error('Error getting accounts:', error);
      return null;
    }
  }

  // Sign a message with MetaMask
  async signMessage(message) {
    if (!this.signer) {
      throw new Error('No signer available. Please connect to MetaMask first.');
    }

    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      throw new Error('Failed to sign message: ' + error.message);
    }
  }

  // Get account balance
  async getBalance() {
    if (!this.account || !this.provider) {
      throw new Error('Not connected to MetaMask');
    }

    try {
      const balance = await this.provider.getBalance(this.account);
      return ethers.formatEther(balance);
    } catch (error) {
      throw new Error('Failed to get balance: ' + error.message);
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  // Listen for chain changes
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  // Remove listeners
  removeListeners() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }
}

// Export singleton instance
const metaMaskService = new MetaMaskService();
export default metaMaskService;