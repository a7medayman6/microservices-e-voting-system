const express = require('express');
const router = express.Router();
const logger = require('../utils/Logger');
const Vote = require('../models/Votes.js');
const statusCodes = require('../config/status.codes.js');
const filename = 'controllers/votes.js';
const axios = require('axios');
const services = require('../config/services.js');
const { json } = require('body-parser');
const { sendMessageToQueue } = require('../config/rabbitMQ.js');


const topics_service_url = services['topics']
const voters_service_url = services['voters']


const vote = async(req, res) =>
{
    const { topicId, voterId, choiceId } = req.body;
    if( !topicId || !voterId || !choiceId )
    {
        return res.status(statusCodes.BAD_REQUEST).json({ message: 'Bad request' });
    }
    logger.log(filename, `topicId: ${topicId}, voterId: ${voterId}, choiceId: ${choiceId}`);
    // check voterID validation from voter service
    logger.log(filename, `services object: ${JSON.stringify(services)}`);
    logger.log(filename, `calling voters_service_url: ${voters_service_url}`)

    try
    {

        let resp = await axios.get(`${voters_service_url}/${voterId}`)
        if (resp.status != 200 || resp.exists == false)
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'voter national ID not registered' });
        logger.log(filename, `resp.data: ${JSON.stringify(resp.data)}`);
    }
    catch(err)
    {
        logger.error(filename, 'err: getting voter');
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }   
    logger.log(filename, `calling topics_service_url: ${topics_service_url}`)
    // check topicID validation from topic service

    try
    {
        resp = await axios.get(`${topics_service_url}/exists/${topicId}`)
        if (resp.status != statusCodes.OK || resp.exists == false)
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Topic not found' });
        
        logger.log(filename, `resp.data: ${JSON.stringify(resp.data)}`);
    }
    catch(err)
    {
        logger.error(filename, 'err: getting topic');
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
    logger.log(filename, `resp.data.choices: ${JSON.stringify(resp.data.data.topic.choices)}`);
    if (choiceId < 0 || choiceId >= resp.data.data.topic.choices.length)
        return res.status(statusCodes.BAD_REQUEST).json({ message: 'Choice not found' });

    try
    {

        // check voter hasn't already voted for this topic
        let prev_vote = await Vote.findOne({ 'topicId': `${topicId}`, 'voterId': `${voterId}` });
        if (prev_vote)
           return res.status(statusCodes.BAD_REQUEST).json({ message: 'Voter has already voted for this topic' });
        
        logger.log(filename, `resp.data: ${JSON.stringify(resp.data)}`);

    }
    catch(err)
    {
        logger.error(filename, 'err: checking voting' + err);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }

    // create vote
    const newVote = new Vote({ topicId, voterId, choiceId });
    logger.log(filename, `newVote: ${JSON.stringify(newVote)}`);
    sendMessageToQueue(newVote);
    logger.log(filename, `${JSON.stringify(newVote)}`);
    
    try
    {
        await newVote.save();
        res.status(statusCodes.CREATED).json({ message: 'Vote created successfully', data: {vote} });
        logger.log(filename, `newVote: ${JSON.stringify(newVote)}`);
    }
    catch(err)
    {
        logger.error(filename, 'err: saving' + err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

const getVotes = async(req, res) =>
{
    try
    {
        const votes = await Vote.find();
        res.status(statusCodes.OK).json({ message: 'OK', data: {votes} });
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

const getVote = async(req, res) =>
{
    try
    {
        const vote = await Vote.findById(req.params.voteId);
        res.status(statusCodes.OK).json({ message: 'OK', data: {vote} });
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

const getTopicVotes = async(req, res) =>
{
    try
    {
        const votes = await Vote.find({ topicId: req.params.topicId });
        res.status(statusCodes.OK).json({ message: 'OK', data: {votes} });
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

const getVoterVotes = async(req, res) =>
{
    try
    {
        const votes = await Vote.find({ voterId: req.params.voterId });
        res.status(statusCodes.OK).json({ message: 'OK', data: {votes} });
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

const deleteAllVotes = async(req, res) =>
{
    try
    {
        await Vote.deleteMany();
        res.status(statusCodes.OK).json({ message: 'OK' });
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

module.exports = {
    vote,
    getVotes,
    getVote,
    getTopicVotes,
    getVoterVotes,
    deleteAllVotes
}