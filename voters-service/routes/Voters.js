const express = require('express');
const router = express.Router();

module.exports = {
    createVoter,
    getVoter,
    getAllVoters

} = require('../controllers/Voters')

/* @desc Create voter */
router.post('/', createVoter);

/* @desc Get voter */
router.get('/:voterId', getVoter);

/* @desc Get all voters */
router.get('/', getAllVoters);

module.exports = router