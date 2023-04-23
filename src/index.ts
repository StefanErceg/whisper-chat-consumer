import { connectMQ } from './rabbit';
import { startSocketServer } from './socket';

//connect to rabbitMQ
connectMQ();

//start the socket server for sending messages to clients
startSocketServer();
