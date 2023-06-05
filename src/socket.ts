import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

interface User {
	id: string;
	name: string;
}

enum MessageEvent {
	MESSAGE = 'message',
	JOINED = 'user_joined',
	LEFT = 'user_left',
	USERS = 'connected_users',
}

const PORT: number = +(process.env.SOCKET_PORT || 0);
const ORIGIN: string = process.env.SOCKET_CORS_ORIGIN || '';

let io: Server | null = null;

const startSocketServer = () => {
	// create a Socket.io instance
	io = new Server(PORT, {
		cors: {
			origin: ORIGIN,
			methods: ['GET', 'POST'],
		},
	});
	let connectedUsers: User[] = [];

	console.log(`⚡️[server]: Socket server is running at http://localhost:${PORT}`);

	// set up Socket.io event handlers
	io.on('connection', (socket) => {
		const userId = socket.handshake.query.userId?.toString();
		const userName = socket.handshake.query.userName?.toString();
		if (userId && userName && !connectedUsers.some(({ id }) => id === userId)) {
			connectedUsers.push({ id: userId, name: userName });

			socket.join(userId);
		}

		socket.broadcast.emit(MessageEvent.JOINED, { id: userId, name: userName });

		socket.emit(MessageEvent.USERS, connectedUsers);

		socket.on('disconnect', () => {
			connectedUsers = connectedUsers.filter(({ id }) => id != userId);

			io?.emit(MessageEvent.LEFT, userId);
		});
	});
};

const sendMessage = (data: any) => {
	console.log(data);
	try {
		const receiver = data?.receiver?.id;
		if (receiver) {
			io?.to(receiver).emit(MessageEvent.MESSAGE, data);
		}
	} catch (err) {
		console.error(err);
	}
};

export { startSocketServer, sendMessage };
