import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionById, activateElection, deactivateElection } from '../services/electionService';
import { castVote, getResults, verifyVote, getBlockchainVerification } from '../services/voteService';
import { getCurrentUser } from '../services/authService';

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [voting, setVoting] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [blockchainData, setBlockchainData] = useState(null);
  const [showBlockchainInfo, setShowBlockchainInfo] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const data = await getElectionById(id);
        setElection(data);
      } catch (err) {
        setError('Failed to fetch election details');
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [id]);

  const handleActivate = async () => {
    try {
      const data = await activateElection(id);
      setElection(data.election);
    } catch (err) {
      setError('Failed to activate election');
    }
  };

  const handleDeactivate = async () => {
    try {
      const data = await deactivateElection(id);
      setElection(data.election);
    } catch (err) {
      setError('Failed to deactivate election');
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    setVoting(true);
    setError('');

    try {
      await castVote({ electionId: id, candidate: selectedCandidate });
      // Refresh election data
      const data = await getElectionById(id);
      setElection(data);
      setSelectedCandidate('');
      // Show success message
      alert('Vote cast successfully!');
    } catch (err) {
      setError(err.message || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  const handleViewResults = async () => {
    try {
      const data = await getResults(id);
      setResults(data);
      setShowResults(true);
    } catch (err) {
      setError('Failed to fetch results');
    }
  };

  const handleViewBlockchainInfo = async () => {
    try {
      const data = await getBlockchainVerification(id);
      setBlockchainData(data);
      setShowBlockchainInfo(true);
    } catch (err) {
      setError('Failed to fetch blockchain verification data');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatus = () => {
    if (!election) return '';
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) {
      return 'Upcoming';
    } else if (now >= startDate && now <= endDate) {
      return election.isActive ? 'Active' : 'Inactive';
    } else {
      return 'Completed';
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Election not found</div>
      </div>
    );
  }

  const status = getStatus();
  // Check if user has already voted in this election
  const hasUserVoted = election.voterList && election.voterList.includes(user.id);
  const canVote = status === 'Active' && user && user.role === 'voter' && !hasUserVoted;
  const isAdmin = user && user.role === 'admin';
  const isCompleted = status === 'Completed';

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>{election.title}</h3>
            </div>
            <div className="card-body">
              <p>{election.description}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`ms-2 badge bg-${
                  status === 'Active' ? 'success' : 
                  status === 'Inactive' ? 'secondary' : 
                  status === 'Upcoming' ? 'info' : 'dark'
                }`}>
                  {status}
                </span>
              </p>
              <p><strong>Start Date:</strong> {formatDate(election.startDate)}</p>
              <p><strong>End Date:</strong> {formatDate(election.endDate)}</p>
              
              {isAdmin && (
                <div className="mt-3">
                  {election.isActive ? (
                    <button className="btn btn-warning me-2" onClick={handleDeactivate}>
                      Deactivate Election
                    </button>
                  ) : (
                    <button className="btn btn-success me-2" onClick={handleActivate}>
                      Activate Election
                    </button>
                  )}
                </div>
              )}

              {canVote && (
                <div className="mt-4">
                  <h5>Cast Your Vote</h5>
                  <div className="mb-3">
                    <label className="form-label">Select Candidate</label>
                    <select
                      className="form-control"
                      value={selectedCandidate}
                      onChange={(e) => setSelectedCandidate(e.target.value)}
                    >
                      <option value="">Choose a candidate</option>
                      {election.candidates.map((candidate, index) => (
                        <option key={index} value={candidate}>
                          {candidate}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleVote}
                    disabled={voting || !selectedCandidate}
                  >
                    {voting ? 'Voting...' : 'Vote'}
                  </button>
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="fas fa-link"></i> Your vote will be immutably recorded on the blockchain
                    </small>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="mt-4">
                  <button className="btn btn-info me-2" onClick={handleViewResults}>
                    View Results
                  </button>
                  <button className="btn btn-secondary" onClick={handleViewBlockchainInfo}>
                    Blockchain Info
                  </button>
                </div>
              )}

              {showResults && results && (
                <div className="mt-4">
                  <h5>Election Results</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Votes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(results.results).map(([candidate, votes]) => (
                          <tr key={candidate}>
                            <td>{candidate}</td>
                            <td>{votes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p><strong>Total Votes:</strong> {results.totalVotes}</p>
                  </div>
                </div>
              )}

              {showBlockchainInfo && blockchainData && (
                <div className="mt-4">
                  <h5>Blockchain Verification</h5>
                  <div className="card">
                    <div className="card-body">
                      <p><strong>Blockchain Status:</strong> <span className={`badge bg-${blockchainData.isChainValid ? 'success' : 'danger'}`}>{blockchainData.isChainValid ? 'Valid' : 'Invalid'}</span></p>
                      <p><strong>Votes Recorded on Blockchain:</strong> {blockchainData.blockchainVotes}</p>
                      <p><small className="text-muted">All votes are immutably recorded on the blockchain for transparency and verification.</small></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Candidates</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {election.candidates.map((candidate, index) => (
                  <li key={index} className="list-group-item">
                    {candidate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetails;