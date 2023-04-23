import dotenv from 'dotenv';
import client, { Connection, Channel, ConsumeMessage } from 'amqplib';

dotenv.config();

const LINK = process.env.RABBIT_LINK || '';
const QUEUE = process.env.RABBIT_QUEUE || 'messages';

export const connectMQ = async () => {
	try {
		const connection: Connection = await client.connect(LINK);
		const channel: Channel = await connection.createChannel();
		await channel.assertQueue(QUEUE);
		console.log('Successfully connected to Rabbit message queue!');

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
