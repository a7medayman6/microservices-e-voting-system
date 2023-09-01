import pika
import json
from DB import MongoDB_Handler 

class Subscriber:
    def __init__(self, config):
        self.URI = config['RABBITMQ_URI']
        self.queueName = config['QUEUE_NAME']
        
        self.connection = self._create_connection(self.URI)
        self.channel = self._declare_channel(self.queueName)

        self.db = MongoDB_Handler(config)


    def _create_connection(self, URI):
        host = ':'.join(URI.split(':')[0:-1])
        port = int(URI.split(':')[-1])
        parameters = pika.ConnectionParameters(host=host, port=port)
        return pika.BlockingConnection(parameters)
  
    def _declare_channel(self, queueName):
        channel = self.connection.channel()
        channel.queue_declare(queue=queueName)
        return channel
        
    def callback(self, ch, method, properties, body):
        data = json.loads(body)
        print(f" [x] Received {data}")
        # TODO: Add logic to save to MongoDB

        topicId = data['topicId']
        voterId = data['voterId']
        choiceId = data['choiceId']

        vote = {'voterId': voterId, 'choiceId': choiceId}
        print(f" [x] Saving vote {vote} ...")
        self.db.update_document_by_id(topicId, vote)
        print(f" [x] Vote saved!")

    def consume(self):
        self.channel.basic_consume(
            queue=self.queueName, on_message_callback=self.callback, auto_ack=True
        )
        print(" [*] Waiting for messages. To exit press CTRL+C")
        self.channel.start_consuming()

    def close_connection(self):
        self.connection.close()