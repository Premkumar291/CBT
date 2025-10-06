const Block = require('./Block');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  // Create and add a new block with data
  addNewBlock(data) {
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      data,
      this.getLatestBlock().hash
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  // Find a block by its hash
  findBlockByHash(hash) {
    return this.chain.find(block => block.hash === hash);
  }

  // Check if a user has already voted in a specific election
  hasUserVotedInElection(electionId, userId) {
    return this.chain.some(block => {
      // Skip genesis block
      if (block.index === 0) return false;
      
      // Check if block contains vote data for this election and user
      return block.data && 
             block.data.electionId === electionId && 
             block.data.voterId === userId;
    });
  }

  // Get all votes for a specific election
  getVotesForElection(electionId) {
    return this.chain.filter(block => {
      // Skip genesis block
      if (block.index === 0) return false;
      
      // Check if block contains vote data for this election
      return block.data && block.data.electionId === electionId;
    });
  }

  // Get all votes by a specific user
  getVotesByUser(userId) {
    return this.chain.filter(block => {
      // Skip genesis block
      if (block.index === 0) return false;
      
      // Check if block contains vote data for this user
      return block.data && block.data.voterId === userId;
    });
  }
}

module.exports = Blockchain;