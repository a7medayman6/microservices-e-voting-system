const amqp = require('amqplib');

const filename = 'rabbitMQ.js';
const logger = require('../utils/Logger.js');

const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://127.0.0.1:5673';

const QUEUE_NAME = "votes";


async function createChannel() 
{
  try {
    const connection = await amqp.connect(RABBITMQ_URI); // Change the URL as per your RabbitMQ configuration
    logger.log(filename, `Connected to RabbitMQ at ${RABBITMQ_URI}`);
    const channel = await connection.createChannel();

    logger.log(filename, `Create to RabbitMQ channel at ${channel}`);
  
    
    // Create the queue if it doesn't exist
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    logger.log(filename, `Created queue ${QUEUE_NAME}`);
    return {connection, channel};
  } 
  catch (error) 
  {
    logger.error(filename, error);
    return null;
  }
}


const sendMessageToQueue = async(jsonData)=> 
{
    try {
      // Connect to RabbitMQ
      const {conn, channel} = await createChannel(); 

      logger.log(filename, `Sending message to queue ${QUEUE_NAME}, ${typeof QUEUE_NAME}, ${typeof JSON.stringify(jsonData)}`);
      // Convert JSON to string and send to the queue

      await channel.assertQueue(QUEUE_NAME, { durable: false });
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(jsonData)));
  
      console.log('JSON data sent to the queue');
  
      await channel.close();
    } 
    catch (error) 
    {
      console.error('Error:', error);
    }
    finally 
    {
        if (conn) await conn.close();
    }
}


module.exports = {
    sendMessageToQueue
};