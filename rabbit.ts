import client, { Connection, Channel, ConsumeMessage } from 'amqplib';

const QUEUE = 'messages';

export const connect = async () => {
	try {
		const connection: Connection = await client.connect('amqp://localhost:5672');
		const channel: Channel = await connection.createChannel();
		await channel.assertQueue(QUEUE);

		channel.consume(QUEUE, consumer(channel));
	} catch (error) {
		console.error(error);
	}
};

const consumer =
	(channel: Channel) =>
	(message: ConsumeMessage | null): void => {
		if (message) {
			const data = JSON.parse(message.content.toString());
			console.log(data);
			channel.ack(message);
		}
	};
