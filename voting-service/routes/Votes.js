const express = require('express');
const router = express.Router();

module.exports = {
    vote,
    getVotes,
    getVote,
    getTopicVotes,
    getVoterVotes,
    deleteAllVotes

} = require('../controllers/Votes')


/* @desc Get all votes */
router.get('/', getVotes)

/* @desc Get a vote */
router.get('/:vote_id', getVote)

/* @desc Get topic votes */
router.get('/topic/topic_id', getTopicVotes)

/* @desc Get voter votes */
router.get('/voter/:voter_id', getVoterVotes)

/* @desc Vote */
router.post('/', vote)

/* @desc Delete all votes */
router.delete('/', deleteAllVotes)



module.exports = router