const express = require('express');
const router = express.Router();
const logger = require('../utils/Logger');
const Voter = require('../models/Voters.js');
const statusCodes = require('../config/status.codes.js');
const filename = 'controllers/voters.js';
const uuid = require('uuid');


const services = require('../config/services.js');
/*

    - **Description**: A service that allows to create a user and get an id to vote, and validates users ids for other services.
    - **Port**: 3001
    - **Endpoints**:
        - **POST** `/voters`: Create a new voter, and return the voter id.
        - **GET** `/voters/{voterId}`: Get a voter by nationalId, to validate the voter nationalId.
*/

const createVoter = async (req, res) => {
    
    const { name } = req.body;
    const status = 'active';
    const voterId = uuid.v4();

    if (!name) {
        logger.error(filename, 'Bad request');
        res.status(statusCodes.BAD_REQUEST).json({ message: 'Bad request' });
    }
    
    try {
        logger.log(filename, 'Creating voter ...');
        const newVoter = new Voter({ name, voterId, status });
        logger.log(filename, 'Saving voter ...');
        await newVoter.save();
        res.status(statusCodes.CREATED).json({ id: voterId, message: 'Voter created successfully' });
    } catch (err) {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

const getVoter = async (req, res) => {
    try {
        const voter = await Voter.find({ 'nationalId': req.params.voterId });
        if (voter.length === 0)
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Voter not found', exists: false });

        res.status(statusCodes.OK).json({ message: 'OK', exists: true, data: {voter} });
    } catch (err) {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

const getAllVoters = async (req, res) => {
    try {
        const voters = await Voter.find();
        res.status(statusCodes.OK).json({ message: 'OK', data: {voters} });
    } catch (err) {
        logger.error(filename, err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

module.exports = {
    createVoter,
    getVoter,
    getAllVoters
}