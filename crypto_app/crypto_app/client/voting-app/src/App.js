import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreateElection from './components/CreateElection';
import ElectionDetails from './components/ElectionDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-election" element={<CreateElection />} />
          <Route path="/election/:id" element={<ElectionDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
