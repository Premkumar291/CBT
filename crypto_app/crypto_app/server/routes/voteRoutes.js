const express = require('express');
const { castVote, getResults, verifyVote, getBlockchainVerification } = require('../controllers/voteController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, castVote);
router.get('/results/:electionId', authenticate, getResults);
router.get('/verify/:voteId', authenticate, verifyVote);
router.get('/blockchain/:electionId', authenticate, getBlockchainVerification);

module.exports = router;