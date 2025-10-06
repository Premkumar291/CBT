import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createElection } from '../services/electionService';

const CreateElection = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: ['']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const { title, description, startDate, endDate, candidates } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCandidateChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setFormData({ ...formData, candidates: newCandidates });
  };

  const addCandidate = () => {
    setFormData({ ...formData, candidates: [...candidates, ''] });
  };

  const removeCandidate = (index) => {
    if (candidates.length <= 1) return;
    const newCandidates = candidates.filter((_, i) => i !== index);
    setFormData({ ...formData, candidates: newCandidates });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate candidates
    const validCandidates = candidates.filter(candidate => candidate.trim() !== '');
    if (validCandidates.length < 2) {
      setError('At least 2 candidates are required');
      setLoading(false);
      return;
    }

    try {
      await createElection({ 
        title, 
        description, 
        startDate, 
        endDate, 
        candidates: validCandidates 
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Create New Election</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={title}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={description}
                    onChange={onChange}
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={startDate}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={endDate}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Candidates</label>
                  {candidates.map((candidate, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Candidate ${index + 1}`}
                        value={candidate}
                        onChange={(e) => handleCandidateChange(index, e.target.value)}
                        required
                      />
                      {candidates.length > 1 && (
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => removeCandidate(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-2"
                    onClick={addCandidate}
                  >
                    Add Candidate
                  </button>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Election'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateElection;