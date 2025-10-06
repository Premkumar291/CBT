const express = require('express');
const { 
  createElection, 
  getAllElections, 
  getElectionById, 
  activateElection, 
  deactivateElection 
} = require('../controllers/electionController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, createElection);
router.get('/', authenticate, getAllElections);
router.get('/:id', authenticate, getElectionById);
router.put('/:id/activate', authenticate, authorizeAdmin, activateElection);
router.put('/:id/deactivate', authenticate, authorizeAdmin, deactivateElection);

module.exports = router;