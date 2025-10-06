import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllElections } from '../services/electionService';
import { getCurrentUser } from '../services/authService';

const Home = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await getAllElections();
        setElections(data);
      } catch (err) {
        setError('Failed to fetch elections');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatus = (election) => {
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

  const getStatusClass = (election) => {
    const status = getStatus(election);
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Upcoming':
        return 'info';
      case 'Completed':
        return 'dark';
      default:
        return 'primary';
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Elections</h2>
        {user && user.role === 'admin' && (
          <Link to="/create-election" className="btn btn-primary">
            Create Election
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {elections.length === 0 ? (
        <div className="alert alert-info">
          No elections available at the moment.
        </div>
      ) : (
        <div className="row">
          {elections.map((election) => (
            <div key={election.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{election.title}</h5>
                  <p className="card-text">{election.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Start: {formatDate(election.startDate)}<br />
                      End: {formatDate(election.endDate)}
                    </small>
                  </p>
                  <span className={`badge bg-${getStatusClass(election)}`}>
                    {getStatus(election)}
                  </span>
                  <div className="mt-3">
                    <Link to={`/election/${election.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;