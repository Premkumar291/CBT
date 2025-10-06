class Vote {
  constructor(id, electionId, voterId, candidate, timestamp, blockchainHash) {
    this.id = id;
    this.electionId = electionId;
    this.voterId = voterId;
    this.candidate = candidate;
    this.timestamp = timestamp;
    this.blockchainHash = blockchainHash; // Hash stored on blockchain for verification
  }

  // Verify vote integrity
  verifyIntegrity(expectedHash) {
    return this.blockchainHash === expectedHash;
  }
}

module.exports = Vote;