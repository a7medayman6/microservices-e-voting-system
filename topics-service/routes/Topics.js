const express = require('express');
const router = express.Router();

const {
    getTopics,
    getTopic,
    getTopicResults,
    updateTopic,
    deleteTopic,
    createTopic,
    checkTopicExists
} = require('../controllers/Topics')


/* @desc Get all topics */
router.get('/', getTopics)

/* @desc Get topic */
router.get('/:topic_id', getTopic)

/* @desc Get topic results */
router.get('/:topic_id/results', getTopicResults)

/* @desc Update topic */
router.patch('/:topic_id', updateTopic)

/* @desc Delete topic */
router.delete('/:topic_id', deleteTopic)

/* @desc Create topic */
router.post('/', createTopic)

/* @desc Check if topic exists */
router.get('/exists/:topic_id', checkTopicExists)


module.exports = router