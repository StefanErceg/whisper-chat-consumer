import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

const PORT: number = +(process.env.SOCKET_PORT || 0);
const ORIGIN: string = process.env.SOCKET_CORS_ORIGIN || '';

const startSocketServer = () => {
	// create a Socket.io instance
	const io = new Server(PORT, {
		cors: {
			origin: ORIGIN,
			methods: ['GET', 'POST'],
		},
	});
	console.log(`⚡️[server]: Socket server is running at http://localhost:${PORT}`);

	// set up Socket.io event handlers
	io.on('connection', (socket) => {
		console.log('a user connected');

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});
};

export { startSocketServer };
