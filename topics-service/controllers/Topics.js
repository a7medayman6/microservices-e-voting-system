const express = require('express');
const router = express.Router();
const logger = require('../utils/Logger');
const Topic = require('../models/Topics.js');
const statusCodes = require('../config/status.codes.js');
const filename = 'controllers/Topics.js';


/*
API Description: topics service for e-voting application, has following endpoints:
    - /topics: GET, returns list of topics
    - /topics/{topic_id}: GET, returns topic with given id
    - /topics/{topic_id}/results: GET, returns results for given topic
    - /topics/{topic_id}: PATCH, updates topic with given id
    - /topics/{topic_id}: DELETE, deletes topic with given id
    - /topics: POST, creates new topic
    - /topics/exists: GET, checks if topic with given id exists
*/

/**
 * Get all topics.
 * Request body should be empty.
 * Endpoint: GET /api/v1/topics
 * Example: /api/v1/topics
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing all topics data, or an error message if an error occurs.
*/
const getTopics = async(req, res) =>
{
    try
    {
        const topics = await Topic.find()
        logger.log(filename, 'Sending all topics ...');
        res.status(200).json({message: 'OK', data: {topics}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};


/**
 * Get topic by id.
 * Request body should be empty.
 * Endpoint: GET /api/v1/topics/{topic_id}
 * Example: /api/v1/topics/1
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing topic data, or an error message if an error occurs.
 * 
*/
const getTopic = async(req, res) =>
{
    try
    {
        const topic = await Topic.findById(req.params.topic_id)
        logger.log(filename, 'Sending topic ...');
        res.status(200).json({message: 'OK', data: {topic}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};

/**
 * Get topic results.
 * Request body should be empty.
 * Endpoint: GET /api/v1/topics/{topic_id}/results
 * Example: /api/v1/topics/1/results
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing topic results, or an error message if an error occurs.
 * 
 */
const getTopicResults = async(req, res) =>
{
    try
    {
        const topic = await Topic.findById(req.params.topic_id)
        logger.log(filename, 'Sending topic results ...');
        res.status(200).json({message: 'OK', data: {topic}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};


/**
 * Update topic.
 * Request body should be empty.
 * Endpoint: PATCH /api/v1/topics/{topic_id}
 * Example: /api/v1/topics/1
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing topic data, or an error message if an error occurs.
 *
 */
const updateTopic = async(req, res) =>
{
    try
    {
        const topic = await Topic.findByIdAndUpdate(req.params.topic_id, req.body, {new: true})
        logger.log(filename, 'Updating topic ...');
        res.status(200).json({message: 'OK', data: {topic}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};

/**
 * Delete topic.
 * Request body should be empty.
 * Endpoint: DELETE /api/v1/topics/{topic_id}
 * Example: /api/v1/topics/1
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing topic data, or an error message if an error occurs.
 * 
 */ 
const deleteTopic = async(req, res) =>
{
    try
    {
        const topic = await Topic.findByIdAndDelete(req.params.topic_id)
        logger.log(filename, 'Deleting topic ...');
        res.status(200).json({message: 'OK', data: {topic}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};

/**
 * Create topic.
 * Request body should be empty.
 * Endpoint: POST /api/v1/topics
 * Example: /api/v1/topics
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing topic data, or an error message if an error occurs.
 *
 */
const createTopic = async(req, res) =>
{   
    const { title, description, choices, status } = req.body;
    try
    {   
        const topic = new Topic({ title, description, choices, status })
        logger.log(filename, 'Creating topic ...');
        await topic.save();

        res.status(201).json({message: 'OK', data: {topic}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};

/**
 * Check if topic exists.
 * Request body should be empty.
 * Endpoint: GET /api/v1/topics/exists/{topic_id}
 * Example: /api/v1/topics/exists/1
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing topic data, or an error message if an error occurs.
 * 
 */ 
const checkTopicExists = async(req, res) =>
{
    try
    {
        const topic = await Topic.findById(req.params.topic_id)
        logger.log(filename, 'Checking if topic exists ...');
        if(topic === null)
            return res.status(200).json({message: 'OK', exists: false, data: {topic}})

        res.status(200).json({message: 'OK', exists: true, data: {topic}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};

module.exports = {
    
    getTopics,
    getTopic,
    getTopicResults,
    updateTopic,
    deleteTopic,
    createTopic,
    checkTopicExists
}