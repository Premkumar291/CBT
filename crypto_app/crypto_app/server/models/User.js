class User {
  constructor(id, name, email, password, role = 'voter') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // 'admin', 'voter'
    this.walletAddress = null; // For MetaMask users
    this.hasVoted = false;
    this.voteHistory = [];
  }

  // Mark user as having voted in an election
  markAsVoted(electionId) {
    this.hasVoted = true;
    this.voteHistory.push(electionId);
  }

  // Check if user has voted in a specific election
  hasVotedInElection(electionId) {
    return this.voteHistory.includes(electionId);
  }
}

module.exports = User;