class Election {
  constructor(id, title, description, startDate, endDate, candidates, createdBy) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.candidates = candidates; // Array of candidate names
    this.createdBy = createdBy; // Admin who created the election
    this.isActive = false;
    this.isCompleted = false;
    this.voteCount = {}; // Track votes for each candidate
    this.voterList = []; // Track who has voted
    
    // Initialize vote count for each candidate
    candidates.forEach(candidate => {
      this.voteCount[candidate] = 0;
    });
  }

  // Activate the election
  activate() {
    const now = new Date();
    if (now >= this.startDate && now <= this.endDate) {
      this.isActive = true;
      this.isCompleted = false;
    }
  }

  // Deactivate the election
  deactivate() {
    this.isActive = false;
    this.isCompleted = true;
  }

  // Add a vote to a candidate
  addVote(candidate) {
    if (this.voteCount[candidate] !== undefined) {
      this.voteCount[candidate]++;
      return true;
    }
    return false;
  }

  // Record a voter
  recordVoter(voterId) {
    this.voterList.push(voterId);
  }

  // Check if a voter has already voted
  hasVoted(voterId) {
    return this.voterList.includes(voterId);
  }

  // Get results
  getResults() {
    return this.voteCount;
  }
}

module.exports = Election;