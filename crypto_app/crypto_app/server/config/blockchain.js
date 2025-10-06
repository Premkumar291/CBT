const Blockchain = require('../models/Blockchain');

// Initialize blockchain for votes
const voteBlockchain = new Blockchain();

module.exports = {
  voteBlockchain
};