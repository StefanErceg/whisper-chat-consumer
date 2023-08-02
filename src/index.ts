import { connect } from './rabbit';
import { startSocketServer } from './socket';

//connect to rabbitMQs
connect();

//start the socket server for sending messages to clients
startSocketServer();
