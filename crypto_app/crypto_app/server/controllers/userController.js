const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const ethUtil = require('ethereumjs-util');
const { users } = require('../config/db');
const User = require('../models/User');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User(
      uuidv4(),
      name,
      email,
      hashedPassword,
      role || 'voter'
    );

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// MetaMask login
const metaMaskLogin = async (req, res) => {
  try {
    const { walletAddress, message, signature } = req.body;

    // Verify the signature
    const messageBuffer = Buffer.from(message, 'utf8');
    const msgHash = ethUtil.hashPersonalMessage(messageBuffer);
    const signatureParams = ethUtil.fromRpcSig(signature);
    const publicKey = ethUtil.ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
    const address = ethUtil.bufferToHex(ethUtil.publicToAddress(publicKey));

    // Check if the recovered address matches the provided wallet address
    if (address.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({ message: 'Signature verification failed' });
    }

    // Check if user exists, if not create a new user
    let user = users.find(user => user.walletAddress === walletAddress);
    
    if (!user) {
      // Create new user with wallet address
      user = new User(
        uuidv4(),
        `Wallet User ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`,
        `${walletAddress}@wallet.com`, // Using wallet address as email
        '', // No password for wallet users
        'voter'
      );
      user.walletAddress = walletAddress;
      users.push(user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Logged in successfully with MetaMask',
      token,
      user: {
        id: user.id,
        name: user.name,
        walletAddress: user.walletAddress,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// MetaMask register
const metaMaskRegister = async (req, res) => {
  try {
    const { walletAddress, name, role, message, signature } = req.body;

    // Verify the signature
    const messageBuffer = Buffer.from(message, 'utf8');
    const msgHash = ethUtil.hashPersonalMessage(messageBuffer);
    const signatureParams = ethUtil.fromRpcSig(signature);
    const publicKey = ethUtil.ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
    const address = ethUtil.bufferToHex(ethUtil.publicToAddress(publicKey));

    // Check if the recovered address matches the provided wallet address
    if (address.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({ message: 'Signature verification failed' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.walletAddress === walletAddress);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this wallet already exists' });
    }

    // Create new user
    const newUser = new User(
      uuidv4(),
      name,
      `${walletAddress}@wallet.com`, // Using wallet address as email
      '', // No password for wallet users
      role || 'voter'
    );
    newUser.walletAddress = walletAddress;

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, walletAddress: newUser.walletAddress },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully with MetaMask',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        walletAddress: newUser.walletAddress,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getAllUsers, metaMaskLogin, metaMaskRegister };