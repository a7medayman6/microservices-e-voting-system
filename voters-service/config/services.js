require('dotenv').config();


const services = {
    'topics': process.env.TOPICS_SERVICE | 'http://localhost:3000/api/v1/topics',
    'voters': process.env.VOTERS_SERVICE | 'http://localhost:3001/api/v1/voters',
    'voting': process.env.VOTING_SERVICE | 'http://localhost:3002/api/v1/voting'

}


module.exports = services