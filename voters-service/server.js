const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('./utils/Logger.js');
const db = require('./config/db');

const app = express();

// enable cors
app.use(cors({origin: '*'}));

app.use(express.json());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());


// loggers
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms -  :body - :req[content-length]  - :res[content-length]'));


const version = 'v1';
const testPath = `/api/${version}/test`
const votersPath = `/api/${version}/voters`;

// routes
app.use(`${testPath}`, require('./routes/Test.js'));
app.use(`${votersPath}/`, require('./routes/Voters.js'));


const PORT = process.env.PORT || 3000;
const filename = 'server.js';

app.listen(PORT, () => 
{    
    logger.log(filename, `Server Started at ${PORT} ...`);
})