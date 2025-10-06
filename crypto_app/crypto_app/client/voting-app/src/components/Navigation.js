import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { getWalletAddress, metaMaskLogout } from '../services/metamaskAuthService';

const Navigation = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    // Check if user logged in with MetaMask
    const walletAddress = getWalletAddress();
    if (walletAddress) {
      metaMaskLogout();
    } else {
      logout();
    }
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Blockchain Voting</Link>
        
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              <Link className="nav-link" to="/">Home</Link>
              {user.role === 'admin' && (
                <Link className="nav-link" to="/create-election">Create Election</Link>
              )}
              <span className="navbar-text text-white me-3">
                Welcome, {user.name}
                {getWalletAddress() && (
                  <small className="d-block">Wallet: {getWalletAddress().substring(0, 6)}...{getWalletAddress().substring(38)}</small>
                )}
              </span>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;