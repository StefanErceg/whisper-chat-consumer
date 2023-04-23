import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

const PORT: number = +(process.env.SOCKET_PORT || 0);

const startSocketServer = () => {
	// create a Socket.io instance
	const io = new Server(PORT);

	// set up Socket.io event handlers
	io.on('connection', (socket) => {
		console.log('a user connected');

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});
};

export { startSocketServer };
