import dotenv from 'dotenv';
import client, { Connection, Channel, ConsumeMessage } from 'amqplib';
import { sendMessage } from './socket';

dotenv.config();

const LINKS = process.env.RABBIT_LINKS || '';
const QUEUE = process.env.RABBIT_QUEUE || 'messages';

export const connectMQ = async (link: string) => {
	try {
		const connection: Connection = await client.connect(link);
		const channel: Channel = await connection.createChannel();
		await channel.assertQueue(QUEUE);

		console.log(`Successfully connected to RabbitMQ ${link}!`);

		channel.consume(QUEUE, consumer(channel));
	} catch (error) {
		console.error(error);
	}
};

export const connect = () => {
	const links = LINKS.split(',');
	links.forEach((link) => connectMQ(link));
};

const consumer =
	(channel: Channel) =>
	(message: ConsumeMessage | null): void => {
		if (message) {
			const data = JSON.parse(message.content.toString());
			sendMessage(data);
			channel.ack(message);
		}
	};
