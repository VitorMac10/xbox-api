const amqp = require('amqplib');

const { AMQP_URL } = process.env;

function connect() {
  return amqp.connect(AMQP_URL).then(conn => conn.createChannel());
}

function createQueue(channel, queue) {
  return new Promise((resolve, reject) => {
    try {
      channel.assertQueue(queue, { durable: true });
      resolve(channel);
    }
    catch (err) { reject(err) }
  });
}

function sendToQueue(queue, message) {
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
    .catch(err => console.error(err))
}

function consume(queue, callback) {
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => channel.consume(queue, callback, { noAck: true }))
    .catch(err => console.error(err));
}

module.exports = {
  sendToQueue,
  consume
}